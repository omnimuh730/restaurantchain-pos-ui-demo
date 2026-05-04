import { useState } from "react";
import { Check, Minus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import type { KitchenOrder } from "./types";
import { formatTime24, getElapsedMinutes } from "./data";
import { ConfirmActionModal } from "./ConfirmActionModal";
import { ItemCountModal } from "./ItemCountModal";
import { menuItemName, modifierLabel, tableLabel } from "../../../../i18n/utils";

interface OrderDetailModalProps {
  order: KitchenOrder;
  allOrders: KitchenOrder[];
  viewTab: "received" | "in-progress" | "completed";
  onClose: () => void;
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  recallOrder: (id: string) => void;
  toggleItemDone: (orderId: string, itemId: string) => void;
  setItemSelectedQty: (orderId: string, itemId: string, count: number) => void;
}

function itemKindKey(it: KitchenOrder["items"][number]) {
  return `${it.itemKey}|${it.modifierKey ?? ""}`;
}

export function OrderDetailModal({
  order,
  allOrders,
  viewTab,
  onClose,
  acceptOrder,
  completeOrder,
  recallOrder,
  toggleItemDone,
  setItemSelectedQty,
}: OrderDetailModalProps) {
  const { t } = useTranslation();
  const tc = useThemeClasses();
  const [showConfirm, setShowConfirm] = useState<"complete" | "recall" | "accept" | "received-complete" | null>(null);
  const [countModalItemId, setCountModalItemId] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<{
    items: KitchenOrder["items"];
    totalQty: number;
    selectedQty: number;
    itemKey: string;
    modifierKey?: string;
    distribute: (count: number) => void;
  } | null>(null);

  const isInProgress = viewTab === "in-progress";
  const isCompleted = viewTab === "completed";
  const isReceived = viewTab === "received";

  const tableOrders = allOrders.filter((o) => o.tableId === order.tableId);
  const itemSource = new Map<string, KitchenOrder>();
  const allTableItems: KitchenOrder["items"] = [];
  for (const o of tableOrders) {
    for (const i of o.items) {
      itemSource.set(i.id, o);
      allTableItems.push(i);
    }
  }
  const statusOf = (it: KitchenOrder["items"][number]): "received" | "in-progress" | "completed" => {
    const src = itemSource.get(it.id);
    if (!src) return "in-progress";
    if (src.status === "received") return "received";
    if (src.status === "completed" || it.previouslyCompleted) return "completed";
    return "in-progress";
  };
  const sourceIdOf = (itemId: string) => itemSource.get(itemId)?.id ?? order.id;

  const checkedItems = allTableItems.filter((i) => i.done && statusOf(i) === "in-progress");
  const receivedCheckedItems = allTableItems.filter((i) => i.done && statusOf(i) === "received");
  const recallCheckedItems = allTableItems.filter((i) => i.done && statusOf(i) === "completed");

  const handleCompleteClick = () => {
    if (checkedItems.length === 0) return;
    setShowConfirm("complete");
  };

  const handleRecallClick = () => {
    if (recallCheckedItems.length === 0) return;
    setShowConfirm("recall");
  };

  const handleConfirm = () => {
    if (showConfirm === "complete") {
      for (const o of tableOrders) if (o.status === "in-progress") completeOrder(o.id);
    } else if (showConfirm === "received-complete") {
      for (const o of tableOrders) if (o.status === "received") completeOrder(o.id);
    } else if (showConfirm === "recall") {
      for (const o of tableOrders) {
        const hasCompletedChecked = o.items.some((i) => i.done && (o.status === "completed" || i.previouslyCompleted));
        if (hasCompletedChecked) recallOrder(o.id);
      }
    } else if (showConfirm === "accept") {
      for (const o of tableOrders) if (o.status === "received") acceptOrder(o.id);
    }
    setShowConfirm(null);
    onClose();
  };

  const metaLine = [
    t("kitchen.orderDetail.orderedAt", { time: formatTime24(order.orderedAt) }),
    order.completedAt ? t("kitchen.orderDetail.completedAt", { time: formatTime24(order.completedAt) }) : null,
  ]
    .filter(Boolean)
    .join(t("kitchen.orderDetail.metaJoin"));

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${tc.overlay} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`${tc.card} rounded-xl shadow-xl w-[90%] max-w-md max-h-[92vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-5 border-b ${tc.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-[1.125rem] ${tc.heading}`}>{tableLabel(t, order.tableId)}</h3>
              <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>{metaLine}</p>
            </div>
            <button onClick={onClose} className={`p-1.5 rounded-lg ${tc.hover} ${tc.subtext} cursor-pointer`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {(() => {
            const tOrders = allOrders.filter((o) => o.tableId === order.tableId);
            const receivedKinds = new Set<string>();
            const inProgressKinds = new Set<string>();
            const completedKinds = new Set<string>();
            for (const o of tOrders) {
              for (const i of o.items) {
                const k = itemKindKey(i);
                if (o.status === "received") receivedKinds.add(k);
                else if (o.status === "completed" || i.previouslyCompleted) completedKinds.add(k);
                else inProgressKinds.add(k);
              }
            }
            const receivedQty = receivedKinds.size;
            const inProgressQty = inProgressKinds.size;
            const completedQty = completedKinds.size;
            const showElapsed = receivedQty + inProgressQty > 0;
            const elapsedMins = getElapsedMinutes(order.orderedAt);
            return (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {receivedQty > 0 && (
                  <span className="px-2 py-0.5 rounded-lg text-[0.6875rem] bg-amber-500/20 text-amber-500">
                    {t("kitchen.orderDetail.badgeReceived", { count: receivedQty })}
                  </span>
                )}
                {inProgressQty > 0 && (
                  <span className="px-2 py-0.5 rounded-lg text-[0.6875rem] bg-blue-600/20 text-blue-400">
                    {t("kitchen.orderDetail.badgeInProgress", { count: inProgressQty })}
                  </span>
                )}
                {completedQty > 0 && (
                  <span className="px-2 py-0.5 rounded-lg text-[0.6875rem] bg-green-600/20 text-green-400">
                    {t("kitchen.orderDetail.badgeCompleted", { count: completedQty })}
                  </span>
                )}
                {showElapsed && (
                  <span className={`ml-auto text-[0.6875rem] ${tc.muted}`}>
                    {t("kitchen.urgencyMinsElapsed", { mins: elapsedMins })}
                  </span>
                )}
              </div>
            );
          })()}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-1">
          {(() => {
            type Group = {
              key: string;
              itemKey: string;
              modifierKey?: string;
              status: "received" | "in-progress" | "completed";
              totalQty: number;
              selectedQty: number;
              anyDone: boolean;
              items: typeof order.items;
            };
            const map = new Map<string, Group>();
            for (const it of allTableItems) {
              const itemStatus: Group["status"] = statusOf(it);
              const key = `${it.itemKey}|${it.modifierKey ?? ""}|${itemStatus}`;
              const existing = map.get(key);
              if (existing) {
                existing.totalQty += it.qty;
                existing.selectedQty += it.done ? (it.selectedQty ?? it.qty) : 0;
                existing.anyDone = existing.anyDone || it.done;
                existing.items.push(it);
              } else {
                map.set(key, {
                  key,
                  itemKey: it.itemKey,
                  modifierKey: it.modifierKey,
                  status: itemStatus,
                  totalQty: it.qty,
                  selectedQty: it.done ? (it.selectedQty ?? it.qty) : 0,
                  anyDone: it.done,
                  items: [it],
                });
              }
            }
            return Array.from(map.values());
          })().map((group) => {
            const itemCompleted = group.status === "completed";
            const itemInProgress = group.status === "in-progress";
            const itemReceived = group.status === "received";
            const canInteract =
              (isInProgress && itemInProgress) || (isCompleted && itemCompleted) || (isReceived && itemReceived);
            const showCheckbox = !itemReceived || isReceived;
            const isReadOnlyCompleted = !canInteract && itemCompleted;
            const isReadOnlyInProgress = !canInteract && itemInProgress;
            const checked = isReadOnlyCompleted ? true : isReadOnlyInProgress ? false : group.anyDone;

            const distributeCount = (count: number) => {
              let remaining = count;
              for (const it of group.items) {
                const take = Math.min(it.qty, remaining);
                setItemSelectedQty(sourceIdOf(it.id), it.id, take);
                remaining -= take;
              }
            };
            const openCountModal = () => {
              setCountModalItemId(group.key);
              setActiveGroup({
                items: group.items,
                totalQty: group.totalQty,
                selectedQty: group.selectedQty,
                itemKey: group.itemKey,
                modifierKey: group.modifierKey,
                distribute: distributeCount,
              });
            };
            const handleClick = () => {
              if (!canInteract) return;
              if (group.totalQty > 1 && !group.anyDone && !itemReceived) openCountModal();
              else if (group.anyDone) {
                for (const it of group.items) toggleItemDone(sourceIdOf(it.id), it.id);
              } else {
                const first = group.items[0];
                toggleItemDone(sourceIdOf(first.id), first.id);
              }
            };

            return (
              <div
                key={group.key}
                onClick={canInteract ? handleClick : undefined}
                className={`flex items-center gap-2.5 p-2 rounded-lg ${
                  isReadOnlyCompleted || isReadOnlyInProgress
                    ? ""
                    : tc.isDark
                      ? "border border-[#2a3040] bg-[#161b28]"
                      : "border border-slate-200 bg-slate-50/50"
                } ${canInteract ? "cursor-pointer select-none" : ""}`}
              >
                {showCheckbox && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    disabled={!canInteract}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      checked
                        ? isCompleted
                          ? "bg-amber-500 border-amber-500 text-white"
                          : "bg-green-500 border-green-500 text-white"
                        : isCompleted && itemInProgress
                          ? "bg-blue-600 border-blue-600 text-white cursor-not-allowed"
                          : itemCompleted
                            ? `bg-green-500/20 border-green-400 ${canInteract ? "hover:border-green-300 cursor-pointer" : "cursor-not-allowed"}`
                            : itemReceived
                              ? `bg-amber-500/20 border-amber-500 ${canInteract ? "hover:border-amber-400 cursor-pointer" : "cursor-not-allowed"}`
                              : `bg-blue-600/20 border-blue-400 ${canInteract ? "hover:border-blue-300 cursor-pointer" : "cursor-not-allowed"}`
                    }`}
                  >
                    {checked ? (
                      <Check className="w-3 h-3" strokeWidth={3} />
                    ) : isCompleted && itemInProgress ? (
                      <Minus className="w-3 h-3" strokeWidth={3} />
                    ) : null}
                  </button>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[0.8125rem] ${
                      isReadOnlyCompleted || isReadOnlyInProgress
                        ? tc.text2
                        : checked
                          ? `line-through ${tc.muted}`
                          : tc.text2
                    }`}
                  >
                    {menuItemName(t, group.itemKey)}
                  </p>
                  {group.modifierKey && (
                    <p className={`text-[0.625rem] ${tc.muted} mt-0.5`}>∟ {modifierLabel(t, group.modifierKey)}</p>
                  )}
                </div>
                <span
                  className={`text-[0.875rem] shrink-0 ${
                    isReadOnlyCompleted || isReadOnlyInProgress
                      ? tc.text2
                      : checked
                        ? tc.muted
                        : tc.text2
                  }`}
                >
                  {group.anyDone && group.selectedQty < group.totalQty
                    ? `${group.selectedQty}/${group.totalQty}`
                    : group.totalQty}
                </span>
              </div>
            );
          })}
        </div>

        <div className={`p-5 border-t ${tc.border} flex gap-2`}>
          {viewTab === "received" && (
            <>
              <button
                onClick={() => setShowConfirm("accept")}
                className={`flex-1 py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors border-2 ${
                  tc.isDark
                    ? "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    : "border-blue-500 text-blue-500 hover:bg-blue-50"
                }`}
              >
                {t("kitchen.actions.accept")}
              </button>
              <button
                onClick={() => setShowConfirm("received-complete")}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.8125rem] cursor-pointer transition-colors"
              >
                {t("kitchen.actions.complete")}
              </button>
            </>
          )}
          {viewTab === "in-progress" && (
            <button
              onClick={handleCompleteClick}
              disabled={checkedItems.length === 0}
              className={`flex-1 py-2.5 rounded-lg text-white text-[0.8125rem] transition-colors ${
                checkedItems.length === 0
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {t("kitchen.actions.completeWithCount", { count: checkedItems.length })}
            </button>
          )}
          {viewTab === "completed" && (
            <button
              onClick={handleRecallClick}
              disabled={recallCheckedItems.length === 0}
              className={`flex-1 py-2.5 rounded-lg text-white text-[0.8125rem] transition-colors ${
                recallCheckedItems.length === 0
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {t("kitchen.actions.recallWithCount", { count: recallCheckedItems.length })}
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmActionModal
          action={showConfirm === "received-complete" ? "complete" : showConfirm}
          items={
            showConfirm === "complete"
              ? checkedItems
              : showConfirm === "recall"
                ? recallCheckedItems
                : receivedCheckedItems.length > 0
                  ? receivedCheckedItems
                  : allTableItems.filter((i) => statusOf(i) === "received")
          }
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(null)}
        />
      )}

      {countModalItemId && activeGroup && (
        <ItemCountModal
          item={{
            id: countModalItemId,
            itemKey: activeGroup.itemKey,
            modifierKey: activeGroup.modifierKey,
            qty: activeGroup.totalQty,
            done: false,
            selectedQty: activeGroup.selectedQty || activeGroup.totalQty,
          }}
          action={isCompleted ? "recall" : "complete"}
          onConfirm={(count) => {
            activeGroup.distribute(count);
            setCountModalItemId(null);
            setActiveGroup(null);
          }}
          onCancel={() => {
            setCountModalItemId(null);
            setActiveGroup(null);
          }}
        />
      )}
    </div>
  );
}
