import { X, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { formatDomesticWon, formatForeignUsd } from "../../../../i18n/formatMoney";

export type RowCurrency = "foreign" | "domestic";

export interface OrderItemRow {
  id?: string;
  name: string;
  qty: number;
  price?: number;
  ordered?: boolean;
  currency?: RowCurrency;
}

interface OrderItemsTableProps {
  items: OrderItemRow[];
  onQtySet?: (id: string, value: number) => void;
  onRemove?: (id: string) => void;
  showNewItemsDivider?: boolean;
  stickyHeader?: boolean;
  emptyLabel?: string;
}

function fmt(value: number, cur: RowCurrency): string {
  if (cur === "domestic") return formatDomesticWon(value);
  return formatForeignUsd(value);
}

export function OrderItemsTable({
  items,
  onQtySet,
  onRemove,
  showNewItemsDivider = true,
  stickyHeader = true,
  emptyLabel,
}: OrderItemsTableProps) {
  const tc = useThemeClasses();
  const { t } = useTranslation("orders");
  const interactive = !!(onQtySet || onRemove);

  if (items.length === 0 && emptyLabel) {
    return (
      <div className={`text-center ${tc.muted} py-8 px-4`}>
        <p className="text-[0.875rem]">{emptyLabel}</p>
      </div>
    );
  }

  const orderedItems = items.filter((i) => i.ordered);
  const newItems = items.filter((i) => !i.ordered);
  const hasSections =
    showNewItemsDivider &&
    orderedItems.length > 0 &&
    newItems.length > 0;

  const renderRow = (
    item: OrderItemRow,
    key: string,
    isOrderedSection: boolean,
  ) => {
    const cur: RowCurrency = item.currency ?? "foreign";
    const priceText =
      item.price != null ? fmt(item.price, cur) : "—";
    const totalText =
      item.price != null
        ? fmt(item.price * item.qty, cur)
        : "—";
    const textCls = tc.text1;
    const bgCls = isOrderedSection
      ? tc.isDark
        ? "bg-slate-700/30"
        : "bg-slate-100/60"
      : tc.isDark
        ? "bg-blue-600/15 hover:bg-blue-600/25"
        : "bg-blue-50 hover:bg-blue-100";

    return (
      <div
        key={key}
        className={`px-3 py-1 flex items-center gap-1.5 ${bgCls}`}
      >
        <div className="flex-1 min-w-0">
          <span
            className={`text-[0.6875rem] md:text-[0.8125rem] truncate block ${textCls} text-[11px]`}
          >
            {item.name}
          </span>
        </div>
        <div className="w-16 sm:w-18 flex items-center justify-center">
          {onQtySet && item.id ? (
            <div className="flex items-center gap-1 w-full">
              <button
                onClick={() =>
                  onQtySet(
                    item.id!,
                    Math.max(0, +(item.qty - 1).toFixed(2)),
                  )
                }
                className={`shrink-0 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded cursor-pointer transition-colors ${
                  tc.isDark
                    ? "bg-slate-800/60 text-slate-200 hover:bg-slate-700"
                    : "bg-white/80 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
                aria-label={t("ui.ariaDecQty")}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span
                className={`flex-1 min-w-0 text-center text-[0.6875rem] md:text-[0.8125rem] ${textCls} text-[11px]`}
              >
                {item.qty}
              </span>
              <button
                onClick={() =>
                  onQtySet(item.id!, +(item.qty + 1).toFixed(2))
                }
                className={`shrink-0 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded cursor-pointer transition-colors ${
                  tc.isDark
                    ? "bg-slate-800/60 text-slate-200 hover:bg-slate-700"
                    : "bg-white/80 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
                aria-label={t("ui.ariaIncQty")}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span
              className={`text-[0.6875rem] md:text-[0.8125rem] ${textCls} text-center`}
            >
              {item.qty}
            </span>
          )}
        </div>
        <div
          className={`w-16 md:w-20 text-right text-[0.6875rem] md:text-[0.8125rem] ${textCls} text-[11px]`}
        >
          {priceText}
        </div>
        <div
          className={`w-16 md:w-20 text-right text-[0.6875rem] md:text-[0.8125rem] ${textCls} text-[11px]`}
        >
          {totalText}
        </div>
        {interactive && (
          <div className="w-5">
            {onRemove && item.id && (
              <button
                onClick={() => onRemove(item.id!)}
                className={`${tc.subtext} hover:text-red-400 transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div
        className={`${stickyHeader ? "sticky top-0 z-10" : ""} ${tc.isDark ? "bg-[#2a2d35]" : "bg-white"} px-3 py-1.5 flex items-center gap-1.5 text-[0.6875rem] sm:text-[0.8125rem] ${tc.isDark ? "text-blue-400" : "text-blue-600"} border-b ${tc.borderHalf}`}
      >
        <div className="flex-1">{t("ui.panel.historyColItem")}</div>
        <div className="w-16 md:w-18 text-center">{t("ui.panel.historyColQty")}</div>
        <div className="w-16 md:w-20 text-right">{t("ui.panel.historyColEach")}</div>
        <div className="w-16 md:w-20 text-right">{t("ui.panel.historyColLine")}</div>
        {interactive && <div className="w-5" />}
      </div>
      <div>
        {hasSections ? (
          <>
            {orderedItems.map((item, i) =>
              renderRow(item, `ord-${item.id ?? i}`, true),
            )}
            <div
              className={`px-3 py-1 flex items-center gap-2 ${tc.isDark ? "border-slate-600" : "border-slate-200"} border-y`}
            >
              <span
                className={`text-[0.625rem] uppercase tracking-wider ${tc.isDark ? "text-blue-400" : "text-blue-500"}`}
              >
                {t("ui.newItemsDivider")}
              </span>
              <div
                className={`flex-1 h-px ${tc.isDark ? "bg-slate-600" : "bg-slate-200"}`}
              />
            </div>
            {newItems.map((item, i) =>
              renderRow(item, `new-${item.id ?? i}`, false),
            )}
          </>
        ) : (
          items.map((item, i) =>
            renderRow(
              item,
              `row-${item.id ?? i}`,
              !!item.ordered,
            ),
          )
        )}
      </div>
    </div>
  );
}
