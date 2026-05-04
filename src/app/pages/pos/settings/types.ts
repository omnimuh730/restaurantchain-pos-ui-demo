import type { ComponentType } from "react";

export interface SettingGroup {
  id: string;
  labelKey: string;
  descKey: string;
  icon: ComponentType<{ className?: string }>;
}

export type StaffRole = "Waiter" | "Chef" | "Cashier";

export type StaffStatus = "active" | "inactive" | "pending";

export interface StaffMember {
  id: string;
  /** When set, UI shows `t(nameKey)`; otherwise `name`. */
  nameKey?: string;
  name: string;
  username: string;
  role: StaffRole;
  status: StaffStatus;
  joinDate: string;
  permissionCount: number;
  permissions: Record<string, boolean>;
}

export interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
  holderName: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  color: string;
  subCategories: MenuSubCategory[];
}

export interface MenuSubCategory {
  id: string;
  label: string;
  color: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  /** English fallback used as i18n `defaultValue` for `menuItems.{id}`; display is always resolved from locale when a key exists. */
  name: string;
  price: number;
  currency?: "foreign" | "domestic";
  color: string;
  active?: boolean;
}

export interface RoleConfig {
  color: string;
  softColor: string;
  softColorLight: string;
  icon: ComponentType<{ className?: string }>;
}

export interface PermissionItem {
  id: string;
  icon: ComponentType<{ className?: string }>;
}