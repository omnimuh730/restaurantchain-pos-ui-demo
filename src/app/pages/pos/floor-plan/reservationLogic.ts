import type { Reservation } from "./types";

export const EXTENSION_INCREMENT_MINUTES = 30;
export const EXTENSION_INCREMENT_HOURS = EXTENSION_INCREMENT_MINUTES / 60;

export function estimateDuration(partySize: number): number {
  if (partySize <= 2) return 1.0;
  if (partySize <= 4) return 2.0;
  if (partySize <= 6) return 2.5;
  return 3.0;
}

export function parseTimeToHours(t: string): number {
  const [h, m] = t.split(":").map((v) => parseInt(v, 10));
  return h + (m || 0) / 60;
}

export function getOriginalDuration(r: Reservation): number {
  return estimateDuration(r.partySize);
}

export function getCurrentDuration(r: Reservation): number {
  const ext = r.extensionCount ?? 0;
  return getOriginalDuration(r) + ext * EXTENSION_INCREMENT_HOURS;
}

export function getStartHour(r: Reservation): number {
  return parseTimeToHours(r.startTime);
}

export function getOriginalEndHour(r: Reservation): number {
  return getStartHour(r) + getOriginalDuration(r);
}

export function getCurrentEndHour(r: Reservation): number {
  return getStartHour(r) + getCurrentDuration(r);
}

export type BlockVisualState = "ON_TIME" | "OVERRUN_SOFT" | "OVERRUN_HARD" | "COMPLETED" | "NO_SHOW";

export function getBlockVisualState(r: Reservation, nowHour: number, isToday: boolean): BlockVisualState {
  if (r.status === "NO_SHOW") return "NO_SHOW";
  if (r.status === "COMPLETED" || r.paid) return "COMPLETED";
  if (!isToday) return "ON_TIME";
  if (r.status !== "SEATED") return "ON_TIME";
  const origEnd = getOriginalEndHour(r);
  if (nowHour < origEnd) return "ON_TIME";
  const overrun = nowHour - origEnd;
  if (overrun < EXTENSION_INCREMENT_HOURS) return "OVERRUN_SOFT";
  return "OVERRUN_HARD";
}

export function findNextReservationOnTable(r: Reservation, all: Reservation[]): Reservation | null {
  const start = getStartHour(r);
  const sameTable = all.filter((x) =>
    x.id !== r.id && x.tableId === r.tableId && x.day === r.day &&
    x.status !== "COMPLETED" && getStartHour(x) > start
  );
  sameTable.sort((a, b) => getStartHour(a) - getStartHour(b));
  return sameTable[0] ?? null;
}

export function hasConflictWithNext(r: Reservation, all: Reservation[]): boolean {
  const next = findNextReservationOnTable(r, all);
  if (!next) return false;
  return getCurrentEndHour(r) > getStartHour(next);
}
