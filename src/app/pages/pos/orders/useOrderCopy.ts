import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useOrderCopy() {
  const { t } = useTranslation("orders");

  const itemName = useCallback((baseId: string) => t(`items.${baseId}`), [t]);

  const modifierText = useCallback(
    (key: string) => {
      const v = t(`modifiers.${key}`, { defaultValue: "" });
      return v || key;
    },
    [t],
  );

  const tableLabel = useCallback(
    (tableId: string) => {
      const tm = /^T(\d+)$/.exec(tableId);
      if (tm) return t("ui.tableNumbered", { n: Number(tm[1]) });
      const bm = /^BAR(\d+)$/.exec(tableId);
      if (bm) return t("ui.barNumbered", { n: Number(bm[1]) });
      return tableId;
    },
    [t],
  );

  const floorLabel = useCallback((floorId: string) => t(`ui.floorLabels.${floorId}`), [t]);

  return { itemName, modifierText, tableLabel, floorLabel, t };
}
