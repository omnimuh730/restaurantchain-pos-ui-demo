import type { TFunction } from "i18next";
import type { HistoryEvent } from "./historyMockData";

export function guestLabel(t: TFunction<"analytics">, guestKey: string): string {
  return t(`history.guests.${guestKey}` as "history.guests.parkK");
}

export function tableLabel(t: TFunction<"analytics">, e: Pick<HistoryEvent, "tableNum" | "barArea">): string {
  return e.barArea
    ? t("history.bar", { num: e.tableNum })
    : t("history.table", { num: e.tableNum });
}

export function itemLabel(t: TFunction<"analytics">, itemKey: string): string {
  return t(`history.items.${itemKey}` as "history.items.americano");
}

export function paymentLabel(t: TFunction<"analytics">, key?: string): string | undefined {
  if (!key) return undefined;
  return t(`history.paymentMethod.${key}` as "history.paymentMethod.creditCard");
}

export function noteLabel(t: TFunction<"analytics">, key?: string): string | undefined {
  if (!key) return undefined;
  return t(`history.notes.${key}` as "history.notes.confirmedSeated");
}
