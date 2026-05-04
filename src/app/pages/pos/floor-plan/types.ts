export interface Table {
  id: string;
  label: string;
  seats: number;
  shape: "rect" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  status: "available" | "occupied" | "reserved";
  revenue?: number;
  occupiedSeats?: number;
  guestName?: string;
  reservationTime?: string;
  orderItems?: { name: string; qty: number; price?: number }[];
}

export interface Floor {
  id: string;
  name: string;
  tables: Table[];
}

export type ReservationStatus = "REQUESTED" | "CONFIRMED" | "SEATED" | "COMPLETED" | "NO_SHOW";

export interface Reservation {
  id: string;
  tableId: string;
  guestName: string;
  partySize: number;
  startTime: string;
  duration: number;
  day: string;
  type: "confirmed" | "request";
  status?: ReservationStatus;
  paid?: boolean;
  extensionCount?: number;
  walkIn?: boolean;
}

export type ViewMode = "floor" | "table" | "calendar";

export const BASE_UNIT = 72;
export const BASE_W = BASE_UNIT;
export const BASE_H = BASE_UNIT;
export const SNAP_GRID = BASE_UNIT / 3; // 24px snap grid
export const CANVAS_W = 2400;
export const CANVAS_H = 1800;
