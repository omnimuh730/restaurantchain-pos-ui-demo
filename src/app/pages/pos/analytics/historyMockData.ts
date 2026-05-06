export type EventKind = "order" | "reservation" | "payment" | "no-show" | "walk-in";
export type EventStatus = "completed" | "paid" | "no-show" | "refunded";
export type PaymentKey = "creditCard" | "cash";

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
  tableNum: number;
  barArea?: boolean;
  partySize?: number;
  amount?: number;
  amountKrw?: number;
  paymentKey?: PaymentKey;
  items?: HistoryOrderItem[];
  reservedAt?: string;
  arrivedAt?: string;
  paidAt?: string;
  notesKey?: string;
  linkedToId?: string;
}

const DAY = 24 * 60 * 60 * 1000;

function makeTime(daysAgo: number, hours: number, mins = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, mins, 0, 0);
  return d.getTime();
}

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    id: "h-t1",
    kind: "order",
    status: "completed",
    timestamp: makeTime(0, 12, 35),
    guestKey: "parkK",
    tableNum: 2,
    partySize: 4,
    amount: 156.5,
    paymentKey: "creditCard",
    paidAt: "12:35",
    items: [
      { itemKey: "americano", qty: 2, price: 3.5 },
      { itemKey: "cafeLatte", qty: 1, price: 4 },
      { itemKey: "honeyColdBrew", qty: 1, price: 5.5 },
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
    tableNum: 3,
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
    tableNum: 10,
    partySize: 5,
    reservedAt: "11:00",
    arrivedAt: "11:05",
    notesKey: "confirmedSeated",
  },
  {
    id: "h-y1",
    kind: "order",
    status: "completed",
    timestamp: makeTime(1, 12, 48),
    guestKey: "choW",
    tableNum: 2,
    partySize: 4,
    amount: 88.4,
    paymentKey: "creditCard",
    paidAt: "12:48",
    items: [
      { itemKey: "padThai", qty: 2, price: 14 },
      { itemKey: "greenCurry", qty: 1, price: 16 },
      { itemKey: "icedLatte", qty: 3, price: 4.3 },
      { itemKey: "springRolls", qty: 2, price: 8 },
    ],
  },
  {
    id: "h-y2",
    kind: "no-show",
    status: "no-show",
    timestamp: makeTime(1, 19, 0),
    guestKey: "limS",
    tableNum: 3,
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
    tableNum: 3,
    partySize: 3,
    amount: 67.5,
    amountKrw: 145_000,
    paymentKey: "cash",
    arrivedAt: "19:20",
    paidAt: "20:45",
    linkedToId: "h-y2",
    items: [
      { itemKey: "mushroomRisotto", qty: 1, price: 18 },
      { itemKey: "caesarSalad", qty: 2, price: 12 },
      { itemKey: "garlicBread", qty: 1, price: 7 },
      { itemKey: "lemonade", qty: 3, price: 4.5 },
    ],
  },
  {
    id: "h-y4",
    kind: "order",
    status: "completed",
    timestamp: makeTime(1, 18, 30),
    guestKey: "kimE",
    tableNum: 6,
    partySize: 6,
    amount: 184.25,
    paymentKey: "creditCard",
    paidAt: "20:55",
    items: [
      { itemKey: "seafoodPasta", qty: 2, price: 22 },
      { itemKey: "carbonaraPasta", qty: 2, price: 18 },
      { itemKey: "tboneSteak", qty: 1, price: 38 },
      { itemKey: "caesarSalad", qty: 2, price: 12 },
      { itemKey: "tiramisu", qty: 2, price: 6.5 },
    ],
  },
  {
    id: "h-y5",
    kind: "no-show",
    status: "no-show",
    timestamp: makeTime(1, 21, 0),
    guestKey: "goH",
    tableNum: 1,
    partySize: 2,
    reservedAt: "21:00",
  },
  {
    id: "h-y6",
    kind: "walk-in",
    status: "completed",
    timestamp: makeTime(1, 21, 20),
    guestKey: "walkIn",
    tableNum: 1,
    partySize: 2,
    amount: 32,
    paymentKey: "creditCard",
    arrivedAt: "21:20",
    paidAt: "22:10",
    linkedToId: "h-y5",
    items: [
      { itemKey: "cappuccino", qty: 2, price: 4.5 },
      { itemKey: "cheesecake", qty: 1, price: 7 },
      { itemKey: "hotChocolate", qty: 1, price: 5 },
      { itemKey: "croissant", qty: 2, price: 4 },
    ],
  },
  {
    id: "h-y7",
    kind: "payment",
    status: "refunded",
    timestamp: makeTime(1, 13, 30),
    guestKey: "baeR",
    tableNum: 5,
    partySize: 2,
    amount: 18.5,
    paymentKey: "creditCard",
    paidAt: "13:30",
    notesKey: "refundApp",
  },
  {
    id: "h-2d1",
    kind: "order",
    status: "completed",
    timestamp: makeTime(2, 11, 50),
    guestKey: "seongL",
    tableNum: 2,
    partySize: 4,
    amount: 46.0,
    amountKrw: 164_000,
    paymentKey: "cash",
    paidAt: "13:30",
    items: [
      { itemKey: "vanillaLatte", qty: 2, price: 5 },
      { itemKey: "avocadoToast", qty: 2, price: 14 },
      { itemKey: "kimchi", qty: 1, price: 5000, currency: "domestic" },
      { itemKey: "bibimbap", qty: 1, price: 14000, currency: "domestic" },
      { itemKey: "soju", qty: 1, price: 7000, currency: "domestic" },
      { itemKey: "bulgogi", qty: 1, price: 18000, currency: "domestic" },
      { itemKey: "orangeJuice", qty: 1, price: 6 },
    ],
  },
  {
    id: "h-2d2",
    kind: "no-show",
    status: "no-show",
    timestamp: makeTime(2, 18, 30),
    guestKey: "nohK",
    tableNum: 5,
    partySize: 4,
    reservedAt: "18:30",
  },
  {
    id: "h-2d3",
    kind: "walk-in",
    status: "completed",
    timestamp: makeTime(2, 18, 50),
    guestKey: "walkIn",
    tableNum: 5,
    partySize: 4,
    amount: 112.8,
    paymentKey: "creditCard",
    arrivedAt: "18:50",
    paidAt: "20:20",
    linkedToId: "h-2d2",
    items: [
      { itemKey: "ribeyeSteak", qty: 2, price: 36 },
      { itemKey: "mashedPotatoes", qty: 2, price: 6 },
      { itemKey: "redWine", qty: 2, price: 11 },
      { itemKey: "tiramisu", qty: 1, price: 6.5 },
    ],
  },
  {
    id: "h-2d4",
    kind: "order",
    status: "completed",
    timestamp: makeTime(2, 19, 30),
    guestKey: "haD",
    tableNum: 10,
    partySize: 6,
    amount: 224.6,
    paymentKey: "creditCard",
    paidAt: "21:55",
  },
  {
    id: "h-2d5",
    kind: "payment",
    status: "paid",
    timestamp: makeTime(2, 21, 10),
    guestKey: "minC",
    tableNum: 1,
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
    tableNum: 3,
    partySize: 4,
    amount: 94.4,
    paymentKey: "creditCard",
  },
  {
    id: "h-3d2",
    kind: "no-show",
    status: "no-show",
    timestamp: makeTime(3, 17, 30),
    guestKey: "yooM",
    tableNum: 6,
    partySize: 6,
    reservedAt: "17:30",
  },
  {
    id: "h-3d3",
    kind: "walk-in",
    status: "completed",
    timestamp: makeTime(3, 17, 50),
    guestKey: "walkIn",
    tableNum: 6,
    partySize: 5,
    amount: 0,
    amountKrw: 104_000,
    paymentKey: "creditCard",
    arrivedAt: "17:50",
    linkedToId: "h-3d2",
    items: [
      { itemKey: "bibimbap", qty: 3, price: 14000, currency: "domestic" },
      { itemKey: "bulgogi", qty: 2, price: 18000, currency: "domestic" },
      { itemKey: "soju", qty: 2, price: 7000, currency: "domestic" },
      { itemKey: "kimchiPancake", qty: 1, price: 12000, currency: "domestic" },
    ],
  },
  {
    id: "h-3d4",
    kind: "order",
    status: "completed",
    timestamp: makeTime(3, 19, 0),
    guestKey: "sunR",
    tableNum: 8,
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
    tableNum: 2,
    partySize: 4,
    amount: 104.5,
    paymentKey: "creditCard",
  },
];

export { DAY };
