import { useState, useMemo, useRef } from "react";
import {
  Search, Receipt, Calendar, CreditCard, UserX, UserPlus, X,
  Clock, Users, MapPin, Banknote, Hash, ArrowLeft, List, FileText,
} from "lucide-react";
import { useThemeClasses } from "../theme-context";
import { DateFilterBar, type Period } from "./DateFilterBar";
import type { DateRange } from "./CustomRangePicker";
import { useAnalyticsCurrency } from "./currency";

type EventKind = "order" | "reservation" | "payment" | "no-show" | "walk-in";
type EventStatus = "completed" | "paid" | "no-show" | "refunded";
type PaymentMethod = "Credit Card" | "Cash" | "—";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  currency?: "foreign" | "domestic";
}

interface HistoryEvent {
  id: string;
  kind: EventKind;
  status: EventStatus;
  timestamp: number; // ms epoch
  guest: string;
  table: string;
  partySize?: number;
  amount?: number;     // foreign total ($)
  amountKrw?: number;  // domestic total (₩) — tracked independently
  paymentMethod?: PaymentMethod;
  items?: OrderItem[];
  reservedAt?: string; // HH:MM scheduled
  arrivedAt?: string;  // HH:MM
  paidAt?: string;     // HH:MM
  notes?: string;
  linkedToId?: string; // walk-in linked to no-show
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function makeTime(daysAgo: number, hours: number, mins = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, mins, 0, 0);
  return d.getTime();
}

const EVENTS: HistoryEvent[] = [
  // Today
  {
    id: "h-t1", kind: "order", status: "completed", timestamp: makeTime(0, 12, 35),
    guest: "Park K.", table: "Table 2", partySize: 4, amount: 156.5, paymentMethod: "Credit Card",
    paidAt: "12:35", items: [
      { name: "Americano", qty: 2, price: 3.5 }, { name: "Cafe Latte", qty: 1, price: 4 },
      { name: "Honey Cold Brew", qty: 1, price: 5.5 }, { name: "Croissant", qty: 2, price: 4 },
      { name: "Tiramisu", qty: 1, price: 6.5 },
    ],
  },
  {
    id: "h-t2", kind: "payment", status: "paid", timestamp: makeTime(0, 13, 12),
    guest: "Lee S.", table: "Table 3", partySize: 3, amount: 41, amountKrw: 88_000, paymentMethod: "Cash",
    paidAt: "13:12",
  },
  {
    id: "h-t3", kind: "reservation", status: "completed", timestamp: makeTime(0, 11, 0),
    guest: "Choi M.", table: "Table 10", partySize: 5, reservedAt: "11:00", arrivedAt: "11:05",
    notes: "Confirmed and seated on time.",
  },
  // Yesterday
  {
    id: "h-y1", kind: "order", status: "completed", timestamp: makeTime(1, 12, 48),
    guest: "Cho W.", table: "Table 2", partySize: 4, amount: 88.4, paymentMethod: "Credit Card",
    paidAt: "12:48", items: [
      { name: "Pad Thai", qty: 2, price: 14 }, { name: "Green Curry", qty: 1, price: 16 },
      { name: "Iced Latte", qty: 3, price: 4.3 }, { name: "Spring Rolls", qty: 2, price: 8 },
    ],
  },
  {
    id: "h-y2", kind: "no-show", status: "no-show", timestamp: makeTime(1, 19, 0),
    guest: "Lim S.", table: "Table 3", partySize: 4, reservedAt: "19:00",
    notes: "No-show after 20-minute grace period.",
  },
  {
    id: "h-y3", kind: "walk-in", status: "completed", timestamp: makeTime(1, 19, 20),
    guest: "Walk-in", table: "Table 3", partySize: 3, amount: 67.5, amountKrw: 145_000, paymentMethod: "Cash",
    arrivedAt: "19:20", paidAt: "20:45", linkedToId: "h-y2", items: [
      { name: "Mushroom Risotto", qty: 1, price: 18 }, { name: "Caesar Salad", qty: 2, price: 12 },
      { name: "Garlic Bread", qty: 1, price: 7 }, { name: "Lemonade", qty: 3, price: 4.5 },
    ],
  },
  {
    id: "h-y4", kind: "order", status: "completed", timestamp: makeTime(1, 18, 30),
    guest: "Kim E.", table: "Table 6", partySize: 6, amount: 184.25, paymentMethod: "Credit Card",
    paidAt: "20:55", items: [
      { name: "Seafood Pasta", qty: 2, price: 22 }, { name: "Carbonara Pasta", qty: 2, price: 18 },
      { name: "T-bone Steak", qty: 1, price: 38 }, { name: "Caesar Salad", qty: 2, price: 12 },
      { name: "Tiramisu", qty: 2, price: 6.5 },
    ],
  },
  {
    id: "h-y5", kind: "no-show", status: "no-show", timestamp: makeTime(1, 21, 0),
    guest: "Go H.", table: "Table 1", partySize: 2, reservedAt: "21:00",
  },
  {
    id: "h-y6", kind: "walk-in", status: "completed", timestamp: makeTime(1, 21, 20),
    guest: "Walk-in", table: "Table 1", partySize: 2, amount: 32, paymentMethod: "Credit Card",
    arrivedAt: "21:20", paidAt: "22:10", linkedToId: "h-y5", items: [
      { name: "Cappuccino", qty: 2, price: 4.5 }, { name: "Cheesecake", qty: 1, price: 7 },
      { name: "Hot Chocolate", qty: 1, price: 5 }, { name: "Croissant", qty: 2, price: 4 },
    ],
  },
  {
    id: "h-y7", kind: "payment", status: "refunded", timestamp: makeTime(1, 13, 30),
    guest: "Bae R.", table: "Table 5", partySize: 2, amount: 18.5, paymentMethod: "Credit Card",
    paidAt: "13:30", notes: "Refund issued for cancelled appetizer.",
  },
  // 2 days ago
  {
    id: "h-2d1", kind: "order", status: "completed", timestamp: makeTime(2, 11, 50),
    guest: "Seong L.", table: "Table 2", partySize: 4, amount: 46.0, amountKrw: 164_000, paymentMethod: "Cash",
    paidAt: "13:30", items: [
      { name: "Vanilla Latte", qty: 2, price: 5 },
      { name: "Avocado Toast", qty: 2, price: 14 },
      { name: "Kimchi", qty: 1, price: 5000, currency: "domestic" },
      { name: "Bibimbap", qty: 1, price: 14000, currency: "domestic" },
      { name: "Soju", qty: 1, price: 7000, currency: "domestic" },
      { name: "Bulgogi", qty: 1, price: 18000, currency: "domestic" },
      { name: "Orange Juice", qty: 1, price: 6 },
    ],
  },
  {
    id: "h-2d2", kind: "no-show", status: "no-show", timestamp: makeTime(2, 18, 30),
    guest: "Noh K.", table: "Table 5", partySize: 4, reservedAt: "18:30",
  },
  {
    id: "h-2d3", kind: "walk-in", status: "completed", timestamp: makeTime(2, 18, 50),
    guest: "Walk-in", table: "Table 5", partySize: 4, amount: 112.8, paymentMethod: "Credit Card",
    arrivedAt: "18:50", paidAt: "20:20", linkedToId: "h-2d2", items: [
      { name: "Ribeye Steak", qty: 2, price: 36 }, { name: "Mashed Potatoes", qty: 2, price: 6 },
      { name: "Red Wine", qty: 2, price: 11 }, { name: "Tiramisu", qty: 1, price: 6.5 },
    ],
  },
  {
    id: "h-2d4", kind: "order", status: "completed", timestamp: makeTime(2, 19, 30),
    guest: "Ha D.", table: "Table 10", partySize: 6, amount: 224.6, paymentMethod: "Credit Card",
    paidAt: "21:55",
  },
  {
    id: "h-2d5", kind: "payment", status: "paid", timestamp: makeTime(2, 21, 10),
    guest: "Min C.", table: "Table 1", partySize: 2, amount: 22, amountKrw: 47_000, paymentMethod: "Cash",
  },
  // 3 days ago
  {
    id: "h-3d1", kind: "order", status: "completed", timestamp: makeTime(3, 12, 30),
    guest: "Koo B.", table: "Table 3", partySize: 4, amount: 94.4, paymentMethod: "Credit Card",
  },
  {
    id: "h-3d2", kind: "no-show", status: "no-show", timestamp: makeTime(3, 17, 30),
    guest: "Yoo M.", table: "Table 6", partySize: 6, reservedAt: "17:30",
  },
  {
    id: "h-3d3", kind: "walk-in", status: "completed", timestamp: makeTime(3, 17, 50),
    guest: "Walk-in", table: "Table 6", partySize: 5, amount: 0, amountKrw: 104_000, paymentMethod: "Credit Card",
    arrivedAt: "17:50", linkedToId: "h-3d2", items: [
      { name: "Bibimbap", qty: 3, price: 14000, currency: "domestic" },
      { name: "Bulgogi", qty: 2, price: 18000, currency: "domestic" },
      { name: "Soju", qty: 2, price: 7000, currency: "domestic" },
      { name: "Kimchi Pancake", qty: 1, price: 12000, currency: "domestic" },
    ],
  },
  {
    id: "h-3d4", kind: "order", status: "completed", timestamp: makeTime(3, 19, 0),
    guest: "Sun R.", table: "Table 8", partySize: 3, amount: 58.6, amountKrw: 126_000, paymentMethod: "Cash",
  },
  {
    id: "h-3d5", kind: "order", status: "completed", timestamp: makeTime(3, 20, 0),
    guest: "Oh D.", table: "Table 2", partySize: 4, amount: 104.5, paymentMethod: "Credit Card",
  },
];

const TABS: { id: "all" | EventKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "order", label: "Orders" },
  { id: "reservation", label: "Reservations" },
  { id: "payment", label: "Payments" },
  { id: "no-show", label: "No-Shows" },
  { id: "walk-in", label: "Walk-ins" },
];

function relDay(ts: number) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((start.getTime() - ts) / DAY);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function fmtTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function kindIcon(kind: EventKind) {
  switch (kind) {
    case "order": return Receipt;
    case "reservation": return Calendar;
    case "payment": return CreditCard;
    case "no-show": return UserX;
    case "walk-in": return UserPlus;
  }
}

function kindAccent(kind: EventKind, isDark: boolean) {
  switch (kind) {
    case "order": return isDark ? "text-blue-400 bg-blue-500/15" : "text-blue-600 bg-blue-50";
    case "reservation": return isDark ? "text-emerald-400 bg-emerald-500/15" : "text-emerald-600 bg-emerald-50";
    case "payment": return isDark ? "text-violet-400 bg-violet-500/15" : "text-violet-600 bg-violet-50";
    case "no-show": return isDark ? "text-slate-400 bg-slate-500/15" : "text-slate-600 bg-slate-100";
    case "walk-in": return isDark ? "text-sky-400 bg-sky-500/15" : "text-sky-600 bg-sky-50";
  }
}

function statusBadge(status: EventStatus, isDark: boolean) {
  const map: Record<EventStatus, string> = {
    completed: isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-700",
    paid: isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-blue-700",
    "no-show": isDark ? "bg-slate-500/20 text-slate-300" : "bg-slate-100 text-slate-600",
    refunded: isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-700",
  };
  const labels: Record<EventStatus, string> = {
    completed: "Completed", paid: "Paid", "no-show": "No-Show", refunded: "Refunded",
  };
  return { cls: map[status], label: labels[status] };
}

export function HistoryView() {
  const tc = useThemeClasses();
  const { pick, isDomestic } = useAnalyticsCurrency();
  const [tab, setTab] = useState<"all" | EventKind>("all");
  const [period, setPeriod] = useState<Period>("week");
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"compact" | "receipts">("compact");

  // Draggable tabs
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabsDragRef = useRef<{ startX: number; startScroll: number; dragging: boolean; moved: boolean } | null>(null);
  const onTabsPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tabsRef.current;
    if (!el) return;
    tabsDragRef.current = { startX: e.clientX, startScroll: el.scrollLeft, dragging: true, moved: false };
    el.setPointerCapture(e.pointerId);
  };
  const onTabsPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const ref = tabsDragRef.current;
    const el = tabsRef.current;
    if (!ref || !ref.dragging || !el) return;
    const dx = e.clientX - ref.startX;
    if (Math.abs(dx) > 3) ref.moved = true;
    el.scrollLeft = ref.startScroll - dx;
  };
  const onTabsPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tabsRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    setTimeout(() => { tabsDragRef.current = null; }, 0);
  };

  const q = search.trim().toLowerCase();
  const isSearching = q.length > 0;
  const effectiveView: "compact" | "receipts" = isSearching ? "receipts" : viewMode;

  const filtered = useMemo(() => {
    const now = Date.now();
    let start = 0;
    let end = Number.POSITIVE_INFINITY;
    if (period === "custom" && customRange) {
      start = customRange.start.getTime();
      const e = new Date(customRange.end);
      e.setHours(23, 59, 59, 999);
      end = e.getTime();
    } else if (period === "today") {
      start = now - DAY;
    } else if (period === "week") {
      start = now - 7 * DAY;
    } else if (period === "month") {
      start = now - 30 * DAY;
    } else if (period === "3month") {
      start = now - 90 * DAY;
    }
    return EVENTS
      .filter((e) => e.timestamp >= start && e.timestamp <= end)
      .filter((e) => tab === "all" ? true : e.kind === tab)
      .filter((e) => {
        if (!q) return true;
        if (e.guest.toLowerCase().includes(q)) return true;
        if (e.table.toLowerCase().includes(q)) return true;
        if (e.id.toLowerCase().includes(q)) return true;
        if (e.paymentMethod?.toLowerCase().includes(q)) return true;
        if (e.items?.some((it) => it.name.toLowerCase().includes(q))) return true;
        return false;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [tab, period, customRange, q]);

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: 0 };
    for (const t of TABS) base[t.id] = 0;
    for (const e of EVENTS) { base.all++; base[e.kind] = (base[e.kind] ?? 0) + 1; }
    return base;
  }, []);

  const totalRevenueUsd = useMemo(() =>
    filtered.filter((e) => e.amount && e.status !== "refunded").reduce((s, e) => s + (e.amount ?? 0), 0),
  [filtered]);
  const totalRevenueKrw = useMemo(() =>
    filtered.filter((e) => e.amountKrw && e.status !== "refunded").reduce((s, e) => s + (e.amountKrw ?? 0), 0),
  [filtered]);
  const refundUsd = useMemo(() =>
    filtered.filter((e) => e.status === "refunded").reduce((s, e) => s + (e.amount ?? 0), 0),
  [filtered]);
  const refundKrw = useMemo(() =>
    filtered.filter((e) => e.status === "refunded").reduce((s, e) => s + (e.amountKrw ?? 0), 0),
  [filtered]);
  const noShowCount = useMemo(() => filtered.filter((e) => e.kind === "no-show").length, [filtered]);

  const selected = useMemo(() => filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? null, [filtered, selectedId]);
  const linkedEvent = selected?.linkedToId ? EVENTS.find((e) => e.id === selected.linkedToId) : null;
  const replacementForNoShow = selected?.kind === "no-show" ? EVENTS.find((e) => e.linkedToId === selected.id) : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* Filter bar */}
      <div className={`${tc.card} rounded-xl p-3 sm:p-4`}>
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          
          <DateFilterBar
            period={period}
            setPeriod={setPeriod}
            onRangeChange={setCustomRange}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md flex-1 min-w-[180px] ${tc.isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            <Search className={`w-3.5 h-3.5 ${tc.muted}`} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, menu item, payer name, table…"
              className={`flex-1 bg-transparent outline-none text-[0.8125rem] ${tc.text1}`}
            />
            {search && (
              <button onClick={() => setSearch("")} className={`cursor-pointer ${tc.muted} hover:opacity-80`}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        {/* Tabs — draggable, hidden scrollbar */}
        <div
          ref={tabsRef}
          onPointerDown={onTabsPointerDown}
          onPointerMove={onTabsPointerMove}
          onPointerUp={onTabsPointerUp}
          onPointerCancel={onTabsPointerUp}
          className="flex items-center gap-1 mt-3 overflow-x-auto select-none cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={(e) => {
                  if (tabsDragRef.current?.moved) { e.preventDefault(); return; }
                  setTab(t.id);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-md text-[0.8125rem] cursor-pointer transition-colors flex items-center gap-1.5 ${
                  active
                    ? `${tc.isDark ? "bg-slate-700 text-white" : "bg-slate-900 text-white"}`
                    : `${tc.subtext} ${tc.hover}`
                }`}
              >
                {t.label}
                <span className={`text-[0.6875rem] px-1.5 rounded-full ${
                  active ? "bg-white/20" : tc.isDark ? "bg-slate-700/60" : "bg-slate-200"
                }`}>{counts[t.id] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Events", value: filtered.length.toString() },
          { label: "Revenue", value: pick({ usd: totalRevenueUsd, krw: totalRevenueKrw }) },
          { label: "No-Shows", value: noShowCount.toString(), sub: (isDomestic ? refundKrw : refundUsd) ? `Refunds ${pick({ usd: refundUsd, krw: refundKrw })}` : undefined },
        ].map((k) => (
          <div key={k.label} className={`${tc.card} rounded-xl p-3`}>
            <p className={`text-[0.75rem] ${tc.subtext}`}>{k.label}</p>
            <p className={`text-[1.25rem] ${tc.heading} mt-0.5`}>{k.value}</p>
            {k.sub && <p className={`text-[0.6875rem] ${tc.muted} mt-0.5`}>{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Split layout (mobile: detail becomes full-screen sheet) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-3">
        {/* List / Receipts column */}
        <div className={`${tc.card} rounded-xl flex flex-col min-h-0 overflow-hidden`}>
          <div className={`px-3 sm:px-4 py-2.5 border-b ${tc.cardBorder} flex items-center justify-between gap-2`}>
            <span className={`text-[0.75rem] ${tc.subtext}`}>
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
              {isSearching && <span className={`ml-1.5 ${tc.muted}`}>for "{search}"</span>}
            </span>
            {/* View-mode tab */}
            <div className={`flex items-center rounded-md p-0.5 ${tc.isDark ? "bg-slate-800" : "bg-slate-100"}`}>
              <button
                onClick={() => setViewMode("compact")}
                disabled={isSearching}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[0.75rem] cursor-pointer transition-colors ${
                  effectiveView === "compact"
                    ? tc.isDark ? "bg-slate-700 text-white" : "bg-white text-slate-900 shadow-sm"
                    : tc.subtext
                } ${isSearching ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isSearching ? "Receipt view while searching" : "Compact list"}
              >
                <List className="w-3 h-3" /><span className="hidden sm:inline">Compact</span>
              </button>
              <button
                onClick={() => setViewMode("receipts")}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[0.75rem] cursor-pointer transition-colors ${
                  effectiveView === "receipts"
                    ? tc.isDark ? "bg-slate-700 text-white" : "bg-white text-slate-900 shadow-sm"
                    : tc.subtext
                }`}
              >
                <FileText className="w-3 h-3" /><span className="hidden sm:inline">Receipts</span>
              </button>
            </div>
          </div>
          <div className={`flex-1 overflow-y-auto ${effectiveView === "receipts" ? "p-3 sm:p-4 space-y-3" : ""}`}>
            {filtered.length === 0 ? (
              <div className={`p-10 text-center text-[0.875rem] ${tc.muted}`}>No history events match the current filters.</div>
            ) : effectiveView === "receipts" ? (
              filtered.map((e) => (
                <ReceiptCard
                  key={e.id}
                  event={e}
                  query={q}
                  onOpen={() => setSelectedId(e.id)}
                  isSelected={selected?.id === e.id}
                />
              ))
            ) : (
              filtered.map((e) => {
                const Icon = kindIcon(e.kind);
                const accent = kindAccent(e.kind, tc.isDark);
                const badge = statusBadge(e.status, tc.isDark);
                const isSel = selected?.id === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    className={`w-full text-left px-3 sm:px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors border-b ${tc.cardBorder} last:border-b-0 ${
                      isSel
                        ? tc.isDark ? "bg-blue-500/10" : "bg-blue-50"
                        : tc.hover
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[0.875rem] ${tc.heading}`}>{e.guest}</span>
                        <span className={`text-[0.6875rem] px-1.5 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <div className={`text-[0.75rem] ${tc.subtext} mt-0.5 flex items-center gap-x-2 gap-y-0.5 flex-wrap`}>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{e.table}</span>
                        {e.partySize != null && <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{e.partySize}P</span>}
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{relDay(e.timestamp)} · {fmtTime(e.timestamp)}</span>
                      </div>
                    </div>
                    <div className={`text-[0.875rem] ${tc.heading} shrink-0 tabular-nums`}>{pick({ usd: e.amount, krw: e.amountKrw })}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Detail pane (desktop) */}
        <div className={`hidden md:flex ${tc.card} rounded-xl flex-col min-h-0 overflow-hidden`}>
          {!selected ? (
            <div className={`p-10 text-center text-[0.875rem] ${tc.muted}`}>Select an event to view details.</div>
          ) : (
            <DetailPane event={selected} linkedEvent={linkedEvent ?? null} replacement={replacementForNoShow ?? null} tcIsDark={tc.isDark} />
          )}
        </div>
      </div>

      {/* Mobile detail sheet — bottom anchored, dynamic height, max 75vh */}
      {selected && selectedId && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0"
            style={{ background: tc.isDark ? "rgba(15,23,42,0.6)" : "rgba(15,23,42,0.45)" }}
            onClick={() => setSelectedId(null)}
          />
          <div
            className={`absolute left-0 right-0 bottom-0 ${tc.card} rounded-t-2xl overflow-hidden flex flex-col shadow-2xl`}
            style={{ maxHeight: "75vh" }}
          >
            <div className={`flex items-center gap-2 px-3 py-2 border-b ${tc.cardBorder} shrink-0`}>
              <button onClick={() => setSelectedId(null)} className={`p-1.5 rounded cursor-pointer ${tc.hover}`} aria-label="Back">
                <ArrowLeft className={`w-4 h-4 ${tc.text1}`} />
              </button>
              <span className={`text-[0.875rem] ${tc.heading}`}>Event details</span>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
              <DetailPane event={selected} linkedEvent={linkedEvent ?? null} replacement={replacementForNoShow ?? null} tcIsDark={tc.isDark} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ReceiptCardProps {
  event: HistoryEvent;
  query: string;
  onOpen: () => void;
  isSelected: boolean;
}

function fmtLine(value: number, cur?: "foreign" | "domestic"): string {
  if (cur === "domestic") return `₩${Math.round(value).toLocaleString()}`;
  return `$${value.toFixed(2)}`;
}

function ReceiptCard({ event, query, onOpen, isSelected }: ReceiptCardProps) {
  const tc = useThemeClasses();
  const { pick } = useAnalyticsCurrency();
  const Icon = kindIcon(event.kind);
  const accent = kindAccent(event.kind, tc.isDark);
  const badge = statusBadge(event.status, tc.isDark);
  const subtotalUsd = event.items?.filter((i) => (i.currency ?? "foreign") === "foreign").reduce((s, i) => s + i.qty * i.price, 0) ?? 0;
  const subtotalKrw = event.items?.filter((i) => i.currency === "domestic").reduce((s, i) => s + i.qty * i.price, 0) ?? 0;

  return (
    <button
      onClick={onOpen}
      className={`w-full text-left rounded-lg border ${tc.cardBorder} ${tc.isDark ? "bg-slate-900/30" : "bg-white"} cursor-pointer transition-shadow hover:shadow-md ${
        isSelected ? (tc.isDark ? "ring-1 ring-blue-500/40" : "ring-1 ring-blue-500/30") : ""
      }`}
    >
      <div className={`flex items-start gap-2.5 px-3 sm:px-4 py-2.5 border-b ${tc.cardBorder}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[0.875rem] ${tc.heading}`}>
              <Highlight text={event.guest} query={query} />
            </span>
            <span className={`text-[0.6875rem] px-1.5 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
          </div>
          <div className={`text-[0.6875rem] ${tc.subtext} mt-0.5 flex items-center gap-x-2 gap-y-0.5 flex-wrap`}>
            <span className="inline-flex items-center gap-1"><Hash className="w-3 h-3" /><Highlight text={event.id} query={query} /></span>
            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /><Highlight text={event.table} query={query} /></span>
            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{relDay(event.timestamp)} · {fmtTime(event.timestamp)}</span>
            {event.paymentMethod && <span className="inline-flex items-center gap-1"><Banknote className="w-3 h-3" /><Highlight text={event.paymentMethod} query={query} /></span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-[0.9375rem] ${tc.heading} tabular-nums`}>{pick({ usd: event.amount, krw: event.amountKrw })}</div>
        </div>
      </div>

      {event.items && event.items.length > 0 ? (
        <div className="px-3 sm:px-4 py-2">
          <div className={`hidden sm:grid grid-cols-[1fr_40px_64px_64px] gap-2 text-[0.6875rem] ${tc.muted} pb-1`}>
            <span>Item</span><span className="text-center">Qty</span><span className="text-right">Each</span><span className="text-right">Total</span>
          </div>
          <div className="space-y-0.5">
            {event.items.map((it, i) => {
              const cur = it.currency ?? "foreign";
              return (
                <div key={i} className={`grid grid-cols-[1fr_40px_64px_64px] gap-2 text-[0.75rem] sm:text-[0.8125rem] ${tc.text1} items-center`}>
                  <span className="truncate"><Highlight text={it.name} query={query} /></span>
                  <span className="text-center tabular-nums">{it.qty}</span>
                  <span className={`text-right tabular-nums ${tc.subtext}`}>{fmtLine(it.price, cur)}</span>
                  <span className="text-right tabular-nums">{fmtLine(it.qty * it.price, cur)}</span>
                </div>
              );
            })}
          </div>
          <div className={`mt-2 pt-2 border-t ${tc.cardBorder} flex items-center justify-between gap-3 text-[0.75rem] flex-wrap`}>
            <div className={`flex items-center gap-2 ${tc.subtext} flex-wrap`}>
              {subtotalKrw > 0 && <span>Subtotal ₩{Math.round(subtotalKrw).toLocaleString()}</span>}
              {subtotalKrw > 0 && subtotalUsd > 0 && <span>·</span>}
              {subtotalUsd > 0 && <span>Subtotal ${subtotalUsd.toFixed(2)}</span>}
            </div>
            <div className={`text-[0.875rem] ${tc.heading} tabular-nums`}>
              Total {pick({ usd: event.amount ?? subtotalUsd, krw: event.amountKrw ?? subtotalKrw })}
            </div>
          </div>
        </div>
      ) : (
        <div className={`px-3 sm:px-4 py-2 text-[0.75rem] ${tc.muted}`}>
          {event.kind === "no-show" ? "No receipt — no-show event." : event.kind === "reservation" ? "No receipt — reservation only." : "Receipt summary unavailable."}
        </div>
      )}
    </button>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query);
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-300/70 text-inherit rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface DetailPaneProps {
  event: HistoryEvent;
  linkedEvent: HistoryEvent | null;
  replacement: HistoryEvent | null;
  tcIsDark: boolean;
}

function DetailPane({ event, linkedEvent, replacement, tcIsDark }: DetailPaneProps) {
  const tc = useThemeClasses();
  const { pick } = useAnalyticsCurrency();
  const Icon = kindIcon(event.kind);
  const accent = kindAccent(event.kind, tcIsDark);
  const badge = statusBadge(event.status, tcIsDark);
  const subtotalUsd = event.items?.filter((i) => (i.currency ?? "foreign") === "foreign").reduce((s, i) => s + i.qty * i.price, 0) ?? 0;
  const subtotalKrw = event.items?.filter((i) => i.currency === "domestic").reduce((s, i) => s + i.qty * i.price, 0) ?? 0;

  return (
    <>
      <div className={`px-4 py-3 border-b ${tc.cardBorder} flex items-center gap-3`}>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[0.9375rem] ${tc.heading} truncate`}>{event.guest}</p>
          <p className={`text-[0.75rem] ${tc.subtext}`}>{relDay(event.timestamp)} · {fmtTime(event.timestamp)}</p>
        </div>
        <span className={`text-[0.6875rem] px-2 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <DetailRow icon={MapPin} label="Table" value={event.table} />
          {event.partySize != null && <DetailRow icon={Users} label="Party" value={`${event.partySize} guests`} />}
          {event.reservedAt && <DetailRow icon={Calendar} label="Reserved" value={event.reservedAt} />}
          {event.arrivedAt && <DetailRow icon={Clock} label="Arrived" value={event.arrivedAt} />}
          {event.paidAt && <DetailRow icon={CreditCard} label="Paid at" value={event.paidAt} />}
          {event.paymentMethod && <DetailRow icon={Banknote} label="Method" value={event.paymentMethod} />}
          <DetailRow icon={Hash} label="ID" value={event.id} />
        </div>

        {event.items && event.items.length > 0 && (
          <div>
            <p className={`text-[0.75rem] ${tc.subtext} mb-1.5`}>Receipt</p>
            <div className={`rounded-lg border ${tc.cardBorder} overflow-hidden`}>
              <div className={`px-3 py-2 text-[0.6875rem] ${tc.muted} ${tc.isDark ? "bg-slate-800/50" : "bg-slate-50"} flex items-center gap-2`}>
                <span className="flex-1">Item</span>
                <span className="w-10 text-center">Qty</span>
                <span className="w-16 text-right">Price</span>
                <span className="w-16 text-right">Total</span>
              </div>
              {event.items.map((it, i) => {
                const cur = it.currency ?? "foreign";
                return (
                  <div key={i} className={`px-3 py-1.5 flex items-center gap-2 text-[0.8125rem] ${tc.text1}`}>
                    <span className="flex-1 truncate">{it.name}</span>
                    <span className="w-10 text-center tabular-nums">{it.qty}</span>
                    <span className="w-16 text-right tabular-nums">{fmtLine(it.price, cur)}</span>
                    <span className="w-16 text-right tabular-nums">{fmtLine(it.qty * it.price, cur)}</span>
                  </div>
                );
              })}
              <div className={`px-3 py-2 border-t ${tc.cardBorder} space-y-1`}>
                {subtotalKrw > 0 && (
                  <div className={`flex justify-between text-[0.75rem] ${tc.subtext}`}>
                    <span>Subtotal (Domestic)</span><span className="tabular-nums">₩{Math.round(subtotalKrw).toLocaleString()}</span>
                  </div>
                )}
                {subtotalUsd > 0 && (
                  <div className={`flex justify-between text-[0.75rem] ${tc.subtext}`}>
                    <span>Subtotal (Foreign)</span><span className="tabular-nums">${subtotalUsd.toFixed(2)}</span>
                  </div>
                )}
                <div className={`flex justify-between text-[0.875rem] ${tc.heading}`}>
                  <span>Total</span>
                  <span className="tabular-nums">{pick({ usd: event.amount ?? subtotalUsd, krw: event.amountKrw ?? subtotalKrw })}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {event.kind === "reservation" && (
          <Timeline steps={[
            { label: "Requested", time: event.reservedAt ?? "—", done: true },
            { label: "Confirmed", time: event.reservedAt ?? "—", done: true },
            { label: "Seated", time: event.arrivedAt ?? "—", done: !!event.arrivedAt },
            { label: "Completed", time: event.paidAt ?? "—", done: event.status === "completed" },
          ]} />
        )}

        {event.kind === "no-show" && (
          <>
            <Timeline steps={[
              { label: "Reserved", time: event.reservedAt ?? "—", done: true },
              { label: "Grace period elapsed", time: "+20 min", done: true, warn: true },
              { label: "Marked no-show", time: fmtTime(event.timestamp), done: true, warn: true },
              { label: replacement ? "Walk-in seated" : "Table freed", time: replacement?.arrivedAt ?? "—", done: true },
            ]} />
            {replacement && (
              <div className={`rounded-lg p-3 ${tc.isDark ? "bg-sky-500/10" : "bg-sky-50"} border ${tc.isDark ? "border-sky-500/30" : "border-sky-200"}`}>
                <p className={`text-[0.75rem] ${tc.isDark ? "text-sky-300" : "text-sky-700"} mb-1`}>Walk-in took this table</p>
                <p className={`text-[0.875rem] ${tc.heading}`}>
                  {replacement.guest} · {replacement.partySize}P · {pick({ usd: replacement.amount, krw: replacement.amountKrw })}
                </p>
              </div>
            )}
          </>
        )}

        {event.kind === "walk-in" && linkedEvent && (
          <div className={`rounded-lg p-3 ${tc.isDark ? "bg-slate-800/50" : "bg-slate-50"} border ${tc.cardBorder}`}>
            <p className={`text-[0.75rem] ${tc.subtext} mb-1`}>Replaced no-show reservation</p>
            <p className={`text-[0.875rem] ${tc.heading}`}>
              {linkedEvent.guest} · {linkedEvent.partySize}P · reserved {linkedEvent.reservedAt}
            </p>
          </div>
        )}

        {event.notes && (
          <div className={`rounded-lg p-3 ${tc.isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
            <p className={`text-[0.75rem] ${tc.subtext} mb-1`}>Notes</p>
            <p className={`text-[0.8125rem] ${tc.text1}`}>{event.notes}</p>
          </div>
        )}
      </div>
    </>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  const tc = useThemeClasses();
  return (
    <div className={`rounded-lg p-2 ${tc.isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
      <div className={`flex items-center gap-1 text-[0.6875rem] ${tc.muted}`}>
        <Icon className="w-3 h-3" />{label}
      </div>
      <div className={`text-[0.8125rem] ${tc.heading} mt-0.5 truncate`}>{value}</div>
    </div>
  );
}

interface TimelineStep { label: string; time: string; done: boolean; warn?: boolean; }
function Timeline({ steps }: { steps: TimelineStep[] }) {
  const tc = useThemeClasses();
  return (
    <div>
      <p className={`text-[0.75rem] ${tc.subtext} mb-1.5`}>Timeline</p>
      <ol className="relative pl-5">
        <span className={`absolute left-1.5 top-1 bottom-1 w-px ${tc.isDark ? "bg-slate-700" : "bg-slate-200"}`} />
        {steps.map((s, i) => (
          <li key={i} className="relative pb-2.5 last:pb-0">
            <span className={`absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full ${
              s.warn
                ? "bg-amber-500"
                : s.done
                  ? "bg-blue-500"
                  : tc.isDark ? "bg-slate-600" : "bg-slate-300"
            }`} />
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[0.8125rem] ${s.done ? tc.text1 : tc.muted}`}>{s.label}</span>
              <span className={`text-[0.75rem] ${tc.subtext} tabular-nums`}>{s.time}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
