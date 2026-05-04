import { Check, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import type { KitchenOrderItem } from "./types";
import { menuItemName, modifierLabel } from "../../../../i18n/utils";

interface ConfirmActionModalProps {
  action: "complete" | "recall" | "accept";
  items: KitchenOrderItem[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmActionModal({ action, items, onConfirm, onCancel }: ConfirmActionModalProps) {
  const { t } = useTranslation();
  const tc = useThemeClasses();
  const copy = t(`kitchen.confirm.${action}`, { returnObjects: true }) as { title: string; desc: string; btn: string };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div className={`${tc.card} rounded-xl shadow-xl w-[90%] max-w-sm`} onClick={(e) => e.stopPropagation()}>
        <div className={`p-5 border-b ${tc.border}`}>
          <h3 className={`text-[1rem] ${tc.heading}`}>{copy.title}</h3>
          <p className={`text-[0.75rem] ${tc.subtext} mt-1`}>{copy.desc}</p>
        </div>

        <div className="p-5 max-h-[40vh] overflow-y-auto space-y-1.5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2.5 p-2 rounded-lg ${
                tc.isDark ? "border border-[#2a3040] bg-[#161b28]" : "border border-slate-200 bg-slate-50/50"
              }`}
            >
              {action === "complete" && (
                <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center shrink-0 text-white">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
              )}
              {action === "accept" && (
                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-blue-600 flex items-center justify-center shrink-0 text-white">
                  <Minus className="w-3 h-3" strokeWidth={3} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-[0.8125rem] ${tc.text2}`}>{menuItemName(t, item.itemKey)}</p>
                {item.modifierKey && (
                  <p className={`text-[0.625rem] ${tc.muted} mt-0.5`}>∟ {modifierLabel(t, item.modifierKey)}</p>
                )}
              </div>
              <span className={`text-[0.875rem] shrink-0 ${tc.text2}`}>
                {item.selectedQty !== undefined && item.selectedQty < item.qty ? item.selectedQty : item.qty}
              </span>
            </div>
          ))}
        </div>

        <div className={`p-5 border-t ${tc.border} flex gap-2`}>
          <button
            onClick={onCancel}
            className={`flex-1 py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors border-2 ${
              tc.isDark
                ? "border-slate-600 text-slate-400 hover:bg-slate-700"
                : "border-slate-300 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.8125rem] cursor-pointer transition-colors"
          >
            {copy.btn}
          </button>
        </div>
      </div>
    </div>
  );
}
