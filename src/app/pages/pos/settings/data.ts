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
    label: "General",
    icon: Store,
    description: "Restaurant info, hours, address",
  },
  {
    id: "menu",
    label: "Menu Management",
    icon: UtensilsCrossed,
    description: "Categories & menu items",
  },
  {
    id: "amenities",
    label: "Amenities & Services",
    icon: UtensilsCrossed,
    description: "Parking, WiFi, policies",
  },
  {
    id: "security",
    label: "Security & Payments",
    icon: Shield,
    description: "Password, cards, payment methods",
  },
  {
    id: "staff",
    label: "Staff & Roles",
    icon: Users,
    description: "Team members, permissions",
  },
  {
    id: "upgrade",
    label: "Upgrade Plans",
    icon: Sparkles,
    description: "Pro and Ultra plans",
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

export const ALL_PERMISSIONS: Record<string, PermissionItem[]> =
  {
    "PAGE ACCESS": [
      {
        id: "floor-plan",
        label: "Floor Plan",
        desc: "View floor plan & table layout",
        icon: Store,
      },
      {
        id: "orders",
        label: "Orders",
        desc: "Access orders page",
        icon: UtensilsCrossed,
      },
      {
        id: "kitchen",
        label: "Kitchen",
        desc: "Access kitchen page",
        icon: ChefHat,
      },
    ],
    ACTIONS: [
      {
        id: "reservations",
        label: "Reservations",
        desc: "Handle table reservations",
        icon: Calendar,
      },
      {
        id: "take-orders",
        label: "Take Orders",
        desc: "Create & process orders",
        icon: UtensilsCrossed,
      },
      {
        id: "process-payment",
        label: "Process Payment",
        desc: "Handle payments & refunds",
        icon: CreditCard,
      },
      {
        id: "menu-management",
        label: "Menu Management",
        desc: "Manage menu items & categories",
        icon: UtensilsCrossed,
      },
    ],
  };

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
  { id: "parking", label: "Parking", icon: CircleParking },
  { id: "valet", label: "Valet", icon: Car },
  { id: "wifi", label: "Free WiFi", icon: Wifi },
  {
    id: "credit-cards",
    label: "Credit Cards",
    icon: CreditCard,
  },
  { id: "cash", label: "Cash", icon: HandCoins },
  { id: "mobile-pay", label: "Mobile Pay", icon: Phone },
  {
    id: "wheelchair",
    label: "Wheelchair",
    icon: Accessibility,
  },
  { id: "high-chairs", label: "High Chairs", icon: Baby },
  {
    id: "kids-menu",
    label: "Kids Menu",
    icon: UtensilsCrossed,
  },
  { id: "dog-friendly", label: "Dog Friendly", icon: Dog },
  { id: "live-music", label: "Live Music", icon: Music },
  { id: "dress-code", label: "Dress Code", icon: UserCheck },
  { id: "smoking", label: "Smoking Area", icon: Cigarette },
  {
    id: "private-events",
    label: "Private Events",
    icon: PartyPopper,
  },
  { id: "catering", label: "Catering", icon: ChefHat },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "takeout", label: "Takeout", icon: UtensilsCrossed },
  { id: "reservations", label: "Reservations", icon: Calendar },
  { id: "walk-ins", label: "Walk-ins", icon: Users },
  { id: "outdoor", label: "Outdoor", icon: Armchair },
  {
    id: "heated-patio",
    label: "Heated Patio",
    icon: Thermometer,
  },
  { id: "ac", label: "A/C", icon: Thermometer },
  {
    id: "multilingual",
    label: "Multi-Lingual",
    icon: Languages,
  },
  { id: "bar-lounge", label: "Bar / Lounge", icon: GlassWater },
];

// ─── Cuisine ─────────────────────────────────────────────
export const CUISINES = [
  { id: "grilled-beef", label: "Grilled Beef", icon: Flame },
  {
    id: "grilled-pork",
    label: "Grilled Pork",
    icon: Drumstick,
  },
  { id: "bar-pub", label: "Bar & Pub", icon: Beer },
  { id: "meat", label: "Meat", icon: Beef },
  { id: "fine-dining", label: "Fine Dining", icon: Gem },
  { id: "seafood", label: "Seafood", icon: Fish },
  { id: "korean", label: "Korean", icon: UtensilsCrossed },
  { id: "western", label: "Western Cuisine", icon: Utensils },
  { id: "wine", label: "Wine", icon: Wine },
  { id: "brunch", label: "Brunch", icon: Coffee },
  { id: "vegan", label: "Vegan", icon: Leaf },
  { id: "steakhouse", label: "Steakhouse", icon: Beef },
  { id: "fusion", label: "Fusion", icon: Sparkles },
  { id: "healthy", label: "Healthy", icon: Salad },
  { id: "noodles-soup", label: "Noodles & Soup", icon: Soup },
  { id: "family-meal", label: "Family Meal", icon: Users },
];

// ─── Occasion & Vibe ─────────────────────────────────────
export const OCCASIONS = [
  { id: "date-night", label: "Date Night", icon: Heart },
  {
    id: "business-dinner",
    label: "Business Dinner",
    icon: Briefcase,
  },
  { id: "celebration", label: "Celebration", icon: Cake },
  {
    id: "casual-dining",
    label: "Casual Dining",
    icon: UtensilsCrossed,
  },
  { id: "romantic", label: "Romantic", icon: Heart },
  {
    id: "family-friendly",
    label: "Family-friendly",
    icon: Baby,
  },
  { id: "late-night", label: "Late Night", icon: Moon },
  { id: "quick-bite", label: "Quick Bite", icon: Zap },
];

// ─── Seating Preference ──────────────────────────────────
export const SEATING_PREFERENCES = [
  { id: "dining-hall", label: "Dining Hall", icon: Home },
  {
    id: "private-room",
    label: "Private Room",
    icon: DoorClosed,
  },
  { id: "terrace", label: "Terrace", icon: TreePine },
  { id: "window-seat", label: "Window Seat", icon: PanelTop },
  { id: "bar", label: "Bar", icon: GlassWater },
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
export const PRO_FEATURES = [
  "Up to 20 staff members",
  "Advanced analytics & reports",
  "Multi-floor plan support",
  "Priority email support",
  "Custom receipt branding",
  "Table reservation system",
];
export const ULTRA_FEATURES = [
  "Everything in Pro",
  "Unlimited staff members",
  "Multi-location support",
  "24/7 priority support",
  "API access & integrations",
  "Custom domain & branding",
  "Advanced inventory tracking",
  "Dedicated account manager",
];

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