// Top-level menu categories (Asian restaurant style)
export const MAIN_CATEGORIES = [
  { id: "hot-foods" },
  { id: "cold-foods" },
  { id: "main-meal" },
  { id: "drinks" },
];

// Sub-categories for each main category
export const SUB_CATEGORIES: Record<string, Array<{ id: string }>> = {
  "hot-foods": [
    { id: "dumplings" },
    { id: "spring-rolls" },
    { id: "bao-buns" },
    { id: "hot-soups" },
    { id: "hot-appetizers" },
  ],
  "cold-foods": [
    { id: "sushi-sashimi" },
    { id: "cold-appetizers" },
    { id: "salads" },
    { id: "cold-noodles" },
  ],
  "main-meal": [
    { id: "rice-dishes" },
    { id: "noodle-dishes" },
    { id: "stir-fry" },
    { id: "curry" },
    { id: "grilled-bbq" },
  ],
  drinks: [
    { id: "tea" },
    { id: "soft-drinks" },
    { id: "juice" },
    { id: "beer" },
    { id: "wine" },
    { id: "sake-soju" },
    { id: "cocktails" },
  ],
};

export type ItemCurrency = "foreign" | "domestic";

// Menu items by sub-category. Display names come from i18n `menuItems.<id>`.
export const MENU_ITEMS: Record<string, Array<{ id: string; price: number; currency?: ItemCurrency }>> = {
  dumplings: [
    { id: "pork-dumplings", price: 8.0 },
    { id: "shrimp-dumplings", price: 9.0 },
    { id: "vegetable-dumplings", price: 7.0 },
    { id: "chicken-dumplings", price: 8.0 },
    { id: "soup-dumplings", price: 10.0 },
  ],
  "spring-rolls": [
    { id: "veggie-spring-roll", price: 6.0 },
    { id: "pork-spring-roll", price: 7.0 },
    { id: "shrimp-spring-roll", price: 8.0 },
    { id: "crispy-rolls", price: 7.0 },
  ],
  "bao-buns": [
    { id: "pork-belly-bao", price: 9000, currency: "domestic" },
    { id: "chicken-bao", price: 8000, currency: "domestic" },
    { id: "veggie-bao", price: 7000, currency: "domestic" },
    { id: "duck-bao", price: 10000, currency: "domestic" },
  ],
  "hot-soups": [
    { id: "miso-soup", price: 5000, currency: "domestic" },
    { id: "hot-sour-soup", price: 6.0 },
    { id: "wonton-soup", price: 7.0 },
    { id: "ramen", price: 12000, currency: "domestic" },
    { id: "pho", price: 13.0 },
  ],
  "hot-appetizers": [
    { id: "edamame", price: 5.0 },
    { id: "gyoza", price: 8000, currency: "domestic" },
    { id: "takoyaki", price: 9000, currency: "domestic" },
    { id: "tempura", price: 10.0 },
  ],
  "sushi-sashimi": [
    { id: "salmon-sushi", price: 8.0 },
    { id: "tuna-sushi", price: 9.0 },
    { id: "california-roll", price: 10.0 },
    { id: "spicy-tuna-roll", price: 11.0 },
    { id: "sashimi-platter", price: 20.0 },
  ],
  "cold-appetizers": [
    { id: "seaweed-salad", price: 6.0 },
    { id: "kimchi", price: 5000, currency: "domestic" },
    { id: "pickled-vegetables", price: 5000, currency: "domestic" },
  ],
  salads: [
    { id: "asian-chicken-salad", price: 10.0 },
    { id: "cucumber-salad", price: 6.0 },
    { id: "papaya-salad", price: 8.0 },
  ],
  "cold-noodles": [
    { id: "soba-noodles", price: 9.0 },
    { id: "sesame-noodles", price: 8.0 },
  ],
  "rice-dishes": [
    { id: "fried-rice", price: 12.0 },
    { id: "bibimbap", price: 14000, currency: "domestic" },
    { id: "curry-rice", price: 13.0 },
    { id: "donburi", price: 14000, currency: "domestic" },
  ],
  "noodle-dishes": [
    { id: "pad-thai", price: 13.0 },
    { id: "chow-mein", price: 12.0 },
    { id: "lo-mein", price: 12.0 },
    { id: "udon", price: 13000, currency: "domestic" },
    { id: "dan-dan-noodles", price: 11.0 },
  ],
  "stir-fry": [
    { id: "kung-pao-chicken", price: 15.0 },
    { id: "mongolian-beef", price: 16.0 },
    { id: "cashew-chicken", price: 15.0 },
    { id: "mixed-vegetables", price: 12.0 },
  ],
  curry: [
    { id: "thai-green-curry", price: 14.0 },
    { id: "thai-red-curry", price: 14.0 },
    { id: "japanese-curry", price: 13.0 },
    { id: "massaman-curry", price: 15.0 },
  ],
  "grilled-bbq": [
    { id: "teriyaki-chicken", price: 16000, currency: "domestic" },
    { id: "bulgogi", price: 18000, currency: "domestic" },
    { id: "grilled-salmon", price: 20.0 },
    { id: "yakitori", price: 12000, currency: "domestic" },
  ],
  tea: [
    { id: "green-tea", price: 3000, currency: "domestic" },
    { id: "jasmine-tea", price: 3000, currency: "domestic" },
    { id: "oolong-tea", price: 3500, currency: "domestic" },
    { id: "bubble-tea", price: 5000, currency: "domestic" },
    { id: "thai-tea", price: 4.5 },
  ],
  "soft-drinks": [
    { id: "coke", price: 3.0 },
    { id: "sprite", price: 3.0 },
    { id: "ginger-ale", price: 3.0 },
  ],
  juice: [
    { id: "lychee-juice", price: 4.0 },
    { id: "mango-juice", price: 4.0 },
    { id: "coconut-water", price: 4.5 },
  ],
  beer: [
    { id: "asahi", price: 7.0 },
    { id: "sapporo", price: 7.0 },
    { id: "singha", price: 6.0 },
    { id: "tsingtao", price: 6.0 },
  ],
  wine: [
    { id: "plum-wine", price: 8.0 },
    { id: "red-wine", price: 9.0 },
    { id: "white-wine", price: 9.0 },
  ],
  "sake-soju": [
    { id: "sake-hot", price: 8000, currency: "domestic" },
    { id: "sake-cold", price: 8000, currency: "domestic" },
    { id: "soju", price: 7000, currency: "domestic" },
    { id: "makgeolli", price: 9000, currency: "domestic" },
  ],
  cocktails: [
    { id: "lychee-martini", price: 12.0 },
    { id: "sake-bomb", price: 10.0 },
    { id: "mai-tai", price: 11.0 },
    { id: "singapore-sling", price: 12.0 },
  ],
  appetizers: [
    { id: "wings", price: 12.0 },
    { id: "calamari", price: 14.0 },
    { id: "nachos", price: 10.0 },
    { id: "mozzarella-sticks", price: 9.0 },
    { id: "bruschetta", price: 11.0 },
    { id: "spinach-dip", price: 13.0 },
    { id: "sliders", price: 15.0 },
    { id: "shrimp-cocktail", price: 16.0 },
  ],
  "soups-salads": [
    { id: "caesar-salad", price: 14.0 },
    { id: "garden-salad", price: 12.0 },
    { id: "greek-salad", price: 13.0 },
    { id: "cobb-salad", price: 15.0 },
    { id: "soup-day", price: 8.0 },
    { id: "french-onion", price: 9.0 },
    { id: "tomato-soup", price: 8.0 },
    { id: "clam-chowder", price: 10.0 },
  ],
  entrees: [
    { id: "ribeye", price: 45.0 },
    { id: "salmon", price: 32.0 },
    { id: "lamb-chops", price: 38.0 },
    { id: "filet-mignon", price: 55.0 },
    { id: "chicken-parmesan", price: 24.0 },
    { id: "fish-chips", price: 22.0 },
    { id: "pasta-alfredo", price: 20.0 },
    { id: "lobster-tail", price: 58.0 },
    { id: "pork-chop", price: 28.0 },
    { id: "vegetarian-pasta", price: 19.0 },
  ],
  sides: [
    { id: "fries", price: 5.0 },
    { id: "truffle-fries", price: 8.0 },
    { id: "mashed-potatoes", price: 6.0 },
    { id: "steamed-veg", price: 7.0 },
    { id: "mac-cheese", price: 8.0 },
    { id: "asparagus", price: 9.0 },
    { id: "rice-pilaf", price: 6.0 },
    { id: "coleslaw", price: 5.0 },
  ],
  desserts: [
    { id: "cheesecake", price: 9.0 },
    { id: "chocolate-cake", price: 10.0 },
    { id: "tiramisu", price: 9.0 },
    { id: "creme-brulee", price: 10.0 },
    { id: "ice-cream", price: 6.0 },
    { id: "apple-pie", price: 8.0 },
  ],
};

// Floors for table grouping (labels: i18n `floors.<id>`)
export const FLOORS = [{ id: "1F" }, { id: "2F" }, { id: "bar" }];

// Table list for dropdown (labels: i18n `tables.<id>`)
export const TABLES = [
  { id: "T1", seats: 2, floor: "1F" },
  { id: "T2", seats: 4, floor: "1F" },
  { id: "T3", seats: 4, floor: "1F" },
  { id: "T4", seats: 6, floor: "1F" },
  { id: "T5", seats: 2, floor: "1F" },
  { id: "T6", seats: 8, floor: "2F" },
  { id: "T7", seats: 4, floor: "2F" },
  { id: "T8", seats: 6, floor: "2F" },
  { id: "T9", seats: 2, floor: "2F" },
  { id: "T10", seats: 4, floor: "2F" },
  { id: "T11", seats: 6, floor: "2F" },
  { id: "T12", seats: 8, floor: "2F" },
  { id: "BAR1", seats: 1, floor: "bar" },
  { id: "BAR2", seats: 1, floor: "bar" },
  { id: "BAR3", seats: 1, floor: "bar" },
];

export interface OrderItem {
  id: string;
  baseId: string;
  price: number;
  qty: number;
  /** Sub-category id (e.g. cocktails, grilled-bbq) */
  category: string;
  modifiers?: string[];
  ordered?: boolean;
  deleted?: boolean;
  origQty?: number;
  currency: ItemCurrency;
}

export const INITIAL_TABLE_ORDERS: Record<string, OrderItem[]> = {
  T12: [
    {
      id: "lychee-martini",
      baseId: "lychee-martini",
      price: 12.0,
      qty: 2,
      category: "cocktails",
      ordered: true,
      currency: "foreign",
    },
    {
      id: "wings",
      baseId: "wings",
      price: 12.0,
      qty: 1,
      category: "appetizers",
      ordered: true,
      currency: "foreign",
    },
    {
      id: "grilled-salmon",
      baseId: "grilled-salmon",
      price: 20.0,
      qty: 1,
      category: "grilled-bbq",
      modifiers: ["no-garlic", "side-asparagus"],
      ordered: true,
      currency: "foreign",
    },
    {
      id: "bulgogi",
      baseId: "bulgogi",
      price: 18000,
      qty: 1,
      category: "grilled-bbq",
      modifiers: ["medium-rare"],
      ordered: true,
      currency: "domestic",
    },
  ],
};
