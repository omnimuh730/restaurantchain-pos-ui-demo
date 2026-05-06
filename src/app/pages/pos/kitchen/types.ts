export type OrderStatus = "received" | "in-progress" | "completed";

export interface KitchenOrderItem {
  id: string;
  itemKey: string;
  qty: number;
  done: boolean;
  modifierKey?: string;
  /** Items from a previous order round — shown grayed out */
  previouslyCompleted?: boolean;
  /** When done is true and qty > 1, how many of the qty are selected for the action. Defaults to qty. */
  selectedQty?: number;
}

export interface KitchenOrder {
  id: string;
  table: string;
  status: OrderStatus;
  orderedAt: number; // timestamp ms
  completedAt?: number;
  items: KitchenOrderItem[];
  isPriority?: boolean;
}

export type ViewTab = "received" | "in-progress" | "completed";
export type SortMode = "oldest" | "newest";
export type ViewMode = "by-table" | "by-item";
