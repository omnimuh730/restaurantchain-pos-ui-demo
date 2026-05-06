import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import type { KitchenOrder } from "./types";
import { formatTime24, getElapsedMinutes, getUrgencyState } from "./data";
import { ConfirmActionModal } from "./ConfirmActionModal";
import { ItemCountModal } from "./ItemCountModal";
import { useKitchenLabels } from "./useKitchenLabels";

interface KitchenCardProps {
  order: KitchenOrder;
  viewTab: "received" | "in-progress" | "completed";
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  recallOrder: (id: string) => void;
  toggleItemDone: (orderId: string, itemId: string) => void;
  setItemSelectedQty: (orderId: string, itemId: string, count: number) => void;
  setShowDetail: (id: string) => void;
}

export function KitchenCard({ order, viewTab, acceptOrder, completeOrder, recallOrder, toggleItemDone, setItemSelectedQty, setShowDetail }: KitchenCardProps) {
  const tc = useThemeClasses();
  const { t } = useTranslation("kitchen");
  const { itemLabel, modifierLabel, tableLabel, urgencyLabel } = useKitchenLabels();
  const [showConfirm, setShowConfirm] = useState<"complete" | "recall" | "accept" | "received-complete" | null>(null);
  const [countModalItemId, setCountModalItemId] = useState<string | null>(null);

  const elapsed = getElapsedMinutes(order.orderedAt);
  const urgencyState = getUrgencyState(elapsed);
  const urgencyText = urgencyLabel(urgencyState.kind, urgencyState.minutes);

  const isReceived = viewTab === "received";
  const isInProgress = viewTab === "in-progress";
  const isCompleted = viewTab === "completed";
  const isFullyCompleted = order.status === "completed";

  // Completed view shows finished items (either previouslyCompleted on in-progress orders, or all items on fully-completed orders).
  const displayItems = isCompleted
    ? isFullyCompleted ? order.items : order.items.filter((i) => i.previouslyCompleted)
    : order.items.filter((i) => !i.previouslyCompleted);

  const checkedItems = order.items.filter((i) => i.done && !i.previouslyCompleted);
  const completedCheckedItems = isFullyCompleted
    ? order.items.filter((i) => i.done)
    : order.items.filter((i) => i.done && i.previouslyCompleted);

  const handleCompleteClick = () => {
    if (checkedItems.length === 0) return;
    setShowConfirm("complete");
  };

  const handleRecallClick = () => {
    if (completedCheckedItems.length === 0) return;
    setShowConfirm("recall");
  };

  const handleConfirm = () => {
    if (showConfirm === "complete" || showConfirm === "received-complete") {
      completeOrder(order.id);
    } else if (showConfirm === "recall") {
      recallOrder(order.id);
    } else if (showConfirm === "accept") {
      acceptOrder(order.id);
    }
    setShowConfirm(null);
  };

  return (
    <div
      className={`rounded-xl flex flex-col overflow-hidden shrink-0 w-full md:w-[280px] ${
        tc.isDark ? "bg-[#1e2330] border border-[#2a3040]" : "bg-white border border-slate-300 shadow-sm"
      }`}
    >
      {/* Card header */}
      <div className="px-4 pt-3.5 pb-1">
        {/* Order time + urgency */}
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[0.75rem] ${tc.isDark ? "text-slate-400" : "text-slate-400"}`}>
            {t("ui.orderAt", { time: formatTime24(order.orderedAt) })}
          </span>
          {!isCompleted && (
            <span className="flex items-center gap-1">
              {urgencyState.isUrgent && (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[0.6875rem] text-red-500">{urgencyText}</span>
                </>
              )}
              {urgencyState.isWarning && (
                <>
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[0.6875rem] text-orange-500">{urgencyText}</span>
                </>
              )}
              {!urgencyState.isUrgent && !urgencyState.isWarning && elapsed <= 1 && (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className={`text-[0.6875rem] ${tc.isDark ? "text-blue-400" : "text-blue-500"}`}>{urgencyText}</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Table name */}
        <h3 className={`text-[1.125rem] ${tc.isDark ? "text-white" : "text-slate-900"}`}>
          {tableLabel(order.table)}
        </h3>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3 mb-2">
          {isReceived && (
            <>
              <button
                onClick={() => setShowConfirm("accept")}
                className={`flex-1 py-2 rounded-lg text-[0.8125rem] cursor-pointer transition-colors border-2 ${
                  tc.isDark ? "border-blue-500 text-blue-400 hover:bg-blue-500/10" : "border-blue-500 text-blue-500 hover:bg-blue-50"
                }`}
              >
                {t("ui.accept")}
              </button>
              <button
                onClick={() => setShowConfirm("received-complete")}
                className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.8125rem] cursor-pointer transition-colors"
              >
                {t("ui.complete")}
              </button>
            </>
          )}
          {isInProgress && (
            <button
              onClick={handleCompleteClick}
              disabled={checkedItems.length === 0}
              className={`flex-1 py-2 rounded-lg text-white text-[0.8125rem] transition-colors ${
                checkedItems.length === 0
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {checkedItems.length > 0
                ? t("ui.completeWithCount", { count: checkedItems.length })
                : t("ui.complete")}
            </button>
          )}
          {isCompleted && (
            <button
              onClick={handleRecallClick}
              disabled={completedCheckedItems.length === 0}
              className={`flex-1 py-2 rounded-lg text-white text-[0.8125rem] transition-colors ${
                completedCheckedItems.length === 0
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {completedCheckedItems.length > 0
                ? t("ui.recallWithCount", { count: completedCheckedItems.length })
                : t("ui.recall")}
            </button>
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="px-4 pb-2 space-y-1.5">
        {displayItems.map((item) => {
          const handleItemClick = () => {
            if (!(isInProgress || isCompleted || isReceived)) return;
            if (item.qty > 1 && !item.done && !isReceived) {
              setCountModalItemId(item.id);
            } else {
              toggleItemDone(order.id, item.id);
            }
          };
          return (
          <div
            key={item.id}
            onClick={handleItemClick}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${
              tc.isDark ? "border-[#2a3040] bg-[#161b28]" : "border-slate-200 bg-slate-50/50"
            } ${(isInProgress || isCompleted || isReceived) ? "cursor-pointer select-none" : ""}`}
          >
            <div className="flex-1 min-w-0">
              <span className={`text-[0.8125rem] ${
                item.done
                  ? tc.isDark ? "text-slate-300 line-through" : "text-slate-500 line-through"
                  : tc.isDark ? "text-slate-200" : "text-slate-700"
              }`}>
                {itemLabel(item.itemKey)}
              </span>
              {item.modifierKey ? (
                <p className={`text-[0.6875rem] mt-0.5 ${tc.isDark ? "text-slate-500" : "text-slate-400"}`}>
                  ∟ {modifierLabel(item.modifierKey)}
                </p>
              ) : null}
            </div>
            <span className={`text-[0.875rem] shrink-0 ${
              item.done
                ? tc.isDark ? "text-slate-500" : "text-slate-400"
                : tc.isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              {item.done && item.selectedQty !== undefined && item.selectedQty < item.qty
                ? `${item.selectedQty}/${item.qty}`
                : item.qty}
            </span>
            {/* Circle checkbox — interactive for received, in-progress, and completed */}
            {(isInProgress || isCompleted || isReceived) && (
              <button
                onClick={(e) => { e.stopPropagation(); handleItemClick(); }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                  item.done
                    ? isCompleted
                      ? "bg-amber-500 border-amber-500 text-white"
                      : isReceived
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-green-500 border-green-500 text-white"
                    : isInProgress
                      ? "bg-blue-600/20 border-blue-400 hover:border-blue-300"
                      : isCompleted
                        ? "bg-green-500/20 border-green-400 hover:border-green-300"
                        : isReceived
                          ? "bg-amber-500/20 border-amber-500 hover:border-amber-400"
                          : tc.isDark
                            ? "border-slate-500 hover:border-slate-300"
                            : "border-slate-300 hover:border-slate-400"
                }`}
              >
                {item.done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </button>
            )}
          </div>
          );
        })}

      </div>

      {/* Footer — Order Details */}
      <div className="mx-4 mb-3 mt-1">
        <button
          onClick={() => setShowDetail(order.id)}
          className={`w-full py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors border ${
            tc.isDark
              ? "border-[#2a3040] text-slate-400 hover:bg-[#1a2030]"
              : "border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          {t("ui.orderDetails")}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <ConfirmActionModal
          action={showConfirm === "received-complete" ? "complete" : showConfirm}
          items={
            showConfirm === "complete" ? checkedItems
              : showConfirm === "recall" ? completedCheckedItems
              : checkedItems.length > 0 ? checkedItems
              : order.items
          }
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(null)}
        />
      )}

      {/* Item Count Modal — choose how many of this item to act on */}
      {countModalItemId && (() => {
        const targetItem = order.items.find((i) => i.id === countModalItemId);
        if (!targetItem) return null;
        return (
          <ItemCountModal
            item={targetItem}
            action={isCompleted ? "recall" : "complete"}
            onConfirm={(count) => {
              setItemSelectedQty(order.id, targetItem.id, count);
              setCountModalItemId(null);
            }}
            onCancel={() => setCountModalItemId(null)}
          />
        );
      })()}
    </div>
  );
}