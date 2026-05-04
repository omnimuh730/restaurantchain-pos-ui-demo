import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import type { KitchenOrderItem } from "./types";

interface ItemCountModalProps {
  item: KitchenOrderItem;
  action: "complete" | "recall";
  onConfirm: (count: number) => void;
  onCancel: () => void;
}

export function ItemCountModal({ item, action, onConfirm, onCancel }: ItemCountModalProps) {
  const tc = useThemeClasses();
  const [count, setCount] = useState(item.selectedQty ?? item.qty);

  const dec = () => setCount((c) => Math.max(1, c - 1));
  const inc = () => setCount((c) => Math.min(item.qty, c + 1));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className={`${tc.card} rounded-xl shadow-xl w-[90%] max-w-sm`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-5 border-b ${tc.border} flex items-center justify-between`}>
          <div>
            <h3 className={`text-[1rem] ${tc.heading}`}>
              {action === "complete" ? "Complete Items" : "Recall Items"}
            </h3>
            <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>{item.name}</p>
          </div>
          <button onClick={onCancel} className={`p-1.5 rounded-lg ${tc.hover} ${tc.subtext} cursor-pointer`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex items-center justify-center gap-4">
          <button
            onClick={dec}
            disabled={count <= 1}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              count <= 1
                ? tc.isDark ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                : tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer" : "bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
            }`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-center min-w-[80px]">
            <span className={`text-[2rem] ${tc.heading}`}>{count}</span>
            <span className={`text-[0.75rem] ${tc.subtext}`}>of {item.qty}</span>
          </div>
          <button
            onClick={inc}
            disabled={count >= item.qty}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              count >= item.qty
                ? tc.isDark ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                : tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer" : "bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
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
            Cancel
          </button>
          <button
            onClick={() => onConfirm(count)}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.8125rem] cursor-pointer transition-colors"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
