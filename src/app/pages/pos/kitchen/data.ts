import type { KitchenOrder } from "./types";

function makeTime(minsAgo: number) {
  return Date.now() - minsAgo * 60 * 1000;
}

export const INITIAL_ORDERS: KitchenOrder[] = [
  // ── In Progress ──
  {
    id: "k1", table: "Table 3", status: "in-progress", orderedAt: makeTime(20),
    items: [
      { id: "k1a", name: "Seafood Pasta", qty: 2, done: false },
      { id: "k1b", name: "White Rice Cake", qty: 1, done: true },
      { id: "k1c", name: "Mango Juice", qty: 3, done: true },
      { id: "k1d", name: "Carbonara Pasta", qty: 2, done: false, previouslyCompleted: true },
    ],
  },
  {
    id: "k2", table: "Table 1", status: "in-progress", orderedAt: makeTime(10),
    items: [
      { id: "k2a", name: "T-bone Steak", qty: 1, done: false, modifier: "Medium Rare" },
      { id: "k2b", name: "Sirloin Steak", qty: 2, done: false, previouslyCompleted: true },
    ],
  },
  {
    id: "k3", table: "Table 17", status: "in-progress", orderedAt: makeTime(1),
    items: [
      { id: "k3a", name: "Ribeye Steak", qty: 1, done: true },
      { id: "k3b", name: "New York Strip Steak", qty: 1, done: true },
      { id: "k3c", name: "Sirloin Steak", qty: 1, done: true, modifier: "Well Done" },
    ],
  },
  {
    id: "k4", table: "Table 13", status: "in-progress", orderedAt: makeTime(0.5),
    items: [
      { id: "k4a", name: "Mushroom Risotto", qty: 1, done: false },
      { id: "k4b", name: "Caesar Salad", qty: 2, done: false },
      { id: "k4c", name: "Garlic Bread", qty: 1, done: true },
    ],
  },
  {
    id: "k5", table: "Table 7", status: "in-progress", orderedAt: makeTime(30),
    items: [
      { id: "k5a", name: "Pad Thai", qty: 2, done: true },
      { id: "k5b", name: "Green Curry", qty: 1, done: false },
      { id: "k5c", name: "Tom Yum Soup", qty: 1, done: true },
    ],
  },
  {
    id: "k6", table: "Table 9", status: "in-progress", orderedAt: makeTime(18),
    items: [
      { id: "k6a", name: "Kung Pao Chicken", qty: 1, done: false },
      { id: "k6b", name: "Fried Rice", qty: 2, done: true },
      { id: "k6c", name: "Spring Rolls", qty: 3, done: true },
    ],
  },
  {
    id: "k7", table: "Table 5", status: "in-progress", orderedAt: makeTime(2),
    items: [
      { id: "k7a", name: "Salmon Sushi", qty: 4, done: false },
      { id: "k7b", name: "Miso Soup", qty: 2, done: false },
    ],
  },
  {
    id: "k8", table: "Table 11", status: "in-progress", orderedAt: makeTime(6),
    items: [
      { id: "k8a", name: "Bibimbap", qty: 1, done: false },
      { id: "k8b", name: "Kimchi", qty: 1, done: false },
      { id: "k8c", name: "Green Tea", qty: 2, done: false },
    ],
  },
  {
    id: "k9", table: "Table 2", status: "in-progress", orderedAt: makeTime(3),
    items: [
      { id: "k9a", name: "Ramen", qty: 2, done: false, modifier: "Extra Spicy" },
      { id: "k9b", name: "Gyoza", qty: 1, done: false },
    ],
  },
  {
    id: "k10", table: "Table 8", status: "in-progress", orderedAt: makeTime(7),
    items: [
      { id: "k10a", name: "Pho", qty: 1, done: false },
      { id: "k10b", name: "Bubble Tea", qty: 3, done: false },
    ],
  },
  {
    id: "k14", table: "Table 15", status: "in-progress", orderedAt: makeTime(15),
    items: [
      { id: "k14a", name: "Teriyaki Salmon", qty: 1, done: true },
      { id: "k14b", name: "Edamame", qty: 2, done: false },
    ],
  },
  {
    id: "k15", table: "Table 6", status: "in-progress", orderedAt: makeTime(12),
    items: [
      { id: "k15a", name: "Dan Dan Noodles", qty: 1, done: false },
      { id: "k15b", name: "Wonton Soup", qty: 2, done: true },
    ],
  },
  {
    id: "k16", table: "Table 14", status: "in-progress", orderedAt: makeTime(9),
    items: [
      { id: "k16a", name: "Takoyaki", qty: 3, done: false },
      { id: "k16b", name: "Sake", qty: 2, done: false },
    ],
  },
  {
    id: "k17", table: "Table 19", status: "in-progress", orderedAt: makeTime(5),
    items: [
      { id: "k17a", name: "Massaman Curry", qty: 1, done: false },
      { id: "k17b", name: "Jasmine Rice", qty: 1, done: false },
    ],
  },
  {
    id: "k18", table: "Table 20", status: "in-progress", orderedAt: makeTime(4),
    items: [
      { id: "k18a", name: "Lo Mein", qty: 2, done: false },
      { id: "k18b", name: "Spring Rolls", qty: 1, done: true },
    ],
  },
  {
    id: "k19", table: "Bar 1", status: "in-progress", orderedAt: makeTime(8),
    items: [
      { id: "k19a", name: "Lychee Martini", qty: 2, done: true },
      { id: "k19b", name: "Mai Tai", qty: 1, done: false },
    ],
  },
  {
    id: "k20", table: "Table 16", status: "in-progress", orderedAt: makeTime(11),
    items: [
      { id: "k20a", name: "Cashew Chicken", qty: 1, done: false },
      { id: "k20b", name: "Fried Rice", qty: 1, done: true },
      { id: "k20c", name: "Thai Tea", qty: 2, done: false },
    ],
  },
  // ── Received ──
  {
    id: "k21", table: "Table 4", status: "received", orderedAt: makeTime(1),
    items: [
      { id: "k21a", name: "Bulgogi", qty: 2, done: false },
      { id: "k21b", name: "Steamed Rice", qty: 2, done: false },
    ],
  },
  {
    id: "k22", table: "Table 10", status: "received", orderedAt: makeTime(0.5),
    items: [
      { id: "k22a", name: "Udon Noodles", qty: 1, done: false },
      { id: "k22b", name: "Tempura", qty: 1, done: false },
    ],
  },
  {
    id: "k23", table: "Table 12", status: "received", orderedAt: makeTime(2),
    items: [
      { id: "k23a", name: "Chow Mein", qty: 1, done: false },
      { id: "k23b", name: "Hot & Sour Soup", qty: 2, done: false },
      { id: "k23c", name: "Coca-Cola", qty: 3, done: false },
    ],
  },
  {
    id: "k24", table: "Bar 2", status: "received", orderedAt: makeTime(0.3),
    items: [
      { id: "k24a", name: "Sake Bomb", qty: 2, done: false },
      { id: "k24b", name: "Soju", qty: 1, done: false },
    ],
  },
  // ── Completed (lots) ──
  {
    id: "k11", table: "Table 6", status: "completed", orderedAt: makeTime(55), completedAt: makeTime(35),
    items: [
      { id: "k11a", name: "Teriyaki Chicken", qty: 1, done: false },
      { id: "k11b", name: "Udon Noodles", qty: 1, done: false },
    ],
  },
  {
    id: "k12", table: "Table 4", status: "completed", orderedAt: makeTime(70), completedAt: makeTime(48),
    items: [
      { id: "k12a", name: "Lobster Tail", qty: 1, done: false },
      { id: "k12b", name: "Truffle Fries", qty: 1, done: false },
      { id: "k12c", name: "Red Wine", qty: 2, done: false },
    ],
  },
  {
    id: "k13", table: "Table 10", status: "completed", orderedAt: makeTime(90), completedAt: makeTime(65),
    items: [
      { id: "k13a", name: "Bulgogi", qty: 2, done: false },
      { id: "k13b", name: "Steamed Rice", qty: 2, done: false },
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

export function getUrgencyLabel(mins: number): { label: string; isUrgent: boolean; isWarning: boolean } {
  if (mins >= 20) return { label: `${mins}m elapsed`, isUrgent: true, isWarning: false };
  if (mins >= 10) return { label: `${mins}m elapsed`, isUrgent: false, isWarning: true };
  if (mins <= 1) return { label: "Just now", isUrgent: false, isWarning: false };
  return { label: `${mins}m`, isUrgent: false, isWarning: false };
}
