import i18n from "./config";

function moneyUiLanguage(): string {
  return i18n.resolvedLanguage ?? i18n.language ?? "ko";
}

/** Glyph shown beside domestic (KRW) amount inputs — matches `formatDomesticWon` style per language. */
export function domesticCurrencyInputGlyph(): string {
  return moneyUiLanguage().startsWith("ko") ? "원" : "₩";
}

/**
 * Domestic (KRW) amounts: Korean UI uses amount + 원; English UI uses the won sign ₩ prefix.
 */
export function formatDomesticWon(value: number | undefined | null): string {
  if (value == null || Number.isNaN(Number(value))) return "—";
  const n = Math.round(Number(value));
  if (moneyUiLanguage().startsWith("ko")) {
    return `${n.toLocaleString("ko-KR")}원`;
  }
  return `₩${n.toLocaleString("en-US")}`;
}

export function formatForeignUsd(value: number | undefined | null): string {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
