/** Korean domestic display: amount + 원 (no ₩ symbol). */
export function formatDomesticWon(value: number | undefined | null): string {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Math.round(Number(value)).toLocaleString("ko-KR")}원`;
}

export function formatForeignUsd(value: number | undefined | null): string {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
