import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ArrowUpDown, AlertCircle, Filter, ClipboardList, ChefHat } from "lucide-react";
import { useThemeClasses, useTheme } from "../theme-context";
import type { KitchenOrder, OrderStatus, ViewTab, SortMode } from "./types";
import { INITIAL_ORDERS } from "./data";
import { KitchenCard } from "./KitchenCard";
import { OrderDetailModal } from "./OrderDetailModal";
import { TableFilterSidebar, KITCHEN_FLOORS } from "./TableFilterSidebar";
import { useNavBadges } from "../NavBadgeContext";

const ALL_TABLES = KITCHEN_FLOORS.flatMap((f) => f.tables);

export default function Kitchen() {
  const tc = useThemeClasses();
  const { t } = useTranslation("kitchen");
  const { role } = useTheme();
  const isAdmin = role === "Admin";
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<ViewTab>("in-progress");
  const [sortMode, setSortMode] = useState<SortMode>("oldest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set(ALL_TABLES));
  const [showTableFilter, setShowTableFilter] = useState(false);

  // Live clock tick every 15s for urgency updates
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(iv);
  }, []);

  // Counts of distinct food types (cook types) per status, ignoring quantities.
  const distinctNames = (items: { itemKey: string }[]) => new Set(items.map((i) => i.itemKey)).size;
  const receivedCount = distinctNames(
    orders.filter((o) => o.status === "received").flatMap((o) => o.items)
  );
  const inProgressCount = distinctNames(
    orders
      .filter((o) => o.status === "in-progress")
      .flatMap((o) => o.items.filter((i) => !i.previouslyCompleted))
  );
  const completedCount = distinctNames([
    ...orders.filter((o) => o.status === "completed").flatMap((o) => o.items),
    ...orders
      .filter((o) => o.status === "in-progress")
      .flatMap((o) => o.items.filter((i) => i.previouslyCompleted)),
  ]);

  const { setBadge } = useNavBadges();
  useEffect(() => { setBadge("kitchen", receivedCount); }, [receivedCount, setBadge]);

  // Filtered & sorted
  const filtered = orders.filter((o) => {
    if (!selectedTables.has(o.table)) return false;
    if (activeTab === "completed") {
      return o.status === "completed" || o.items.some((i) => i.previouslyCompleted);
    }
    return o.status === activeTab;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === "oldest") return a.orderedAt - b.orderedAt;
    return b.orderedAt - a.orderedAt;
  });

  // Actions
  const acceptOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      const out: KitchenOrder[] = [];
      for (const o of prev) {
        if (o.id !== orderId || o.status !== "received") { out.push(o); continue; }
        const anyChecked = o.items.some((i) => i.done);
        if (!anyChecked) {
          out.push({ ...o, status: "in-progress" as OrderStatus, items: o.items.map((i) => ({ ...i, done: false, selectedQty: undefined })) });
          continue;
        }
        const remaining: KitchenOrder["items"] = [];
        const accepted: KitchenOrder["items"] = [];
        for (const i of o.items) {
          if (!i.done) { remaining.push(i); continue; }
          const sel = Math.min(i.selectedQty ?? i.qty, i.qty);
          const left = i.qty - sel;
          if (left > 0) remaining.push({ ...i, qty: left, done: false, selectedQty: undefined });
          accepted.push({ ...i, id: `${i.id}-a${Date.now()}`, qty: sel, done: false, selectedQty: undefined });
        }
        if (remaining.length > 0) out.push({ ...o, items: remaining });
        out.push({ ...o, id: `${o.id}-a${Date.now()}`, status: "in-progress" as OrderStatus, items: accepted });
      }
      return out;
    });
  }, []);

  const completeOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      const out: KitchenOrder[] = [];
      for (const o of prev) {
        if (o.id !== orderId) { out.push(o); continue; }
        // From received: split off checked items into a completed order, or complete all if none checked.
        if (o.status === "received") {
          const anyChecked = o.items.some((i) => i.done);
          if (!anyChecked) {
            out.push({
              ...o,
              status: "completed" as OrderStatus,
              completedAt: Date.now(),
              items: o.items.map((i) => ({ ...i, done: false, selectedQty: undefined, previouslyCompleted: true })),
            });
            continue;
          }
          const remaining: KitchenOrder["items"] = [];
          const completedItems: KitchenOrder["items"] = [];
          for (const i of o.items) {
            if (!i.done) { remaining.push(i); continue; }
            const sel = Math.min(i.selectedQty ?? i.qty, i.qty);
            const left = i.qty - sel;
            if (left > 0) remaining.push({ ...i, qty: left, done: false, selectedQty: undefined });
            completedItems.push({ ...i, id: `${i.id}-c${Date.now()}`, qty: sel, done: false, selectedQty: undefined, previouslyCompleted: true });
          }
          if (remaining.length > 0) out.push({ ...o, items: remaining });
          out.push({ ...o, id: `${o.id}-c${Date.now()}`, status: "completed" as OrderStatus, completedAt: Date.now(), items: completedItems });
          continue;
        }
        const checkedItems = o.items.filter((i) => i.done && !i.previouslyCompleted);
        if (checkedItems.length === 0) { out.push(o); continue; }

        const newItems: KitchenOrder["items"] = [];
        for (const i of o.items) {
          if (i.done && !i.previouslyCompleted) {
            const sel = Math.min(i.selectedQty ?? i.qty, i.qty);
            const remaining = i.qty - sel;
            if (remaining > 0) {
              // Keep remaining as in-progress
              newItems.push({ ...i, qty: remaining, done: false, selectedQty: undefined });
              // Split off completed portion as a new item
              newItems.push({
                ...i,
                id: `${i.id}-c${Date.now()}`,
                qty: sel,
                done: false,
                selectedQty: undefined,
                previouslyCompleted: true,
              });
            } else {
              newItems.push({ ...i, previouslyCompleted: true, done: false, selectedQty: undefined });
            }
          } else {
            newItems.push(i);
          }
        }

        const allCompleted = newItems.every((i) => i.previouslyCompleted);
        out.push({
          ...o,
          status: allCompleted ? ("completed" as OrderStatus) : o.status,
          completedAt: allCompleted ? Date.now() : o.completedAt,
          items: newItems,
        });
      }
      return out;
    });
  }, []);

  const toggleItemDone = useCallback((orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((i) =>
                i.id === itemId
                  ? { ...i, done: !i.done, selectedQty: !i.done ? i.qty : undefined }
                  : i
              ),
            }
          : o
      )
    );
  }, []);

  const setItemSelectedQty = useCallback((orderId: string, itemId: string, count: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((i) =>
                i.id === itemId
                  ? count <= 0
                    ? { ...i, done: false, selectedQty: undefined }
                    : { ...i, done: true, selectedQty: Math.min(count, i.qty) }
                  : i
              ),
            }
          : o
      )
    );
  }, []);

  const recallOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      const out: KitchenOrder[] = [];
      for (const o of prev) {
        if (o.id !== orderId) { out.push(o); continue; }
        const isFullyCompleted = o.status === "completed";
        const isRecallable = (i: KitchenOrder["items"][number]) =>
          isFullyCompleted ? i.done : i.done && i.previouslyCompleted;
        const anyRecalled = o.items.some(isRecallable);
        if (!anyRecalled) { out.push(o); continue; }

        const remainingItems: KitchenOrder["items"] = [];
        const recalledItems: KitchenOrder["items"] = [];
        for (const i of o.items) {
          if (!isRecallable(i)) {
            remainingItems.push({ ...i, done: false, selectedQty: undefined });
            continue;
          }
          const sel = Math.min(i.selectedQty ?? i.qty, i.qty);
          const remaining = i.qty - sel;
          if (remaining > 0) {
            remainingItems.push({ ...i, qty: remaining, done: false, selectedQty: undefined });
          }
          recalledItems.push({
            ...i,
            id: `${i.id}-r${Date.now()}`,
            qty: sel,
            done: false,
            selectedQty: undefined,
            previouslyCompleted: false,
          });
        }

        // Keep original order with remaining (non-recalled) items, status unchanged.
        if (remainingItems.length > 0) {
          out.push({ ...o, items: remainingItems });
        }
        // Spawn a new received order containing only the recalled items.
        out.push({
          ...o,
          id: `${o.id}-r${Date.now()}`,
          status: "received" as OrderStatus,
          orderedAt: Date.now(),
          completedAt: undefined,
          items: recalledItems,
        });
      }
      return out;
    });
  }, []);

  const detailOrder = showDetail ? orders.find((o) => o.id === showDetail) : null;

  const receivedOrderCount = orders.filter((o) => o.status === "received").length;
  const inProgressOrderCount = orders.filter(
    (o) => o.status === "in-progress" && o.items.some((i) => !i.previouslyCompleted)
  ).length;
  const completedOrderCount =
    orders.filter((o) => o.status === "completed").length +
    orders.filter((o) => o.status === "in-progress" && o.items.some((i) => i.previouslyCompleted)).length;

  const TABS: { id: ViewTab; labelKey: string; count: number; orderCount: number }[] = [
    { id: "received", labelKey: "index.tabReceived", count: receivedCount, orderCount: receivedOrderCount },
    { id: "in-progress", labelKey: "index.tabInProgress", count: inProgressCount, orderCount: inProgressOrderCount },
    { id: "completed", labelKey: "index.tabCompleted", count: completedCount, orderCount: completedOrderCount },
  ];

  return (
    <div className={`h-full flex flex-row ${tc.page} overflow-hidden`}>
      {/* Left Sidebar - Table Filter */}
      <TableFilterSidebar selectedTables={selectedTables} setSelectedTables={setSelectedTables} open={showTableFilter} onClose={() => setShowTableFilter(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`shrink-0 border-b ${tc.isDark ? "border-gray-700 bg-[#1e2330]" : "border-slate-300 bg-white"}`}>
        <div className="flex items-center justify-between px-4 py-3 bg-[#1e233000]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTableFilter(true)}
              className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${ tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-700" } text-[0.8125rem] bg-[#2d59e2]`}
            >
              <Filter className="w-4 h-4" />
              <span>{t("index.tablesBtn")}</span>
              <span className="text-[0.6875rem]">
                {selectedTables.size}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${tc.card} text-[0.6875rem] cursor-pointer ${tc.hover} transition-colors ${tc.subtext}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortMode === "oldest" ? t("index.sortOldest") : t("index.sortNewest")}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />
                  <div className={`absolute right-0 top-full mt-1 z-40 ${tc.dropdown} rounded-lg overflow-hidden min-w-[140px]`}>
                    {(["oldest", "newest"] as SortMode[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSortMode(s); setShowSortDropdown(false); }}
                        className={`w-full px-3 py-2 text-left text-[0.75rem] cursor-pointer transition-colors ${
                          sortMode === s ? tc.dropdownItemActive : tc.dropdownItem
                        }`}
                      >
                        {s === "oldest" ? t("index.sortOldestFirst") : t("index.sortNewestFirst")}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex px-2 justify-center shrink-0 border-t ${tc.border} ${tc.isDark ? "bg-[#1e2330]" : "bg-white"}`}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-5 py-2 text-[0.8125rem] cursor-pointer transition-colors border-b-2 ${
                activeTab === tab.id
                  ? `border-blue-500 ${tc.isDark ? "text-blue-400" : "text-slate-800"}`
                  : `border-transparent ${tc.muted} ${tc.hover}`
              }`}
            >
              <span>{t(tab.labelKey)}</span>
              <span className={`flex items-center gap-2 text-[0.6875rem] ${
                activeTab === tab.id
                  ? tc.isDark ? "text-blue-400" : "text-slate-600"
                  : `${tc.subtext}`
              }`}>
                {role !== "Waiter" && (
                  <span className="inline-flex items-center gap-0.5">
                    <ClipboardList className="w-3 h-3" />
                    {tab.orderCount}
                  </span>
                )}
                <span className="inline-flex items-center gap-0.5">
                  <ChefHat className="w-3 h-3" />
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <AlertCircle className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-[0.875rem]">{t("index.emptyCategory")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap md:content-start md:items-start gap-3 pb-2 overflow-auto md:h-full">
            {(() => {
              if (activeTab !== "received") {
                return sorted.map((order) => (
                  <KitchenCard
                    key={order.id}
                    order={order}
                    viewTab={activeTab}
                    setItemSelectedQty={setItemSelectedQty}
                    acceptOrder={acceptOrder}
                    completeOrder={completeOrder}
                    recallOrder={recallOrder}
                    toggleItemDone={toggleItemDone}
                    setShowDetail={setShowDetail}
                  />
                ));
              }
              // Received tab — merge orders by table
              const groups = new Map<string, KitchenOrder[]>();
              for (const o of sorted) {
                const arr = groups.get(o.table);
                if (arr) arr.push(o);
                else groups.set(o.table, [o]);
              }
              return Array.from(groups.entries()).map(([table, group]) => {
                const ids = group.map((o) => o.id);
                const itemToOrder = new Map<string, string>();
                const mergedItems: KitchenOrder["items"] = [];
                for (const o of group) {
                  for (const i of o.items) {
                    itemToOrder.set(i.id, o.id);
                    mergedItems.push(i);
                  }
                }
                const earliest = group.reduce((m, o) => Math.min(m, o.orderedAt), group[0].orderedAt);
                const merged: KitchenOrder = {
                  ...group[0],
                  id: ids.join("+"),
                  table,
                  orderedAt: earliest,
                  items: mergedItems,
                };
                const forEachId = (fn: (id: string) => void) => ids.forEach(fn);
                return (
                  <KitchenCard
                    key={merged.id}
                    order={merged}
                    viewTab={activeTab}
                    setItemSelectedQty={(_oid, itemId, count) => {
                      const real = itemToOrder.get(itemId);
                      if (real) setItemSelectedQty(real, itemId, count);
                    }}
                    acceptOrder={() => forEachId(acceptOrder)}
                    completeOrder={() => forEachId(completeOrder)}
                    recallOrder={() => forEachId(recallOrder)}
                    toggleItemDone={(_oid, itemId) => {
                      const real = itemToOrder.get(itemId);
                      if (real) toggleItemDone(real, itemId);
                    }}
                    setShowDetail={() => setShowDetail(group[0].id)}
                  />
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          allOrders={orders}
          viewTab={activeTab}
          onClose={() => setShowDetail(null)}
          acceptOrder={acceptOrder}
          completeOrder={completeOrder}
          recallOrder={recallOrder}
          toggleItemDone={toggleItemDone}
          setItemSelectedQty={setItemSelectedQty}
        />
      )}
      </div>
    </div>
  );
}