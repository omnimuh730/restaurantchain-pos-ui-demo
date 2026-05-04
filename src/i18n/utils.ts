import type { TFunction } from "i18next";

export function menuItemName(t: TFunction, itemKey: string): string {
  return t(`menuItems.${itemKey}`);
}

export function modifierLabel(t: TFunction, modifierKey: string): string {
  return t(`modifiers.${modifierKey}`);
}

export function tableLabel(t: TFunction, tableId: string): string {
  return t(`tables.${tableId}`);
}

export function floorLabel(t: TFunction, floorId: string): string {
  return t(`floors.${floorId}`);
}

export function floorDisplayName(t: TFunction, floor: { id: string; name?: string }): string {
  if (floor.name?.trim()) return floor.name;
  return t(`floorPlan.floorNames.${floor.id}`);
}

export function tableDisplayLabel(t: TFunction, table: { id: string; label?: string }): string {
  if (table.label?.trim()) return table.label;
  return t(`tables.${table.id}`, { defaultValue: table.id });
}

export function guestLabel(
  t: TFunction,
  guest: { guestKey?: string; guestName?: string },
): string {
  if (guest.guestKey) return t(`guests.${guest.guestKey}`);
  return guest.guestName ?? "";
}
