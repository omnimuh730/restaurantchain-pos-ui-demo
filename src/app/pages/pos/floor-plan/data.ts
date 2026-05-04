import type { Floor, Reservation } from "./types";

// Helper to get date strings relative to today
export const fmtDate = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
};
export const TODAY = fmtDate(0);
const DAY2 = fmtDate(2);
const DAY3 = fmtDate(3);
const PAST1 = fmtDate(-1);
const PAST2 = fmtDate(-2);
const PAST3 = fmtDate(-3);

export const INITIAL_FLOORS: Floor[] = [
  {
    id: "f1",
    name: "Hall",
    tables: [
      { id: "T1", label: "Table 1", seats: 2, shape: "rect", x: 48, y: 48, width: 72, height: 72, status: "available" },
      { id: "T2", label: "Table 2", seats: 4, shape: "circle", x: 216, y: 48, width: 144, height: 216, status: "occupied", revenue: 156500, occupiedSeats: 4, guestName: "Park K.", orderItems: [
        { name: "Americano", qty: 2, price: 3500 }, { name: "Cafe Latte", qty: 1, price: 4000 }, { name: "Flat White", qty: 1, price: 4500 }, { name: "Honey Cold Brew", qty: 1, price: 5500 },
        { name: "Espresso", qty: 2, price: 3000 }, { name: "Cappuccino", qty: 1, price: 4500 }, { name: "Mocha", qty: 1, price: 5000 }, { name: "Macchiato", qty: 1, price: 4500 },
        { name: "Vanilla Latte", qty: 2, price: 5000 }, { name: "Caramel Latte", qty: 1, price: 5000 }, { name: "Hazelnut Latte", qty: 1, price: 5000 }, { name: "Matcha Latte", qty: 2, price: 5500 },
        { name: "Chai Latte", qty: 1, price: 5000 }, { name: "Hot Chocolate", qty: 1, price: 5000 }, { name: "Iced Americano", qty: 3, price: 3800 }, { name: "Iced Latte", qty: 2, price: 4300 },
        { name: "Cold Brew", qty: 1, price: 5500 }, { name: "Nitro Cold Brew", qty: 1, price: 6500 }, { name: "Affogato", qty: 1, price: 6500 }, { name: "Espresso con Panna", qty: 1, price: 4500 },
        { name: "Cortado", qty: 1, price: 4500 }, { name: "Flat Black", qty: 1, price: 4000 }, { name: "Lemonade", qty: 2, price: 4500 }, { name: "Peach Tea", qty: 1, price: 5000 },
        { name: "Green Tea", qty: 1, price: 4500 }, { name: "Earl Grey", qty: 1, price: 4500 }, { name: "Chamomile Tea", qty: 1, price: 4500 }, { name: "Croissant", qty: 2, price: 4000 },
        { name: "Blueberry Muffin", qty: 1, price: 4500 }, { name: "Tiramisu", qty: 1, price: 6500 },
      ] },
      { id: "T3", label: "Table 3", seats: 4, shape: "rect", x: 480, y: 48, width: 144, height: 144, status: "occupied", revenue: 41000, occupiedSeats: 3, guestName: "Lee S.", orderItems: [{ name: "Espresso con Panna", qty: 1, price: 4500 }, { name: "Honey Cold Brew", qty: 2, price: 5500 }, { name: "Oat cold brew", qty: 3, price: 6500 }, { name: "Espresso", qty: 1, price: 3000 }, { name: "Tiramisu", qty: 1, price: 6000 }] },
      { id: "T4", label: "Table 4", seats: 2, shape: "rect", x: 504, y: 216, width: 72, height: 72, status: "available" },
      { id: "T5", label: "Table 5", seats: 4, shape: "rect", x: 48, y: 360, width: 216, height: 72, status: "available" },
      { id: "T6", label: "Table 6", seats: 6, shape: "rect", x: 48, y: 504, width: 144, height: 72, status: "available" },
      { id: "T7", label: "Table 7", seats: 2, shape: "rect", x: 264, y: 504, width: 144, height: 72, status: "available" },
      { id: "T8", label: "Table 8", seats: 4, shape: "rect", x: 480, y: 504, width: 144, height: 72, status: "available" },
      { id: "T9", label: "Table 9", seats: 6, shape: "circle", x: 696, y: 480, width: 144, height: 144, status: "available" },
      { id: "T10", label: "Table 10", seats: 6, shape: "rect", x: 552, y: 336, width: 216, height: 144, status: "occupied", revenue: 17500, occupiedSeats: 5, guestName: "Choi M.", orderItems: [{ name: "Vanilla cold brew", qty: 2, price: 6500 }, { name: "Espresso con Panna", qty: 1, price: 4500 }] },
      { id: "T11", label: "Table 11", seats: 4, shape: "rect", x: 48, y: 648, width: 144, height: 72, status: "available" },
    ],
  },
  {
    id: "f2",
    name: "Lounge",
    tables: [
      { id: "T12", label: "Table 1", seats: 2, shape: "rect", x: 72, y: 48, width: 72, height: 72, status: "available" },
      { id: "T13", label: "Table 2", seats: 4, shape: "rect", x: 264, y: 48, width: 144, height: 72, status: "reserved", guestName: "Ji N.", reservationTime: "12:38" },
      { id: "T14", label: "Table 3", seats: 4, shape: "rect", x: 480, y: 48, width: 144, height: 72, status: "available" },
      { id: "T15", label: "Table 4", seats: 6, shape: "rect", x: 72, y: 192, width: 144, height: 144, status: "available" },
      { id: "T16", label: "Table 5", seats: 2, shape: "rect", x: 288, y: 192, width: 72, height: 72, status: "available" },
      { id: "T17", label: "Table 6", seats: 4, shape: "rect", x: 456, y: 192, width: 144, height: 72, status: "available" },
      { id: "T18", label: "Table 7", seats: 2, shape: "rect", x: 72, y: 360, width: 72, height: 72, status: "available" },
      { id: "T19", label: "Table 8", seats: 4, shape: "rect", x: 264, y: 360, width: 144, height: 72, status: "available" },
    ],
  },
];

export const SAMPLE_RESERVATIONS: Reservation[] = [
  // Today
  { id: "r1", tableId: "T2", guestName: "Kim M.", partySize: 4, startTime: "18:00", duration: 2, day: TODAY, type: "confirmed" },
  { id: "r2", tableId: "T3", guestName: "Park S.", partySize: 2, startTime: "19:00", duration: 1.5, day: TODAY, type: "confirmed" },
  { id: "r3", tableId: "T5", guestName: "Lee J.", partySize: 6, startTime: "20:00", duration: 2, day: TODAY, type: "confirmed" },
  { id: "r4", tableId: "T6", guestName: "Choi K.", partySize: 4, startTime: "18:30", duration: 2, day: TODAY, type: "confirmed" },
  { id: "r5", tableId: "T8", guestName: "Jung H.", partySize: 3, startTime: "21:00", duration: 1.5, day: TODAY, type: "request" },
  { id: "r6", tableId: "T1", guestName: "Yoon A.", partySize: 2, startTime: "19:30", duration: 1, day: TODAY, type: "confirmed" },
  { id: "r7", tableId: "", guestName: "Yoo N.", partySize: 4, startTime: "17:00", duration: 1.5, day: TODAY, type: "request" },
  { id: "r8", tableId: "", guestName: "Han D.", partySize: 2, startTime: "18:30", duration: 1, day: TODAY, type: "request" },
  { id: "r9", tableId: "", guestName: "Kang N.", partySize: 4, startTime: "17:30", duration: 2, day: TODAY, type: "request" },
  { id: "r10", tableId: "", guestName: "Shin B.", partySize: 6, startTime: "19:00", duration: 2, day: TODAY, type: "request" },
  { id: "r11", tableId: "T9", guestName: "Song Y.", partySize: 4, startTime: "19:00", duration: 1.5, day: TODAY, type: "request" },
  { id: "r12", tableId: "T10", guestName: "Im W.", partySize: 6, startTime: "17:30", duration: 2.5, day: TODAY, type: "confirmed" },
  // 2 days later
  { id: "r13", tableId: "T2", guestName: "Oh S.", partySize: 4, startTime: "12:00", duration: 2, day: DAY2, type: "confirmed" },
  { id: "r14", tableId: "", guestName: "Baek J.", partySize: 8, startTime: "18:00", duration: 3, day: DAY2, type: "request" },
  { id: "r15", tableId: "T5", guestName: "Seo H.", partySize: 2, startTime: "19:30", duration: 1.5, day: DAY2, type: "confirmed" },
  { id: "r16", tableId: "", guestName: "Hwang D.", partySize: 4, startTime: "20:00", duration: 2, day: DAY2, type: "request" },
  { id: "r17", tableId: "T1", guestName: "Moon Y.", partySize: 2, startTime: "11:00", duration: 1, day: DAY2, type: "confirmed" },
  // 3 days later
  { id: "r18", tableId: "T3", guestName: "Ryu K.", partySize: 6, startTime: "17:00", duration: 2.5, day: DAY3, type: "confirmed" },
  { id: "r19", tableId: "", guestName: "Jang M.", partySize: 4, startTime: "19:00", duration: 2, day: DAY3, type: "request" },
  { id: "r20", tableId: "", guestName: "Kwon T.", partySize: 2, startTime: "13:00", duration: 1.5, day: DAY3, type: "request" },
  { id: "r21", tableId: "T6", guestName: "Na E.", partySize: 8, startTime: "18:30", duration: 2, day: DAY3, type: "confirmed" },
  { id: "r22", tableId: "", guestName: "Ahn S.", partySize: 6, startTime: "20:30", duration: 2, day: DAY3, type: "request" },
  // Past — yesterday (paid + no-show mix)
  { id: "p1", tableId: "T2", guestName: "Cho W.", partySize: 4, startTime: "12:00", duration: 2, day: PAST1, type: "confirmed", status: "COMPLETED", paid: true },
  { id: "p2", tableId: "T5", guestName: "Bae R.", partySize: 2, startTime: "13:30", duration: 1, day: PAST1, type: "confirmed", status: "COMPLETED", paid: true },
  { id: "p3", tableId: "T6", guestName: "Kim E.", partySize: 6, startTime: "18:00", duration: 2.5, day: PAST1, type: "confirmed", status: "COMPLETED", paid: true, extensionCount: 1 },
  { id: "p4", tableId: "T3", guestName: "Lim S.", partySize: 4, startTime: "19:00", duration: 2, day: PAST1, type: "confirmed", status: "NO_SHOW" },
  { id: "p5", tableId: "T8", guestName: "Park J.", partySize: 3, startTime: "20:00", duration: 1.5, day: PAST1, type: "confirmed", status: "COMPLETED", paid: true },
  { id: "p6", tableId: "T1", guestName: "Go H.", partySize: 2, startTime: "21:00", duration: 1, day: PAST1, type: "confirmed", status: "NO_SHOW" },
  // Walk-ins that took the no-show tables (after 20-min no-show window)
  { id: "p4w", tableId: "T3", guestName: "Walk-in", partySize: 3, startTime: "19:20", duration: 1.5, day: PAST1, type: "confirmed", status: "COMPLETED", paid: true, walkIn: true },
  { id: "p6w", tableId: "T1", guestName: "Walk-in", partySize: 2, startTime: "21:20", duration: 1, day: PAST1, type: "confirmed", status: "COMPLETED", paid: true, walkIn: true },
  // Past — 2 days ago
  { id: "p7", tableId: "T2", guestName: "Seong L.", partySize: 4, startTime: "11:30", duration: 2, day: PAST2, type: "confirmed", status: "COMPLETED", paid: true },
  { id: "p8", tableId: "T9", guestName: "Jeon Y.", partySize: 6, startTime: "13:00", duration: 2.5, day: PAST2, type: "confirmed", status: "COMPLETED", paid: true, extensionCount: 2 },
  { id: "p9", tableId: "T5", guestName: "Noh K.", partySize: 4, startTime: "18:30", duration: 2, day: PAST2, type: "confirmed", status: "NO_SHOW" },
  { id: "p9w", tableId: "T5", guestName: "Walk-in", partySize: 4, startTime: "18:50", duration: 1.5, day: PAST2, type: "confirmed", status: "COMPLETED", paid: true, walkIn: true },
  { id: "p10", tableId: "T10", guestName: "Ha D.", partySize: 6, startTime: "19:30", duration: 2.5, day: PAST2, type: "confirmed", status: "COMPLETED", paid: true },
  { id: "p11", tableId: "T1", guestName: "Min C.", partySize: 2, startTime: "21:00", duration: 1, day: PAST2, type: "confirmed", status: "COMPLETED", paid: true },
  // Past — 3 days ago
  { id: "p12", tableId: "T3", guestName: "Koo B.", partySize: 4, startTime: "12:00", duration: 2, day: PAST3, type: "confirmed", status: "COMPLETED", paid: true },
  { id: "p13", tableId: "T6", guestName: "Yoo M.", partySize: 6, startTime: "17:30", duration: 2.5, day: PAST3, type: "confirmed", status: "NO_SHOW" },
  { id: "p13w", tableId: "T6", guestName: "Walk-in", partySize: 5, startTime: "17:50", duration: 2, day: PAST3, type: "confirmed", status: "COMPLETED", paid: true, walkIn: true },
  { id: "p14", tableId: "T8", guestName: "Sun R.", partySize: 3, startTime: "19:00", duration: 1.5, day: PAST3, type: "confirmed", status: "COMPLETED", paid: true, extensionCount: 1 },
  { id: "p15", tableId: "T2", guestName: "Oh D.", partySize: 4, startTime: "20:00", duration: 2, day: PAST3, type: "confirmed", status: "COMPLETED", paid: true },
];
