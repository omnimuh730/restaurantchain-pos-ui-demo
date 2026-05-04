import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import type { KitchenOrder } from "./types";
import { menuItemName, modifierLabel, tableLabel } from "../../../../i18n/utils";

interface ByItemRow {
  itemKey: string;
  modifierKey?: string;
  totalQty: number;
  doneQty: number;
  tables: string[];
}

interface ByItemViewProps {
  sorted: KitchenOrder[];
}

export function ByItemView({ sorted }: ByItemViewProps) {
  const { t } = useTranslation();
  const tc = useThemeClasses();

  const byItemData: ByItemRow[] = (() => {
    const map = new Map<string, ByItemRow>();
    sorted.forEach((order) => {
      order.items.forEach((item) => {
        if (item.previouslyCompleted) return;
        const key = item.itemKey + (item.modifierKey ? `|${item.modifierKey}` : "");
        const existing = map.get(key);
        if (existing) {
          existing.totalQty += item.qty;
          if (item.done) existing.doneQty += item.qty;
          if (!existing.tables.includes(order.tableId)) existing.tables.push(order.tableId);
        } else {
          map.set(key, {
            itemKey: item.itemKey,
            modifierKey: item.modifierKey,
            totalQty: item.qty,
            doneQty: item.done ? item.qty : 0,
            tables: [order.tableId],
          });
        }
      });
    });
    return Array.from(map.values());
  })();

  if (byItemData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <AlertCircle className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-[0.875rem]">{t("kitchen.byItem.emptyCategory")}</p>
      </div>
    );
  }

  return (
    <div className={`${tc.card} rounded-lg overflow-hidden`}>
      <div
        className={`grid grid-cols-12 gap-2 px-4 py-2.5 border-b ${tc.border} text-[0.6875rem] ${tc.muted} uppercase tracking-wider`}
      >
        <div className="col-span-5">{t("kitchen.byItem.colItem")}</div>
        <div className="col-span-2 text-center">{t("kitchen.byItem.colQty")}</div>
        <div className="col-span-2 text-center">{t("kitchen.byItem.colDone")}</div>
        <div className="col-span-3">{t("kitchen.byItem.colTables")}</div>
      </div>

      <div className={`divide-y ${tc.isDark ? "divide-gray-700/50" : "divide-gray-200"}`}>
        {byItemData.map((row, idx) => {
          const allDone = row.doneQty >= row.totalQty;
          return (
            <div
              key={`${row.itemKey}-${row.modifierKey ?? ""}-${idx}`}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center transition-colors ${
                allDone ? "bg-green-900/5" : `${tc.isDark ? "hover:bg-[#3a3f4d]/30" : "hover:bg-gray-100"}`
              }`}
            >
              <div className="col-span-5">
                <p className={`text-[0.8125rem] ${allDone ? "line-through text-gray-500" : "text-gray-200"}`}>
                  {menuItemName(t, row.itemKey)}
                </p>
                {row.modifierKey && (
                  <p className="text-[0.625rem] text-gray-500">{modifierLabel(t, row.modifierKey)}</p>
                )}
              </div>
              <div className="col-span-2 text-center">
                <span className={`text-[0.875rem] ${allDone ? "text-gray-500" : "text-gray-100"}`}>{row.totalQty}</span>
              </div>
              <div className="col-span-2 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[0.6875rem] ${
                    allDone
                      ? "bg-green-900/20 text-green-400"
                      : row.doneQty > 0
                        ? "bg-amber-900/20 text-amber-400"
                        : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {row.doneQty}/{row.totalQty}
                </span>
              </div>
              <div className="col-span-3 flex flex-wrap gap-1">
                {row.tables.map((tid) => (
                  <span key={tid} className={`px-1.5 py-0.5 rounded text-[0.5625rem] ${tc.badge}`}>
                    {tableLabel(t, tid)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`border-t ${tc.border} px-4 py-3 flex items-center justify-between`}>
        <span className={`text-[0.75rem] ${tc.subtext}`}>
          {t("kitchen.byItem.summary", { items: byItemData.length, orders: sorted.length })}
        </span>
        <span className={`text-[0.75rem] ${tc.subtext}`}>
          {t("kitchen.byItem.totalQtyLabel", { qty: byItemData.reduce((s, r) => s + r.totalQty, 0) })}
        </span>
      </div>
    </div>
  );
}
