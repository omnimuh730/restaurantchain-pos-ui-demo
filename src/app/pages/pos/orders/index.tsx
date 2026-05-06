import { useState, useRef, useCallback, useEffect, lazy, Suspense, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { POS_OVERLAY_BACKDROP } from "../posOverlayLayers";
import { INITIAL_TABLE_ORDERS, TABLES } from "./data";
import type { OrderItem } from "./data";
import { OrderPanel } from "./OrderPanel";
import { MenuPanel } from "./MenuPanel";

const PaymentPage = lazy(() => import("../payment"));

export default function Orders() {
  const { t } = useTranslation("orders");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("hot-foods");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Table selection & per-table order persistence
  const [selectedTable, setSelectedTable] = useState<string>("T12");
  const [tableDropdownOpen, setTableDropdownOpen] = useState(false);
  const [allTableOrders, setAllTableOrders] = useState<Record<string, OrderItem[]>>(INITIAL_TABLE_ORDERS);
  const [checkCounters] = useState<Record<string, string>>({
    T1: "Ch. #71", T2: "Ch. #72", T3: "Ch. #73", T4: "Ch. #74", T5: "Ch. #75",
    T6: "Ch. #76", T7: "Ch. #77", T8: "Ch. #78", T9: "Ch. #79", T10: "Ch. #80",
    T11: "Ch. #81", T12: "Ch. #85", BAR1: "Ch. #90", BAR2: "Ch. #91", BAR3: "Ch. #92",
  });

  const currentOrder = allTableOrders[selectedTable] || [];
  const setCurrentOrder = (updater: OrderItem[] | ((prev: OrderItem[]) => OrderItem[])) => {
    setAllTableOrders(prev => ({
      ...prev,
      [selectedTable]: typeof updater === "function" ? updater(prev[selectedTable] || []) : updater,
    }));
  };

  const checkNumber = checkCounters[selectedTable] || "Ch. #--";

  const [showPayDialog, setShowPayDialog] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payMounted, setPayMounted] = useState(false);
  const [payAnim, setPayAnim] = useState(false);
  useEffect(() => {
    if (payOpen) {
      setPayMounted(true);
      const t = requestAnimationFrame(() => setPayAnim(true));
      return () => cancelAnimationFrame(t);
    }
    setPayAnim(false);
    const t = setTimeout(() => setPayMounted(false), 300);
    return () => clearTimeout(t);
  }, [payOpen]);
  const tc = useThemeClasses();

  // Split view state
  const [splitPercent, setSplitPercent] = useState(35);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const pct = Math.min(Math.max((y / rect.height) * 100, 15), 55);
    setSplitPercent(pct);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const addItemToOrder = (item: { id: string; name: string; price: number; currency?: "foreign" | "domestic" }) => {
    setCurrentOrder((prev) => {
      const existingNew = prev.find((i) => i.baseId === item.id && !i.ordered);
      if (existingNew) {
        return prev.map((i) => (i.id === existingNew.id ? { ...i, qty: i.qty + 1 } : i));
      }
      const categoryLabel = selectedSubCategory
        ? t(`subcategories.${selectedSubCategory}`)
        : t(`categoriesMain.${selectedMainCategory}`);
      const uniqueId = `${item.id}-${Date.now()}`;
      return [
        ...prev,
        {
          id: uniqueId,
          baseId: item.id,
          price: item.price,
          qty: 1,
          category: categoryLabel,
          ordered: false,
          currency: item.currency ?? "foreign",
        },
      ];
    });
  };

  const commitOrderedQty = (itemId: string, value: number) => {
    setCurrentOrder((prev) => {
      const target = prev.find((i) => i.id === itemId);
      if (!target) return prev;
      if (value <= 0) return prev.filter((i) => i.id !== itemId);
      return prev.map((i) => (i.id === itemId ? { ...i, qty: value, origQty: undefined, deleted: false } : i));
    });
  };

  const commitOrderedRemove = (itemId: string) => {
    setCurrentOrder((prev) => prev.filter((i) => i.id !== itemId));
  };

  const removeItemFromOrder = (itemId: string) => {
    setCurrentOrder((prev) => {
      const target = prev.find((i) => i.id === itemId);
      if (!target) return prev;
      if (target.ordered) {
        return prev.map((i) => (i.id === itemId ? { ...i, deleted: true } : i));
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const setItemQty = (itemId: string, value: number) => {
    setCurrentOrder((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const nextQty = Math.max(0, value);
        if (i.ordered) {
          return { ...i, qty: nextQty, origQty: i.origQty ?? i.qty, deleted: nextQty === 0 ? true : false };
        }
        return { ...i, qty: nextQty };
      })
    );
  };

  const hasPendingChanges = (items: OrderItem[]) =>
    items.some((i) => !i.ordered || i.deleted || (i.origQty !== undefined && i.origQty !== i.qty));

  const handleOrder = () => {
    if (currentOrder.length === 0) return;
    if (!hasPendingChanges(currentOrder)) return;
    setCurrentOrder((prev) => {
      const survivors = prev.filter((i) => !i.deleted);
      const ordered: OrderItem[] = [];
      for (const it of survivors) {
        if (it.ordered) {
          ordered.push({ ...it, origQty: undefined, deleted: false });
        } else {
          const existing = ordered.find((o) => o.baseId === it.baseId);
          if (existing) existing.qty += it.qty;
          else ordered.push({ ...it, ordered: true, origQty: undefined, deleted: false });
        }
      }
      return ordered;
    });
  };

  const totalUsd = currentOrder
    .filter((i) => i.currency === "foreign" && !i.deleted)
    .reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalKrw = currentOrder
    .filter((i) => i.currency === "domestic" && !i.deleted)
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      ref={containerRef}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      className={`h-full flex flex-col sm:flex-row relative ${tc.page}`}
      style={{ touchAction: isDragging ? "none" : undefined }}
    >
      {/* Left Panel - Current Check */}
      <OrderPanel
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        tableDropdownOpen={tableDropdownOpen}
        setTableDropdownOpen={setTableDropdownOpen}
        allTableOrders={allTableOrders}
        currentOrder={currentOrder}
        checkNumber={checkNumber}
        totalUsd={totalUsd}
        totalKrw={totalKrw}
        removeItemFromOrder={removeItemFromOrder}
        setItemQty={setItemQty}
        commitOrderedQty={commitOrderedQty}
        commitOrderedRemove={commitOrderedRemove}
        setShowPayDialog={setShowPayDialog}
        onPay={() => startTransition(() => setPayOpen(true))}
        splitPercent={splitPercent}
        handleOrder={handleOrder}
      />

      {/* Drag Handle - visible on mobile only */}
      <div
        className={`sm:hidden flex items-center justify-center w-full h-5 ${tc.raised} border-y ${tc.border} cursor-row-resize select-none shrink-0 touch-none`}
        onPointerDown={(e) => {
          e.preventDefault();
          const el = e.currentTarget;
          el.setPointerCapture(e.pointerId);
          const container = containerRef.current;
          if (!container) return;
          const MIN = 20;
          const MAX = 80;

          const onMove = (ev: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            const y = ev.clientY - rect.top;
            const pct = Math.min(MAX, Math.max(MIN, (y / rect.height) * 100));
            setSplitPercent(pct);
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

      {/* Right Panel - Menu Selection */}
      <MenuPanel
        selectedMainCategory={selectedMainCategory}
        setSelectedMainCategory={setSelectedMainCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        addItemToOrder={addItemToOrder}
      />

      {/* Slide-in Payment panel:
          - mobile: full-screen, slides up from bottom
          - md+: covers menu area only (right of OrderPanel), slides in from right */}
      {payMounted && (
        <div
          aria-hidden="true"
          onClick={() => startTransition(() => setPayOpen(false))}
          className={`${POS_OVERLAY_BACKDROP} bg-black/40 sm:absolute sm:inset-0 sm:top-0 sm:z-20 sm:transition-opacity ${
            payAnim ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {payMounted && (
        <div
          className={`fixed top-16 left-0 right-0 bottom-0 z-[45] sm:absolute sm:top-0 sm:bottom-0 sm:left-1/2 md:left-96 xl:left-[28rem] sm:right-0 sm:z-30 transform transition-transform duration-300 ease-out ${
            payAnim ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"
          } ${tc.isDark ? "bg-[#1e2330]" : "bg-white"} shadow-2xl pb-20 sm:pb-0`}
        >
          <Suspense fallback={<div className="p-6 text-sm">Loading…</div>}>
            <PaymentPage
              embedded
              totalUsd={totalUsd}
              totalKrw={totalKrw}
              checkNumber={checkNumber}
              tableLabel={TABLES.find((t) => t.id === selectedTable)?.label ?? selectedTable}
              onClose={() => startTransition(() => setPayOpen(false))}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}