import type { KitchenOrder } from "./types";

function makeTime(minsAgo: number) {
  return Date.now() - minsAgo * 60 * 1000;
}

export const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: "k1",
    tableId: "T3",
    status: "in-progress",
    orderedAt: makeTime(20),
    items: [
      { id: "k1a", itemKey: "seafood-pasta", qty: 2, done: false },
      { id: "k1b", itemKey: "white-rice-cake", qty: 1, done: true },
      { id: "k1c", itemKey: "mango-juice", qty: 3, done: true },
      { id: "k1d", itemKey: "carbonara-pasta", qty: 2, done: false, previouslyCompleted: true },
    ],
  },
  {
    id: "k2",
    tableId: "T1",
    status: "in-progress",
    orderedAt: makeTime(10),
    items: [
      { id: "k2a", itemKey: "t-bone-steak", qty: 1, done: false, modifierKey: "medium-rare" },
      { id: "k2b", itemKey: "sirloin-steak", qty: 2, done: false, previouslyCompleted: true },
    ],
  },
  {
    id: "k3",
    tableId: "T17",
    status: "in-progress",
    orderedAt: makeTime(1),
    items: [
      { id: "k3a", itemKey: "ribeye", qty: 1, done: true },
      { id: "k3b", itemKey: "new-york-strip", qty: 1, done: true },
      { id: "k3c", itemKey: "sirloin-steak", qty: 1, done: true, modifierKey: "well-done" },
    ],
  },
  {
    id: "k4",
    tableId: "T13",
    status: "in-progress",
    orderedAt: makeTime(0.5),
    items: [
      { id: "k4a", itemKey: "mushroom-risotto", qty: 1, done: false },
      { id: "k4b", itemKey: "caesar-salad", qty: 2, done: false },
      { id: "k4c", itemKey: "garlic-bread", qty: 1, done: true },
    ],
  },
  {
    id: "k5",
    tableId: "T7",
    status: "in-progress",
    orderedAt: makeTime(30),
    items: [
      { id: "k5a", itemKey: "pad-thai", qty: 2, done: true },
      { id: "k5b", itemKey: "thai-green-curry", qty: 1, done: false },
      { id: "k5c", itemKey: "tom-yum-soup", qty: 1, done: true },
    ],
  },
  {
    id: "k6",
    tableId: "T9",
    status: "in-progress",
    orderedAt: makeTime(18),
    items: [
      { id: "k6a", itemKey: "kung-pao-chicken", qty: 1, done: false },
      { id: "k6b", itemKey: "fried-rice", qty: 2, done: true },
      { id: "k6c", itemKey: "spring-rolls-generic", qty: 3, done: true },
    ],
  },
  {
    id: "k7",
    tableId: "T5",
    status: "in-progress",
    orderedAt: makeTime(2),
    items: [
      { id: "k7a", itemKey: "salmon-sushi", qty: 4, done: false },
      { id: "k7b", itemKey: "miso-soup", qty: 2, done: false },
    ],
  },
  {
    id: "k8",
    tableId: "T11",
    status: "in-progress",
    orderedAt: makeTime(6),
    items: [
      { id: "k8a", itemKey: "bibimbap", qty: 1, done: false },
      { id: "k8b", itemKey: "kimchi", qty: 1, done: false },
      { id: "k8c", itemKey: "green-tea", qty: 2, done: false },
    ],
  },
  {
    id: "k9",
    tableId: "T2",
    status: "in-progress",
    orderedAt: makeTime(3),
    items: [
      { id: "k9a", itemKey: "ramen", qty: 2, done: false, modifierKey: "extra-spicy" },
      { id: "k9b", itemKey: "gyoza", qty: 1, done: false },
    ],
  },
  {
    id: "k10",
    tableId: "T8",
    status: "in-progress",
    orderedAt: makeTime(7),
    items: [
      { id: "k10a", itemKey: "pho", qty: 1, done: false },
      { id: "k10b", itemKey: "bubble-tea", qty: 3, done: false },
    ],
  },
  {
    id: "k14",
    tableId: "T15",
    status: "in-progress",
    orderedAt: makeTime(15),
    items: [
      { id: "k14a", itemKey: "teriyaki-salmon", qty: 1, done: true },
      { id: "k14b", itemKey: "edamame", qty: 2, done: false },
    ],
  },
  {
    id: "k15",
    tableId: "T6",
    status: "in-progress",
    orderedAt: makeTime(12),
    items: [
      { id: "k15a", itemKey: "dan-dan-noodles", qty: 1, done: false },
      { id: "k15b", itemKey: "wonton-soup", qty: 2, done: true },
    ],
  },
  {
    id: "k16",
    tableId: "T14",
    status: "in-progress",
    orderedAt: makeTime(9),
    items: [
      { id: "k16a", itemKey: "takoyaki", qty: 3, done: false },
      { id: "k16b", itemKey: "sake-generic", qty: 2, done: false },
    ],
  },
  {
    id: "k17",
    tableId: "T19",
    status: "in-progress",
    orderedAt: makeTime(5),
    items: [
      { id: "k17a", itemKey: "massaman-curry", qty: 1, done: false },
      { id: "k17b", itemKey: "jasmine-rice", qty: 1, done: false },
    ],
  },
  {
    id: "k18",
    tableId: "T20",
    status: "in-progress",
    orderedAt: makeTime(4),
    items: [
      { id: "k18a", itemKey: "lo-mein", qty: 2, done: false },
      { id: "k18b", itemKey: "spring-rolls-generic", qty: 1, done: true },
    ],
  },
  {
    id: "k19",
    tableId: "BAR1",
    status: "in-progress",
    orderedAt: makeTime(8),
    items: [
      { id: "k19a", itemKey: "lychee-martini", qty: 2, done: true },
      { id: "k19b", itemKey: "mai-tai", qty: 1, done: false },
    ],
  },
  {
    id: "k20",
    tableId: "T16",
    status: "in-progress",
    orderedAt: makeTime(11),
    items: [
      { id: "k20a", itemKey: "cashew-chicken", qty: 1, done: false },
      { id: "k20b", itemKey: "fried-rice", qty: 1, done: true },
      { id: "k20c", itemKey: "thai-tea", qty: 2, done: false },
    ],
  },
  {
    id: "k21",
    tableId: "T4",
    status: "received",
    orderedAt: makeTime(1),
    items: [
      { id: "k21a", itemKey: "bulgogi", qty: 2, done: false },
      { id: "k21b", itemKey: "steamed-rice", qty: 2, done: false },
    ],
  },
  {
    id: "k22",
    tableId: "T10",
    status: "received",
    orderedAt: makeTime(0.5),
    items: [
      { id: "k22a", itemKey: "udon", qty: 1, done: false },
      { id: "k22b", itemKey: "tempura", qty: 1, done: false },
    ],
  },
  {
    id: "k23",
    tableId: "T12",
    status: "received",
    orderedAt: makeTime(2),
    items: [
      { id: "k23a", itemKey: "chow-mein", qty: 1, done: false },
      { id: "k23b", itemKey: "hot-sour-soup", qty: 2, done: false },
      { id: "k23c", itemKey: "coke", qty: 3, done: false },
    ],
  },
  {
    id: "k24",
    tableId: "BAR2",
    status: "received",
    orderedAt: makeTime(0.3),
    items: [
      { id: "k24a", itemKey: "sake-bomb", qty: 2, done: false },
      { id: "k24b", itemKey: "soju", qty: 1, done: false },
    ],
  },
  {
    id: "k11",
    tableId: "T6",
    status: "completed",
    orderedAt: makeTime(55),
    completedAt: makeTime(35),
    items: [
      { id: "k11a", itemKey: "teriyaki-chicken", qty: 1, done: false },
      { id: "k11b", itemKey: "udon", qty: 1, done: false },
    ],
  },
  {
    id: "k12",
    tableId: "T4",
    status: "completed",
    orderedAt: makeTime(70),
    completedAt: makeTime(48),
    items: [
      { id: "k12a", itemKey: "lobster-tail", qty: 1, done: false },
      { id: "k12b", itemKey: "truffle-fries", qty: 1, done: false },
      { id: "k12c", itemKey: "red-wine", qty: 2, done: false },
    ],
  },
  {
    id: "k13",
    tableId: "T10",
    status: "completed",
    orderedAt: makeTime(90),
    completedAt: makeTime(65),
    items: [
      { id: "k13a", itemKey: "bulgogi", qty: 2, done: false },
      { id: "k13b", itemKey: "steamed-rice", qty: 2, done: false },
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

export function getUrgencyParts(mins: number): {
  key: string;
  params?: { mins: number };
  isUrgent: boolean;
  isWarning: boolean;
} {
  if (mins >= 20) return { key: "kitchen.urgencyMinsElapsed", params: { mins }, isUrgent: true, isWarning: false };
  if (mins >= 10) return { key: "kitchen.urgencyMinsElapsed", params: { mins }, isUrgent: false, isWarning: true };
  if (mins <= 1) return { key: "kitchen.urgencyJustNow", isUrgent: false, isWarning: false };
  return { key: "kitchen.urgencyMins", params: { mins }, isUrgent: false, isWarning: false };
}
