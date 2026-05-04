export type EventKind = "order" | "reservation" | "payment" | "no-show" | "walk-in";
export type EventStatus = "completed" | "paid" | "no-show" | "refunded";

export interface HistoryOrderItem {
  itemKey: string;
  qty: number;
  price: number;
  currency?: "foreign" | "domestic";
}

export interface HistoryEvent {
  id: string;
  kind: EventKind;
  status: EventStatus;
  timestamp: number;
  guestKey: string;
  tableId: string;
  partySize?: number;
  amount?: number;
  amountKrw?: number;
  paymentKey?: "credit" | "cash";
  items?: HistoryOrderItem[];
  reservedAt?: string;
  arrivedAt?: string;
  paidAt?: string;
  notesKey?: "seatedOnTime" | "noShowGrace" | "refundAppetizer";
  linkedToId?: string;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function makeTime(daysAgo: number, hours: number, mins = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, mins, 0, 0);
  return d.getTime();
}

export { DAY, HOUR, makeTime };

export const EVENTS: HistoryEvent[] = [
  {
    id: "h-t1",
    kind: "order",
    status: "completed",
    timestamp: makeTime(0, 12, 35),
    guestKey: "parkK",
    tableId: "T2",
    partySize: 4,
    amount: 156.5,
    paymentKey: "credit",
    paidAt: "12:35",
    items: [
      { itemKey: "americano", qty: 2, price: 3.5 },
      { itemKey: "cafe-latte", qty: 1, price: 4 },
      { itemKey: "honey-cold-brew", qty: 1, price: 5.5 },
      { itemKey: "croissant", qty: 2, price: 4 },
      { itemKey: "tiramisu", qty: 1, price: 6.5 },
    ],
  },
  {
    id: "h-t2",
    kind: "payment",
    status: "paid",
    timestamp: makeTime(0, 13, 12),
    guestKey: "leeS",
    tableId: "T3",
    partySize: 3,
    amount: 41,
    amountKrw: 88_000,
    paymentKey: "cash",
    paidAt: "13:12",
  },
  {
    id: "h-t3",
    kind: "reservation",
    status: "completed",
    timestamp: makeTime(0, 11, 0),
    guestKey: "choiM",
    tableId: "T10",
    partySize: 5,
    reservedAt: "11:00",
    arrivedAt: "11:05",
    notesKey: "seatedOnTime",
  },
  {
    id: "h-y1",
    kind: "order",
    status: "completed",
    timestamp: makeTime(1, 12, 48),
    guestKey: "choW",
    tableId: "T2",
    partySize: 4,
    amount: 88.4,
    paymentKey: "credit",
    paidAt: "12:48",
    items: [
      { itemKey: "pad-thai", qty: 2, price: 14 },
      { itemKey: "thai-green-curry", qty: 1, price: 16 },
      { itemKey: "iced-latte", qty: 3, price: 4.3 },
      { itemKey: "spring-rolls-generic", qty: 2, price: 8 },
    ],
  },
  {
    id: "h-y2",
    kind: "no-show",
    status: "no-show",
    timestamp: makeTime(1, 19, 0),
    guestKey: "limS",
    tableId: "T3",
    partySize: 4,
    reservedAt: "19:00",
    notesKey: "noShowGrace",
  },
  {
    id: "h-y3",
    kind: "walk-in",
    status: "completed",
    timestamp: makeTime(1, 19, 20),
    guestKey: "walkIn",
    tableId: "T3",
    partySize: 3,
    amount: 67.5,
    amountKrw: 145_000,
    paymentKey: "cash",
    arrivedAt: "19:20",
    paidAt: "20:45",
    linkedToId: "h-y2",
    items: [
      { itemKey: "mushroom-risotto", qty: 1, price: 18 },
      { itemKey: "caesar-salad", qty: 2, price: 12 },
      { itemKey: "garlic-bread", qty: 1, price: 7 },
      { itemKey: "lemonade", qty: 3, price: 4.5 },
    ],
  },
  {
    id: "h-y4",
    kind: "order",
    status: "completed",
    timestamp: makeTime(1, 18, 30),
    guestKey: "kimE",
    tableId: "T6",
    partySize: 6,
    amount: 184.25,
    paymentKey: "credit",
    paidAt: "20:55",
    items: [
      { itemKey: "seafood-pasta", qty: 2, price: 22 },
      { itemKey: "carbonara-pasta", qty: 2, price: 18 },
      { itemKey: "t-bone-steak", qty: 1, price: 38 },
      { itemKey: "caesar-salad", qty: 2, price: 12 },
      { itemKey: "tiramisu", qty: 2, price: 6.5 },
    ],
  },
  {
    id: "h-y5",
    kind: "no-show",
    status: "no-show",
    timestamp: makeTime(1, 21, 0),
    guestKey: "goH",
    tableId: "T1",
    partySize: 2,
    reservedAt: "21:00",
  },
  {
    id: "h-y6",
    kind: "walk-in",
    status: "completed",
    timestamp: makeTime(1, 21, 20),
    guestKey: "walkIn",
    tableId: "T1",
    partySize: 2,
    amount: 32,
    paymentKey: "credit",
    arrivedAt: "21:20",
    paidAt: "22:10",
    linkedToId: "h-y5",
    items: [
      { itemKey: "cappuccino", qty: 2, price: 4.5 },
      { itemKey: "cheesecake", qty: 1, price: 7 },
      { itemKey: "hot-chocolate", qty: 1, price: 5 },
      { itemKey: "croissant", qty: 2, price: 4 },
    ],
  },
  {
    id: "h-y7",
    kind: "payment",
    status: "refunded",
    timestamp: makeTime(1, 13, 30),
    guestKey: "baeR",
    tableId: "T5",
    partySize: 2,
    amount: 18.5,
    paymentKey: "credit",
    paidAt: "13:30",
    notesKey: "refundAppetizer",
  },
  {
    id: "h-2d1",
    kind: "order",
    status: "completed",
    timestamp: makeTime(2, 11, 50),
    guestKey: "seongL",
    tableId: "T2",
    partySize: 4,
    amount: 46.0,
    amountKrw: 164_000,
    paymentKey: "cash",
    paidAt: "13:30",
    items: [
      { itemKey: "vanilla-latte", qty: 2, price: 5 },
      { itemKey: "avocado-toast", qty: 2, price: 14 },
      { itemKey: "kimchi", qty: 1, price: 5000, currency: "domestic" },
      { itemKey: "bibimbap", qty: 1, price: 14000, currency: "domestic" },
      { itemKey: "soju", qty: 1, price: 7000, currency: "domestic" },
      { itemKey: "bulgogi", qty: 1, price: 18000, currency: "domestic" },
      { itemKey: "orange-juice", qty: 1, price: 6 },
    ],
  },
  {
    id: "h-2d2",
    kind: "no-show",
    status: "no-show",
    timestamp: makeTime(2, 18, 30),
    guestKey: "nohK",
    tableId: "T5",
    partySize: 4,
    reservedAt: "18:30",
  },
  {
    id: "h-2d3",
    kind: "walk-in",
    status: "completed",
    timestamp: makeTime(2, 18, 50),
    guestKey: "walkIn",
    tableId: "T5",
    partySize: 4,
    amount: 112.8,
    paymentKey: "credit",
    arrivedAt: "18:50",
    paidAt: "20:20",
    linkedToId: "h-2d2",
    items: [
      { itemKey: "ribeye", qty: 2, price: 36 },
      { itemKey: "mashed-potatoes", qty: 2, price: 6 },
      { itemKey: "red-wine", qty: 2, price: 11 },
      { itemKey: "tiramisu", qty: 1, price: 6.5 },
    ],
  },
  {
    id: "h-2d4",
    kind: "order",
    status: "completed",
    timestamp: makeTime(2, 19, 30),
    guestKey: "haD",
    tableId: "T10",
    partySize: 6,
    amount: 224.6,
    paymentKey: "credit",
    paidAt: "21:55",
  },
  {
    id: "h-2d5",
    kind: "payment",
    status: "paid",
    timestamp: makeTime(2, 21, 10),
    guestKey: "minC",
    tableId: "T1",
    partySize: 2,
    amount: 22,
    amountKrw: 47_000,
    paymentKey: "cash",
  },
  {
    id: "h-3d1",
    kind: "order",
    status: "completed",
    timestamp: makeTime(3, 12, 30),
    guestKey: "kooB",
    tableId: "T3",
    partySize: 4,
    amount: 94.4,
    paymentKey: "credit",
  },
  {
    id: "h-3d2",
    kind: "no-show",
    status: "no-show",
    timestamp: makeTime(3, 17, 30),
    guestKey: "yooM",
    tableId: "T6",
    partySize: 6,
    reservedAt: "17:30",
  },
  {
    id: "h-3d3",
    kind: "walk-in",
    status: "completed",
    timestamp: makeTime(3, 17, 50),
    guestKey: "walkIn",
    tableId: "T6",
    partySize: 5,
    amount: 0,
    amountKrw: 104_000,
    paymentKey: "credit",
    arrivedAt: "17:50",
    linkedToId: "h-3d2",
    items: [
      { itemKey: "bibimbap", qty: 3, price: 14000, currency: "domestic" },
      { itemKey: "bulgogi", qty: 2, price: 18000, currency: "domestic" },
      { itemKey: "soju", qty: 2, price: 7000, currency: "domestic" },
      { itemKey: "kimchi-pancake", qty: 1, price: 12000, currency: "domestic" },
    ],
  },
  {
    id: "h-3d4",
    kind: "order",
    status: "completed",
    timestamp: makeTime(3, 19, 0),
    guestKey: "sunR",
    tableId: "T8",
    partySize: 3,
    amount: 58.6,
    amountKrw: 126_000,
    paymentKey: "cash",
  },
  {
    id: "h-3d5",
    kind: "order",
    status: "completed",
    timestamp: makeTime(3, 20, 0),
    guestKey: "ohD",
    tableId: "T2",
    partySize: 4,
    amount: 104.5,
    paymentKey: "credit",
  },
];
