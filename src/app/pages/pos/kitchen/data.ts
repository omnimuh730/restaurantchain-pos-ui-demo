import type { KitchenOrder } from "./types";

function makeTime(minsAgo: number) {
  return Date.now() - minsAgo * 60 * 1000;
}

export const INITIAL_ORDERS: KitchenOrder[] = [
  // ── In Progress ──
  {
    id: "k1", table: "T3", status: "in-progress", orderedAt: makeTime(20),
    items: [
      { id: "k1a", itemKey: "seafood_pasta", qty: 2, done: false },
      { id: "k1b", itemKey: "white_rice_cake", qty: 1, done: true },
      { id: "k1c", itemKey: "mango_juice", qty: 3, done: true },
      { id: "k1d", itemKey: "carbonara_pasta", qty: 2, done: false, previouslyCompleted: true },
    ],
  },
  {
    id: "k2", table: "T1", status: "in-progress", orderedAt: makeTime(10),
    items: [
      { id: "k2a", itemKey: "t_bone_steak", qty: 1, done: false, modifierKey: "mod_medium_rare" },
      { id: "k2b", itemKey: "sirloin_steak", qty: 2, done: false, previouslyCompleted: true },
    ],
  },
  {
    id: "k3", table: "T17", status: "in-progress", orderedAt: makeTime(1),
    items: [
      { id: "k3a", itemKey: "ribeye_steak", qty: 1, done: true },
      { id: "k3b", itemKey: "new_york_strip_steak", qty: 1, done: true },
      { id: "k3c", itemKey: "sirloin_steak", qty: 1, done: true, modifierKey: "mod_well_done" },
    ],
  },
  {
    id: "k4", table: "T13", status: "in-progress", orderedAt: makeTime(0.5),
    items: [
      { id: "k4a", itemKey: "mushroom_risotto", qty: 1, done: false },
      { id: "k4b", itemKey: "caesar_salad", qty: 2, done: false },
      { id: "k4c", itemKey: "garlic_bread", qty: 1, done: true },
    ],
  },
  {
    id: "k5", table: "T7", status: "in-progress", orderedAt: makeTime(30),
    items: [
      { id: "k5a", itemKey: "pad_thai", qty: 2, done: true },
      { id: "k5b", itemKey: "green_curry", qty: 1, done: false },
      { id: "k5c", itemKey: "tom_yum_soup", qty: 1, done: true },
    ],
  },
  {
    id: "k6", table: "T9", status: "in-progress", orderedAt: makeTime(18),
    items: [
      { id: "k6a", itemKey: "kung_pao_chicken", qty: 1, done: false },
      { id: "k6b", itemKey: "fried_rice", qty: 2, done: true },
      { id: "k6c", itemKey: "spring_rolls", qty: 3, done: true },
    ],
  },
  {
    id: "k7", table: "T5", status: "in-progress", orderedAt: makeTime(2),
    items: [
      { id: "k7a", itemKey: "salmon_sushi", qty: 4, done: false },
      { id: "k7b", itemKey: "miso_soup", qty: 2, done: false },
    ],
  },
  {
    id: "k8", table: "T11", status: "in-progress", orderedAt: makeTime(6),
    items: [
      { id: "k8a", itemKey: "bibimbap", qty: 1, done: false },
      { id: "k8b", itemKey: "kimchi", qty: 1, done: false },
      { id: "k8c", itemKey: "green_tea", qty: 2, done: false },
    ],
  },
  {
    id: "k9", table: "T2", status: "in-progress", orderedAt: makeTime(3),
    items: [
      { id: "k9a", itemKey: "ramen", qty: 2, done: false, modifierKey: "mod_extra_spicy" },
      { id: "k9b", itemKey: "gyoza", qty: 1, done: false },
    ],
  },
  {
    id: "k10", table: "T8", status: "in-progress", orderedAt: makeTime(7),
    items: [
      { id: "k10a", itemKey: "pho", qty: 1, done: false },
      { id: "k10b", itemKey: "bubble_tea", qty: 3, done: false },
    ],
  },
  {
    id: "k14", table: "T15", status: "in-progress", orderedAt: makeTime(15),
    items: [
      { id: "k14a", itemKey: "teriyaki_salmon", qty: 1, done: true },
      { id: "k14b", itemKey: "edamame", qty: 2, done: false },
    ],
  },
  {
    id: "k15", table: "T6", status: "in-progress", orderedAt: makeTime(12),
    items: [
      { id: "k15a", itemKey: "dan_dan_noodles", qty: 1, done: false },
      { id: "k15b", itemKey: "wonton_soup", qty: 2, done: true },
    ],
  },
  {
    id: "k16", table: "T14", status: "in-progress", orderedAt: makeTime(9),
    items: [
      { id: "k16a", itemKey: "takoyaki", qty: 3, done: false },
      { id: "k16b", itemKey: "sake", qty: 2, done: false },
    ],
  },
  {
    id: "k17", table: "T19", status: "in-progress", orderedAt: makeTime(5),
    items: [
      { id: "k17a", itemKey: "massaman_curry", qty: 1, done: false },
      { id: "k17b", itemKey: "jasmine_rice", qty: 1, done: false },
    ],
  },
  {
    id: "k18", table: "T20", status: "in-progress", orderedAt: makeTime(4),
    items: [
      { id: "k18a", itemKey: "lo_mein", qty: 2, done: false },
      { id: "k18b", itemKey: "spring_rolls", qty: 1, done: true },
    ],
  },
  {
    id: "k19", table: "BAR1", status: "in-progress", orderedAt: makeTime(8),
    items: [
      { id: "k19a", itemKey: "lychee_martini", qty: 2, done: true },
      { id: "k19b", itemKey: "mai_tai", qty: 1, done: false },
    ],
  },
  {
    id: "k20", table: "T16", status: "in-progress", orderedAt: makeTime(11),
    items: [
      { id: "k20a", itemKey: "cashew_chicken", qty: 1, done: false },
      { id: "k20b", itemKey: "fried_rice", qty: 1, done: true },
      { id: "k20c", itemKey: "thai_tea", qty: 2, done: false },
    ],
  },
  // ── Received ──
  {
    id: "k21", table: "T4", status: "received", orderedAt: makeTime(1),
    items: [
      { id: "k21a", itemKey: "bulgogi", qty: 2, done: false },
      { id: "k21b", itemKey: "steamed_rice", qty: 2, done: false },
    ],
  },
  {
    id: "k22", table: "T10", status: "received", orderedAt: makeTime(0.5),
    items: [
      { id: "k22a", itemKey: "udon_noodles", qty: 1, done: false },
      { id: "k22b", itemKey: "tempura", qty: 1, done: false },
    ],
  },
  {
    id: "k23", table: "T12", status: "received", orderedAt: makeTime(2),
    items: [
      { id: "k23a", itemKey: "chow_mein", qty: 1, done: false },
      { id: "k23b", itemKey: "hot_and_sour_soup", qty: 2, done: false },
      { id: "k23c", itemKey: "coca_cola", qty: 3, done: false },
    ],
  },
  {
    id: "k24", table: "BAR2", status: "received", orderedAt: makeTime(0.3),
    items: [
      { id: "k24a", itemKey: "sake_bomb", qty: 2, done: false },
      { id: "k24b", itemKey: "soju", qty: 1, done: false },
    ],
  },
  // ── Completed (lots) ──
  {
    id: "k11", table: "T6", status: "completed", orderedAt: makeTime(55), completedAt: makeTime(35),
    items: [
      { id: "k11a", itemKey: "teriyaki_chicken", qty: 1, done: false },
      { id: "k11b", itemKey: "udon_noodles", qty: 1, done: false },
    ],
  },
  {
    id: "k12", table: "T4", status: "completed", orderedAt: makeTime(70), completedAt: makeTime(48),
    items: [
      { id: "k12a", itemKey: "lobster_tail", qty: 1, done: false },
      { id: "k12b", itemKey: "truffle_fries", qty: 1, done: false },
      { id: "k12c", itemKey: "red_wine", qty: 2, done: false },
    ],
  },
  {
    id: "k13", table: "T10", status: "completed", orderedAt: makeTime(90), completedAt: makeTime(65),
    items: [
      { id: "k13a", itemKey: "bulgogi", qty: 2, done: false },
      { id: "k13b", itemKey: "steamed_rice", qty: 2, done: false },
    ],
  },
];

export function formatTime24(ts: number) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function getElapsedMinutes(ts: number) {
  return Math.floor((Date.now() - ts) / 60000);
}

export type UrgencyKind = "just_now" | "short" | "warn" | "urgent";

export function getUrgencyState(mins: number): {
  kind: UrgencyKind;
  minutes: number;
  isUrgent: boolean;
  isWarning: boolean;
} {
  if (mins >= 20) return { kind: "urgent", minutes: mins, isUrgent: true, isWarning: false };
  if (mins >= 10) return { kind: "warn", minutes: mins, isUrgent: false, isWarning: true };
  if (mins <= 1) return { kind: "just_now", minutes: mins, isUrgent: false, isWarning: false };
  return { kind: "short", minutes: mins, isUrgent: false, isWarning: false };
}
