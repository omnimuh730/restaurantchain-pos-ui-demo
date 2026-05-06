import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { UrgencyKind } from "./data";

export function useKitchenLabels() {
  const { t } = useTranslation("kitchen");
  const { t: tOrders } = useTranslation("orders");

  const itemLabel = useCallback((itemKey: string) => t(`items.${itemKey}`), [t]);

  const modifierLabel = useCallback((modifierKey?: string) => {
    if (!modifierKey) return "";
    return t(`items.${modifierKey}`);
  }, [t]);

  const tableLabel = useCallback(
    (tableId: string) => {
      const tm = /^T(\d+)$/.exec(tableId);
      if (tm) return tOrders("ui.tableNumbered", { n: Number(tm[1]) });
      const bm = /^BAR(\d+)$/.exec(tableId);
      if (bm) return tOrders("ui.barNumbered", { n: Number(bm[1]) });
      return tableId;
    },
    [tOrders],
  );

  const urgencyLabel = useCallback(
    (kind: UrgencyKind, minutes: number) => {
      switch (kind) {
        case "just_now":
          return t("urgency.just_now");
        case "short":
          return t("urgency.short", { count: minutes });
        case "warn":
          return t("urgency.warn", { count: minutes });
        case "urgent":
          return t("urgency.urgent", { count: minutes });
        default: {
          const _exhaustive: never = kind;
          return _exhaustive;
        }
      }
    },
    [t],
  );

  return { itemLabel, modifierLabel, tableLabel, urgencyLabel };
}
