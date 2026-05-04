import {
  Store,
  Shield,
  Users,
  Sparkles,
  CreditCard,
  UtensilsCrossed,
  Crown,
  ChefHat,
  Truck,
  UserCheck,
  Wallet,
  Wifi,
  Car,
  Baby,
  Dog,
  Music,
  Cigarette,
  PartyPopper,
  Armchair,
  Thermometer,
  Languages,
  GlassWater,
  Accessibility,
  CircleParking,
  HandCoins,
  Phone,
  Calendar,
  Settings as SettingsIcon,
  Star,
  Flame,
  Drumstick,
  Beer,
  Beef,
  Gem,
  Fish,
  Salad,
  Wine,
  Coffee,
  Leaf,
  Soup,
  Utensils,
  Heart,
  Briefcase,
  Cake,
  Moon,
  Zap,
  Home,
  DoorClosed,
  TreePine,
  PanelTop,
  LayoutGrid,
} from "lucide-react";
import type {
  SettingGroup,
  StaffMember,
  StaffRole,
  RoleConfig,
  PaymentCard,
  MenuCategory,
  PermissionItem,
} from "./types";

// ─── Sidebar Groups ─────────────────────────────────────
export const GROUPS: SettingGroup[] = [
  {
    id: "general",
    labelKey: "settings.groups.general.label",
    descKey: "settings.groups.general.desc",
    icon: Store,
  },
  {
    id: "menu",
    labelKey: "settings.groups.menu.label",
    descKey: "settings.groups.menu.desc",
    icon: UtensilsCrossed,
  },
  {
    id: "amenities",
    labelKey: "settings.groups.amenities.label",
    descKey: "settings.groups.amenities.desc",
    icon: UtensilsCrossed,
  },
  {
    id: "security",
    labelKey: "settings.groups.security.label",
    descKey: "settings.groups.security.desc",
    icon: Shield,
  },
  {
    id: "staff",
    labelKey: "settings.groups.staff.label",
    descKey: "settings.groups.staff.desc",
    icon: Users,
  },
  {
    id: "upgrade",
    labelKey: "settings.groups.upgrade.label",
    descKey: "settings.groups.upgrade.desc",
    icon: Sparkles,
  },
];

// ─── Staff Roles ─────────────────────────────────────────
export const STAFF_ROLES: StaffRole[] = [
  "Waiter",
  "Chef",
  "Cashier",
];

export const ROLE_CONFIG: Record<StaffRole, RoleConfig> = {
  Waiter: {
    color: "text-blue-400",
    softColor: "bg-blue-900/30 text-blue-400 border-blue-700",
    softColorLight: "bg-blue-100 text-blue-800 border-blue-300",
    icon: UserCheck,
  },
  Chef: {
    color: "text-blue-400",
    softColor: "bg-sky-900/30 text-sky-400 border-sky-700",
    softColorLight: "bg-sky-100 text-sky-800 border-sky-300",
    icon: ChefHat,
  },
  Cashier: {
    color: "text-blue-400",
    softColor:
      "bg-indigo-900/30 text-indigo-400 border-indigo-700",
    softColorLight:
      "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: Wallet,
  },
};

export const ALL_PERMISSIONS: { groupId: string; items: PermissionItem[] }[] = [
  {
    groupId: "pageAccess",
    items: [
      { id: "floor-plan", icon: Store },
      { id: "orders", icon: UtensilsCrossed },
      { id: "kitchen", icon: ChefHat },
    ],
  },
  {
    groupId: "actions",
    items: [
      { id: "reservations", icon: Calendar },
      { id: "take-orders", icon: UtensilsCrossed },
      { id: "process-payment", icon: CreditCard },
      { id: "menu-management", icon: UtensilsCrossed },
      { id: "manage-tables", icon: LayoutGrid },
      { id: "settings-password", icon: Shield },
    ],
  },
];

export const PERM_ICONS = [
  { id: "floor-plan", icon: Store },
  { id: "orders", icon: UtensilsCrossed },
  { id: "kitchen", icon: ChefHat },
  { id: "reservations", icon: Calendar },
  { id: "settings-password", icon: Shield },
];

export const ROLE_DEFAULTS: Record<
  StaffRole,
  Record<string, boolean>
> = {
  Waiter: { orders: true, kitchen: true, "take-orders": true },
  Chef: { kitchen: true },
  Cashier: {
    "floor-plan": true,
    reservations: true,
    orders: true,
    kitchen: true,
    "take-orders": true,
    "process-payment": true,
    "menu-management": true,
  },
};

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: "2",
    nameKey: "settings.mockStaff.jamieChen",
    name: "Jamie Chen",
    username: "jamie.chen",
    role: "Chef",
    status: "active",
    joinDate: "Mar 2023",
    permissionCount: 2,
    permissions: { kitchen: true, "settings-password": true },
  },
  {
    id: "3",
    nameKey: "settings.mockStaff.samRivera",
    name: "Sam Rivera",
    username: "sam.rivera",
    role: "Waiter",
    status: "active",
    joinDate: "Jun 2023",
    permissionCount: 4,
    permissions: {
      orders: true,
      kitchen: true,
      "settings-password": true,
      "take-orders": true,
    },
  },
  {
    id: "4",
    nameKey: "settings.mockStaff.taylorKim",
    name: "Taylor Kim",
    username: "taylor.kim",
    role: "Cashier",
    status: "active",
    joinDate: "Jan 2024",
    permissionCount: 9,
    permissions: {
      "floor-plan": true,
      reservations: true,
      orders: true,
      kitchen: true,
      "settings-password": true,
      "take-orders": true,
      "process-payment": true,
      "manage-tables": true,
      "menu-management": true,
    },
  },
  {
    id: "5",
    nameKey: "settings.mockStaff.caseyPark",
    name: "Casey Park",
    username: "casey.park",
    role: "Cashier",
    status: "active",
    joinDate: "Aug 2024",
    permissionCount: 8,
    permissions: {
      "floor-plan": true,
      reservations: true,
      orders: true,
      kitchen: true,
      "settings-password": true,
      "take-orders": true,
      "process-payment": true,
      "manage-tables": true,
    },
  },
  {
    id: "6",
    nameKey: "settings.mockStaff.rileyThompson",
    name: "Riley Thompson",
    username: "riley.t",
    role: "Waiter",
    status: "active",
    joinDate: "Feb 2025",
    permissionCount: 4,
    permissions: {
      orders: true,
      kitchen: true,
      "settings-password": true,
      "take-orders": true,
    },
  },
  {
    id: "7",
    nameKey: "settings.mockStaff.morganDavis",
    name: "Morgan Davis",
    username: "morgan.d",
    role: "Chef",
    status: "active",
    joinDate: "Apr 2024",
    permissionCount: 2,
    permissions: { kitchen: true, "settings-password": true },
  },
  {
    id: "8",
    nameKey: "settings.mockStaff.jordanLee",
    name: "Jordan Lee",
    username: "jordan.lee",
    role: "Waiter",
    status: "inactive",
    joinDate: "Oct 2024",
    permissionCount: 4,
    permissions: {
      orders: true,
      kitchen: true,
      "settings-password": true,
      "take-orders": true,
    },
  },
  {
    id: "9",
    nameKey: "settings.mockStaff.alexNguyen",
    name: "Alex Nguyen",
    username: "alex.nguyen",
    role: "Waiter",
    status: "pending",
    joinDate: "Apr 2026",
    permissionCount: 4,
    permissions: {
      orders: true,
      kitchen: true,
      "settings-password": true,
      "take-orders": true,
    },
  },
];

// ─── Amenities ───────────────────────────────────────────
export const AMENITIES = [
  { id: "parking", icon: CircleParking },
  { id: "valet", icon: Car },
  { id: "wifi", icon: Wifi },
  {
    id: "credit-cards",
    icon: CreditCard,
  },
  { id: "cash", icon: HandCoins },
  { id: "mobile-pay", icon: Phone },
  {
    id: "wheelchair",
    icon: Accessibility,
  },
  { id: "high-chairs", icon: Baby },
  {
    id: "kids-menu",
    icon: UtensilsCrossed,
  },
  { id: "dog-friendly", icon: Dog },
  { id: "live-music", icon: Music },
  { id: "dress-code", icon: UserCheck },
  { id: "smoking", icon: Cigarette },
  {
    id: "private-events",
    icon: PartyPopper,
  },
  { id: "catering", icon: ChefHat },
  { id: "delivery", icon: Truck },
  { id: "takeout", icon: UtensilsCrossed },
  { id: "reservations", icon: Calendar },
  { id: "walk-ins", icon: Users },
  { id: "outdoor", icon: Armchair },
  {
    id: "heated-patio",
    icon: Thermometer,
  },
  { id: "ac", icon: Thermometer },
  {
    id: "multilingual",
    icon: Languages,
  },
  { id: "bar-lounge", icon: GlassWater },
];

// ─── Cuisine ─────────────────────────────────────────────
export const CUISINES = [
  { id: "grilled-beef", icon: Flame },
  {
    id: "grilled-pork",
    icon: Drumstick,
  },
  { id: "bar-pub", icon: Beer },
  { id: "meat", icon: Beef },
  { id: "fine-dining", icon: Gem },
  { id: "seafood", icon: Fish },
  { id: "korean", icon: UtensilsCrossed },
  { id: "western", icon: Utensils },
  { id: "wine", icon: Wine },
  { id: "brunch", icon: Coffee },
  { id: "vegan", icon: Leaf },
  { id: "steakhouse", icon: Beef },
  { id: "fusion", icon: Sparkles },
  { id: "healthy", icon: Salad },
  { id: "noodles-soup", icon: Soup },
  { id: "family-meal", icon: Users },
];

// ─── Occasion & Vibe ─────────────────────────────────────
export const OCCASIONS = [
  { id: "date-night", icon: Heart },
  {
    id: "business-dinner",
    icon: Briefcase,
  },
  { id: "celebration", icon: Cake },
  {
    id: "casual-dining",
    icon: UtensilsCrossed,
  },
  { id: "romantic", icon: Heart },
  {
    id: "family-friendly",
    icon: Baby,
  },
  { id: "late-night", icon: Moon },
  { id: "quick-bite", icon: Zap },
];

// ─── Seating Preference ──────────────────────────────────
export const SEATING_PREFERENCES = [
  { id: "dining-hall", icon: Home },
  {
    id: "private-room",
    icon: DoorClosed,
  },
  { id: "terrace", icon: TreePine },
  { id: "window-seat", icon: PanelTop },
  { id: "bar", icon: GlassWater },
];

// ─── Payment Cards ───────────────────────────────────────
export const PAYMENT_CARDS: PaymentCard[] = [
  {
    id: "1",
    brand: "credit card",
    last4: "4242",
    expiry: "12/26",
    isDefault: true,
    holderName: "Alex Morgan",
  },
  {
    id: "2",
    brand: "credit card",
    last4: "8888",
    expiry: "03/27",
    holderName: "Glass Onion LLC",
  },
];

// ─── Menu Categories ────────────────────────────────────
export const INITIAL_MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "hot-foods",
    label: "Hot Foods",
    color: "bg-blue-600",
    subCategories: [
      {
        id: "dumplings",
        label: "Dumplings",
        color: "bg-blue-600",
        items: [
          {
            id: "pork-dumplings",
            name: "Pork Dumplings",
            price: 8.0,
            color: "bg-blue-600",
          },
          {
            id: "shrimp-dumplings",
            name: "Shrimp Dumplings",
            price: 9.0,
            color: "bg-blue-600",
          },
          {
            id: "vegetable-dumplings",
            name: "Vegetable Dumplings",
            price: 7.0,
            color: "bg-blue-600",
          },
        ],
      },
      {
        id: "spring-rolls",
        label: "Spring Rolls",
        color: "bg-blue-600",
        items: [
          {
            id: "veggie-spring-roll",
            name: "Vegetable Spring Rolls",
            price: 6.0,
            color: "bg-blue-600",
          },
          {
            id: "pork-spring-roll",
            name: "Pork Spring Rolls",
            price: 7.0,
            color: "bg-blue-600",
          },
        ],
      },
      {
        id: "bao-buns",
        label: "Bao Buns",
        color: "bg-blue-600",
        items: [
          {
            id: "pork-belly-bao",
            name: "Pork Belly Bao",
            price: 9.0,
            color: "bg-blue-600",
          },
          {
            id: "chicken-bao",
            name: "Chicken Bao",
            price: 8.0,
            color: "bg-blue-600",
          },
        ],
      },
      {
        id: "hot-soups",
        label: "Hot Soups",
        color: "bg-blue-600",
        items: [
          {
            id: "miso-soup",
            name: "Miso Soup",
            price: 5.0,
            color: "bg-blue-600",
          },
          {
            id: "ramen",
            name: "Ramen",
            price: 12.0,
            color: "bg-blue-600",
          },
          {
            id: "pho",
            name: "Pho",
            price: 13.0,
            color: "bg-blue-600",
          },
        ],
      },
    ],
  },
  {
    id: "cold-foods",
    label: "Cold Foods",
    color: "bg-blue-600",
    subCategories: [
      {
        id: "sushi-sashimi",
        label: "Sushi & Sashimi",
        color: "bg-blue-600",
        items: [
          {
            id: "salmon-sushi",
            name: "Salmon Sushi",
            price: 8.0,
            color: "bg-blue-600",
          },
          {
            id: "tuna-sushi",
            name: "Tuna Sushi",
            price: 9.0,
            color: "bg-blue-600",
          },
          {
            id: "california-roll",
            name: "California Roll",
            price: 10.0,
            color: "bg-blue-600",
          },
        ],
      },
      {
        id: "salads",
        label: "Salads",
        color: "bg-blue-600",
        items: [
          {
            id: "asian-chicken-salad",
            name: "Asian Chicken Salad",
            price: 10.0,
            color: "bg-blue-600",
          },
          {
            id: "cucumber-salad",
            name: "Cucumber Salad",
            price: 6.0,
            color: "bg-blue-600",
          },
        ],
      },
    ],
  },
  {
    id: "main-meal",
    label: "Main Meal",
    color: "bg-blue-600",
    subCategories: [
      {
        id: "rice-dishes",
        label: "Rice Dishes",
        color: "bg-blue-600",
        items: [
          {
            id: "fried-rice",
            name: "Fried Rice",
            price: 12.0,
            color: "bg-blue-600",
          },
          {
            id: "bibimbap",
            name: "Bibimbap",
            price: 14.0,
            color: "bg-blue-600",
          },
        ],
      },
      {
        id: "noodle-dishes",
        label: "Noodle Dishes",
        color: "bg-blue-600",
        items: [
          {
            id: "pad-thai",
            name: "Pad Thai",
            price: 13.0,
            color: "bg-blue-600",
          },
          {
            id: "chow-mein",
            name: "Chow Mein",
            price: 12.0,
            color: "bg-blue-600",
          },
        ],
      },
      {
        id: "stir-fry",
        label: "Stir Fry",
        color: "bg-blue-600",
        items: [
          {
            id: "kung-pao-chicken",
            name: "Kung Pao Chicken",
            price: 15.0,
            color: "bg-blue-600",
          },
          {
            id: "mongolian-beef",
            name: "Mongolian Beef",
            price: 16.0,
            color: "bg-blue-600",
          },
        ],
      },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    color: "bg-blue-600",
    subCategories: [
      {
        id: "tea",
        label: "Tea",
        color: "bg-blue-600",
        items: [
          {
            id: "green-tea",
            name: "Green Tea",
            price: 3.0,
            color: "bg-blue-600",
          },
          {
            id: "bubble-tea",
            name: "Bubble Tea",
            price: 5.0,
            color: "bg-blue-600",
          },
        ],
      },
      {
        id: "beer",
        label: "Beer",
        color: "bg-blue-600",
        items: [
          {
            id: "asahi",
            name: "Asahi",
            price: 7.0,
            color: "bg-blue-600",
          },
          {
            id: "sapporo",
            name: "Sapporo",
            price: 7.0,
            color: "bg-blue-600",
          },
        ],
      },
      {
        id: "cocktails",
        label: "Cocktails",
        color: "bg-blue-600",
        items: [
          {
            id: "lychee-martini",
            name: "Lychee Martini",
            price: 12.0,
            color: "bg-blue-600",
          },
          {
            id: "sake-bomb",
            name: "Sake Bomb",
            price: 10.0,
            color: "bg-blue-600",
          },
        ],
      },
    ],
  },
];

// ─── Upgrade Features ────────────────────────────────────
export const PRO_FEATURE_IDS = [
  "staff20",
  "analytics",
  "multiFloor",
  "emailSupport",
  "receiptBranding",
  "reservations",
] as const;
export const ULTRA_FEATURE_IDS = [
  "allPro",
  "staffUnlimited",
  "multiLocation",
  "support247",
  "api",
  "domain",
  "inventory",
  "accountManager",
] as const;

export const MENU_TILE_COLORS = [
  "bg-blue-500",
  "bg-blue-600",
  "bg-blue-700",
  "bg-blue-800",
  "bg-blue-900",
  "bg-sky-600",
  "bg-sky-700",
  "bg-indigo-600",
  "bg-indigo-700",
  "bg-slate-600",
  "bg-slate-700",
  "bg-slate-800",
];