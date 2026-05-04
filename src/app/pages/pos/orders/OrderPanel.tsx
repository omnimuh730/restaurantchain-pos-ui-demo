import { ChevronDown, Lock, History, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useThemeClasses, useTheme } from "../theme-context";
import { TABLES, FLOORS } from "./data";
import type { OrderItem } from "./data";
import { useState, useRef, useEffect, Fragment } from "react";
import { OrderItemsTable } from "../components/OrderItemsTable";
import { floorLabel, menuItemName, tableLabel } from "../../../../i18n/utils";

interface OrderPanelProps {
  selectedTable: string;
  setSelectedTable: (id: string) => void;
  tableDropdownOpen: boolean;
  setTableDropdownOpen: (v: boolean) => void;
  allTableOrders: Record<string, OrderItem[]>;
  currentOrder: OrderItem[];
  checkNumber: string;
  totalUsd: number;
  totalKrw: number;
  removeItemFromOrder: (id: string) => void;
  setItemQty: (id: string, value: number) => void;
  commitOrderedQty: (id: string, value: number) => void;
  commitOrderedRemove: (id: string) => void;
  setShowPayDialog: (v: boolean) => void;
  splitPercent: number;
  handleOrder: () => void;
  onPay?: () => void;
}

type BillItem = {
  itemKey: string;
  qty: number;
  price: number;
  currency: "domestic" | "foreign";
};

type TodayBill = {
  id: string;
  table: string;
  time: string;
  krw: number;
  usd: number;
  methodKey: "cash" | "credit" | "mix";
  items: BillItem[];
};

export function OrderPanel(props: OrderPanelProps) {
  const { t } = useTranslation();
  const {
    selectedTable,
    setSelectedTable,
    tableDropdownOpen,
    setTableDropdownOpen,
    allTableOrders,
    currentOrder,
    checkNumber,
    totalUsd,
    totalKrw,
    removeItemFromOrder,
    setItemQty,
    commitOrderedQty,
    commitOrderedRemove,
    setShowPayDialog,
    splitPercent,
    handleOrder,
    onPay,
  } = props;
  void setShowPayDialog;
  const tc = useThemeClasses();
  const { role } = useTheme();
  const navigate = useNavigate();
  void navigate;
  const canPay = role === "Admin" || role === "Cashier";
  const selectedTableInfo = TABLES.find((t) => t.id === selectedTable);
  const [selectedFloor, setSelectedFloor] = useState("1F");
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const filteredTables = TABLES.filter((t) => t.floor === selectedFloor);
  const pendingItems = currentOrder.filter(
    (i) => !i.ordered || i.deleted || (i.origQty !== undefined && i.origQty !== i.qty),
  );
  const pendingCount = pendingItems.length;
  const visibleCount = currentOrder.filter((i) => !i.deleted).length;
  const allOrdered = visibleCount > 0 && pendingCount === 0;
  const orderDisabled = pendingCount === 0;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyMounted, setHistoryMounted] = useState(false);
  const [historyAnim, setHistoryAnim] = useState(false);
  const [historyHeight, setHistoryHeight] = useState(60);
  useEffect(() => {
    if (historyOpen) {
      setHistoryMounted(true);
      const r = requestAnimationFrame(() => setHistoryAnim(true));
      return () => cancelAnimationFrame(r);
    }
    setHistoryAnim(false);
    const tm = setTimeout(() => setHistoryMounted(false), 300);
    return () => clearTimeout(tm);
  }, [historyOpen]);
  const canViewHistory = role === "Admin" || role === "Cashier";

  const todayBills: TodayBill[] = [
    {
      id: "B-1042",
      table: "T8",
      time: "08:42",
      krw: 38000,
      usd: 0,
      methodKey: "cash",
      items: [
        { itemKey: "kimchi-stew", qty: 2, price: 12000, currency: "domestic" },
        { itemKey: "rice-side", qty: 2, price: 2000, currency: "domestic" },
        { itemKey: "soju", qty: 1, price: 10000, currency: "domestic" },
      ],
    },
    {
      id: "B-1043",
      table: "T3",
      time: "09:15",
      krw: 0,
      usd: 42.5,
      methodKey: "credit",
      items: [
        { itemKey: "cheeseburger", qty: 2, price: 14.0, currency: "foreign" },
        { itemKey: "fries", qty: 1, price: 6.5, currency: "foreign" },
        { itemKey: "cola", qty: 2, price: 4.0, currency: "foreign" },
      ],
    },
    {
      id: "B-1044",
      table: "T6",
      time: "10:03",
      krw: 124000,
      usd: 18.0,
      methodKey: "mix",
      items: [
        { itemKey: "galbi-set", qty: 2, price: 45000, currency: "domestic" },
        { itemKey: "bibimbap", qty: 1, price: 14000, currency: "domestic" },
        { itemKey: "beer-pitcher", qty: 1, price: 20000, currency: "domestic" },
        { itemKey: "tip", qty: 1, price: 18.0, currency: "foreign" },
      ],
    },
    {
      id: "B-1045",
      table: "BAR1",
      time: "10:51",
      krw: 22000,
      usd: 0,
      methodKey: "cash",
      items: [{ itemKey: "highball", qty: 2, price: 11000, currency: "domestic" }],
    },
    {
      id: "B-1046",
      table: "T1",
      time: "11:28",
      krw: 0,
      usd: 96.75,
      methodKey: "credit",
      items: [
        { itemKey: "steak", qty: 2, price: 38.0, currency: "foreign" },
        { itemKey: "caesar-salad", qty: 1, price: 12.75, currency: "foreign" },
        { itemKey: "wine-glass", qty: 1, price: 8.0, currency: "foreign" },
      ],
    },
    {
      id: "B-1047",
      table: "T11",
      time: "12:09",
      krw: 64500,
      usd: 0,
      methodKey: "cash",
      items: [
        { itemKey: "bulgogi", qty: 2, price: 22000, currency: "domestic" },
        { itemKey: "japchae", qty: 1, price: 16000, currency: "domestic" },
        { itemKey: "makgeolli", qty: 1, price: 4500, currency: "domestic" },
      ],
    },
    {
      id: "B-1048",
      table: "T4",
      time: "12:47",
      krw: 88000,
      usd: 24.0,
      methodKey: "mix",
      items: [
        { itemKey: "pork-belly", qty: 3, price: 24000, currency: "domestic" },
        { itemKey: "soju", qty: 1, price: 16000, currency: "domestic" },
        { itemKey: "service-charge", qty: 1, price: 24.0, currency: "foreign" },
      ],
    },
  ];
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const todayKrw = todayBills.reduce((s, b) => s + b.krw, 0);
  const todayUsd = todayBills.reduce((s, b) => s + b.usd, 0);
  const [editConfirm, setEditConfirm] = useState<
    | { type: "qty"; id: string; baseId: string; from: number; to: number }
    | { type: "remove"; id: string; baseId: string; qty: number }
    | null
  >(null);

  const interceptQty = (id: string, value: number) => {
    const item = currentOrder.find((i) => i.id === id);
    if (!item) return;
    if (item.ordered) {
      const next = Math.max(0, value);
      if (next === item.qty) return;
      if (next === 0) {
        setEditConfirm({ type: "remove", id, baseId: item.baseId, qty: item.qty });
      } else {
        setEditConfirm({ type: "qty", id, baseId: item.baseId, from: item.qty, to: next });
      }
      return;
    }
    setItemQty(id, value);
  };

  const interceptRemove = (id: string) => {
    const item = currentOrder.find((i) => i.id === id);
    if (!item) return;
    if (item.ordered) {
      setEditConfirm({ type: "remove", id, baseId: item.baseId, qty: item.qty });
      return;
    }
    removeItemFromOrder(id);
  };

  const orderItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orderItemsRef.current) {
      orderItemsRef.current.scrollTop = orderItemsRef.current.scrollHeight;
    }
  }, [currentOrder]);

  const op = (k: string, opts?: Record<string, unknown>) =>
    t(`orders.orderPanel.${k}`, opts as object);

  return (
    <div
      className={`w-full sm:w-1/2 md:w-110 xl:w-[28rem] ${tc.isDark ? "bg-[#2a2d35]" : "bg-white"} sm:border-r ${tc.border} flex flex-col shrink-0 sm:!h-full overflow-hidden`}
      style={{ height: `${splitPercent}%` }}
    >
      <div className={`px-3 py-1.5 border-b ${tc.borderHalf}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => {
                  setFloorDropdownOpen(!floorDropdownOpen);
                  setTableDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${
                  tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                <span className="font-medium">
                  {FLOORS.find((f) => f.id === selectedFloor)
                    ? floorLabel(t, selectedFloor)
                    : op("allFloors")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${floorDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {floorDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFloorDropdownOpen(false)} />
                  <div
                    className={`absolute top-full left-0 mt-1 z-50 w-36 rounded-lg shadow-lg border overflow-hidden ${tc.border} ${
                      tc.isDark ? "bg-[#2a2d35]" : "bg-white"
                    }`}
                  >
                    {FLOORS.map((floor) => (
                      <button
                        key={floor.id}
                        onClick={() => {
                          setSelectedFloor(floor.id);
                          setFloorDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[0.8125rem] transition-colors cursor-pointer ${
                          selectedFloor === floor.id
                            ? "bg-blue-600 text-white"
                            : tc.isDark
                              ? "hover:bg-slate-700 text-slate-200"
                              : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {floorLabel(t, floor.id)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setTableDropdownOpen(!tableDropdownOpen);
                  setFloorDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${
                  tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                <span className="font-medium">
                  {selectedTableInfo ? tableLabel(t, selectedTableInfo.id) : op("selectTable")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${tableDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {tableDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTableDropdownOpen(false)} />
                  <div
                    className={`absolute top-full left-0 mt-1 z-50 w-48 max-h-64 overflow-y-auto rounded-lg shadow-lg border ${tc.border} ${
                      tc.isDark ? "bg-[#2a2d35]" : "bg-white"
                    }`}
                  >
                    {filteredTables.map((table) => {
                      const hasOrder = (allTableOrders[table.id]?.length || 0) > 0;
                      return (
                        <button
                          key={table.id}
                          onClick={() => {
                            setSelectedTable(table.id);
                            setTableDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-[0.8125rem] flex items-center justify-between transition-colors cursor-pointer ${
                            selectedTable === table.id
                              ? "bg-blue-600 text-white"
                              : tc.isDark
                                ? "hover:bg-slate-700 text-slate-200"
                                : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span>{tableLabel(t, table.id)}</span>
                          <span className="flex items-center gap-1.5">
                            {hasOrder && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${selectedTable === table.id ? "bg-blue-200" : "bg-blue-500"}`}
                              />
                            )}
                            <span
                              className={`text-[0.6875rem] ${selectedTable === table.id ? "text-white/80" : tc.subtext}`}
                            >
                              {op("seats", { count: table.seats })}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
          {canViewHistory && (
            <button
              onClick={() => setHistoryOpen(true)}
              title={op("historyTooltip")}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[0.75rem] cursor-pointer transition-colors ${
                tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{op("history")}</span>
            </button>
          )}
        </div>
        <div className={`mt-1.5 text-[0.6875rem] ${tc.subtext}`}>{checkNumber}</div>
      </div>

      <div className={`px-3 py-1.5 border-b ${tc.borderHalf}`}>
        <div className="flex gap-2">
          <button
            disabled={orderDisabled}
            onClick={() => {
              if (!orderDisabled) setConfirmOpen(true);
            }}
            className={`relative flex-1 px-3.5 py-1.5 text-[0.75rem] rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 border ${
              orderDisabled
                ? tc.isDark
                  ? "bg-slate-700 text-slate-500 border-slate-700 cursor-not-allowed"
                  : "bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed"
                : `bg-transparent border-blue-600 text-blue-600 ${tc.isDark ? "hover:bg-blue-600/10" : "hover:bg-blue-50"} cursor-pointer`
            }`}
          >
            {allOrdered ? op("ordered") : op("order")}
            {pendingCount > 0 && (
              <span className="min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-blue-600 text-white text-[0.625rem] flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            disabled={!canPay}
            onClick={() => {
              if (!canPay) return;
              if (onPay) onPay();
            }}
            title={canPay ? undefined : op("payLockedHint")}
            className={`flex-1 px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 ${
              canPay
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : tc.isDark
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {!canPay && <Lock className="w-3 h-3" />}
            {op("pay")}{" "}
            {totalKrw > 0 ? `₩${Math.round(totalKrw).toLocaleString("ko-KR")}` : ""}
            {totalKrw > 0 && totalUsd > 0 ? " · " : ""}
            {totalUsd > 0 || totalKrw === 0 ? `$${totalUsd.toFixed(2)}` : ""}
          </button>
        </div>
      </div>

      <div ref={orderItemsRef} className="flex-1 overflow-y-auto">
        {currentOrder.length === 0 ? (
          <div className={`text-center ${tc.muted} py-8 px-4`}>
            <p className="text-[0.875rem]">{op("emptyTitle")}</p>
            <p className="text-[0.75rem] mt-1">{op("emptyHint")}</p>
          </div>
        ) : (
          <OrderItemsTable
            items={currentOrder
              .filter((i) => !i.deleted)
              .map((i) => ({
                id: i.id,
                itemKey: i.baseId,
                qty: i.qty,
                price: i.price,
                ordered: i.ordered,
                currency: i.currency,
              }))}
            onQtySet={interceptQty}
            onRemove={interceptRemove}
          />
        )}
      </div>

      <div className={`border-t ${tc.borderHalf} p-2 space-y-0.5`}>
        <div className="flex justify-between text-[0.75rem] font-semibold">
          <span className={tc.heading}>{op("domesticLabel")}</span>
          <span className={tc.heading}>₩{Math.round(totalKrw).toLocaleString("ko-KR")}</span>
        </div>
        <div className="flex justify-between text-[0.75rem] font-semibold">
          <span className={tc.heading}>{op("foreignLabel")}</span>
          <span className={tc.heading}>${totalUsd.toFixed(2)}</span>
        </div>
      </div>

      {editConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setEditConfirm(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-[90vw] max-w-md rounded-lg shadow-xl border p-5 ${tc.isDark ? "bg-[#2a2d35] border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <div className="text-base font-semibold mb-1">
              {editConfirm.type === "remove" ? op("removeItemTitle") : op("updateQtyTitle")}
            </div>
            <div className={`text-sm mb-4 ${tc.subtext}`}>
              {editConfirm.type === "remove"
                ? op("removeItemBody", {
                    name: menuItemName(t, editConfirm.baseId),
                    qty: editConfirm.qty,
                  })
                : op("updateQtyBody", {
                    name: menuItemName(t, editConfirm.baseId),
                    from: editConfirm.from,
                    to: editConfirm.to,
                  })}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditConfirm(null)}
                className={`px-4 py-2 rounded text-sm cursor-pointer ${tc.isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => {
                  if (editConfirm.type === "remove") commitOrderedRemove(editConfirm.id);
                  else commitOrderedQty(editConfirm.id, editConfirm.to);
                  setEditConfirm(null);
                }}
                className="px-4 py-2 rounded text-sm cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {historyMounted && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${historyAnim ? "opacity-100" : "opacity-0"}`}
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setHistoryOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ height: `${historyHeight}vh` }}
            className={`w-full flex flex-col rounded-t-2xl shadow-xl border-t border-x ${tc.isDark ? "bg-[#2a2d35] border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"} transform transition-transform duration-300 ease-out ${historyAnim ? "translate-y-0" : "translate-y-full"}`}
          >
            <div
              className="flex items-center justify-center w-full h-5 cursor-row-resize select-none shrink-0 touch-none"
              onPointerDown={(e) => {
                e.preventDefault();
                const el = e.currentTarget;
                el.setPointerCapture(e.pointerId);
                const onMove = (ev: PointerEvent) => {
                  const vh = window.innerHeight;
                  const fromBottom = vh - ev.clientY;
                  const pct = Math.min(84, Math.max(35, (fromBottom / vh) * 100));
                  setHistoryHeight(pct);
                };
                const onUp = () => {
                  el.removeEventListener("pointermove", onMove);
                  el.removeEventListener("pointerup", onUp);
                };
                el.addEventListener("pointermove", onMove);
                el.addEventListener("pointerup", onUp);
              }}
            >
              <div className={`w-10 h-1.5 rounded-full ${tc.isDark ? "bg-gray-500" : "bg-gray-300"}`} />
            </div>
            <div className={`flex items-center justify-between px-5 py-3 border-b ${tc.borderHalf}`}>
              <div>
                <div className="text-base font-semibold flex items-center gap-2">
                  <History className="w-4 h-4" /> {op("historyTitle")}
                </div>
                <div className={`text-[0.75rem] ${tc.subtext}`}>
                  {op("historySummary", {
                    count: todayBills.length,
                    krw: todayKrw.toLocaleString("ko-KR"),
                    usd: todayUsd.toFixed(2),
                  })}
                </div>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className={`p-1.5 rounded cursor-pointer ${tc.isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
                aria-label={op("closeAria")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-[0.8125rem]">
                <thead className={`sticky top-0 ${tc.isDark ? "bg-[#2a2d35]" : "bg-white"} border-b ${tc.borderHalf}`}>
                  <tr className={tc.subtext}>
                    <th className="text-left px-4 py-2 font-medium">{op("colNo")}</th>
                    <th className="text-left px-3 py-2 font-medium">{op("colTable")}</th>
                    <th className="text-left px-3 py-2 font-medium">{op("colTime")}</th>
                    <th className="text-left px-3 py-2 font-medium">{op("colMethod")}</th>
                    <th className="text-right px-3 py-2 font-medium">{op("colAmount")}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tc.borderHalf}`}>
                  {todayBills.map((b, idx) => {
                    const isOpen = expandedBill === b.id;
                    const tbl = TABLES.find((x) => x.id === b.table);
                    return (
                      <Fragment key={b.id}>
                        <tr
                          onClick={() => setExpandedBill(isOpen ? null : b.id)}
                          className={`cursor-pointer ${tc.isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"} ${isOpen ? (tc.isDark ? "bg-slate-800" : "bg-slate-50") : ""}`}
                        >
                          <td className="px-4 py-2">{todayBills.length - idx}</td>
                          <td className="px-3 py-2">
                            {tbl
                              ? `${floorLabel(t, tbl.floor)} · ${tableLabel(t, b.table)}`
                              : b.table}
                          </td>
                          <td className="px-3 py-2">{b.time}</td>
                          <td className="px-3 py-2">{t(`payment.${b.methodKey}`)}</td>
                          <td className="px-3 py-2 text-right">
                            {b.krw > 0 && <span className="text-blue-600">₩{b.krw.toLocaleString("ko-KR")}</span>}
                            {b.krw > 0 && b.usd > 0 && <span className={tc.subtext}> · </span>}
                            {b.usd > 0 && <span className="text-red-600">${b.usd.toFixed(2)}</span>}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className={tc.isDark ? "bg-slate-900/40" : "bg-slate-50/60"}>
                            <td colSpan={5} className="px-4 py-3">
                              <div className={`rounded-md border ${tc.borderHalf} overflow-hidden`}>
                                <table className="w-full text-[0.8125rem]">
                                  <thead className={tc.subtext}>
                                    <tr className={`border-b ${tc.borderHalf}`}>
                                      <th className="text-left px-3 py-1.5 font-medium">{op("colItem")}</th>
                                      <th className="text-right px-3 py-1.5 font-medium w-12">{t("orders.colQty")}</th>
                                      <th className="text-right px-3 py-1.5 font-medium w-20">{op("colPrice")}</th>
                                      <th className="text-right px-3 py-1.5 font-medium w-20">{op("colSubtotal")}</th>
                                    </tr>
                                  </thead>
                                  <tbody className={`divide-y ${tc.borderHalf}`}>
                                    {b.items.map((it, i) => {
                                      const color = it.currency === "domestic" ? "text-blue-600" : "text-red-600";
                                      const fmt = (n: number) =>
                                        it.currency === "domestic"
                                          ? `₩${Math.round(n).toLocaleString("ko-KR")}`
                                          : `$${n.toFixed(2)}`;
                                      return (
                                        <tr key={`${b.id}-${i}`}>
                                          <td className="px-3 py-1.5">{menuItemName(t, it.itemKey)}</td>
                                          <td className="px-3 py-1.5 text-right">×{it.qty}</td>
                                          <td className={`px-3 py-1.5 text-right ${color}`}>{fmt(it.price)}</td>
                                          <td className={`px-3 py-1.5 text-right ${color}`}>{fmt(it.price * it.qty)}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-[90vw] max-w-md rounded-lg shadow-xl border p-5 ${tc.isDark ? "bg-[#2a2d35] border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <div className="text-base font-semibold mb-1">{op("confirmOrderTitle")}</div>
            <div className={`text-sm mb-3 ${tc.subtext}`}>
              {op("confirmOrderBody", {
                count: pendingCount,
                items: op(pendingCount === 1 ? "itemSingular" : "itemPlural"),
                table: selectedTableInfo ? tableLabel(t, selectedTableInfo.id) : selectedTable,
              })}
            </div>
            <div className={`max-h-60 overflow-y-auto rounded border ${tc.borderHalf} divide-y ${tc.borderHalf} mb-4`}>
              {pendingItems.map((it) => {
                const tag = it.deleted
                  ? op("tagRemove")
                  : !it.ordered
                    ? op("tagNew")
                    : op("tagQty", { from: it.origQty, to: it.qty });
                const tagColor = it.deleted ? "text-red-500" : !it.ordered ? "text-blue-600" : "text-amber-500";
                return (
                  <div key={it.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="truncate flex items-center gap-2">
                      <span className={`text-[0.6875rem] ${tagColor}`}>{tag}</span>
                      <span className="truncate">{menuItemName(t, it.baseId)}</span>
                    </span>
                    <span className={`shrink-0 ml-3 ${tc.subtext}`}>
                      ×{it.qty} ·{" "}
                      {it.currency === "domestic"
                        ? `₩${Math.round(it.price * it.qty).toLocaleString("ko-KR")}`
                        : `$${(it.price * it.qty).toFixed(2)}`}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className={`px-4 py-2 rounded text-sm cursor-pointer ${tc.isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => {
                  handleOrder();
                  setConfirmOpen(false);
                }}
                className="px-4 py-2 rounded text-sm cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
