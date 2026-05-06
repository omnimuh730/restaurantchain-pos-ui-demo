// Top-level menu categories (Asian restaurant style)
export const MAIN_CATEGORIES = [
  { id: "hot-foods", label: "Hot Foods" },
  { id: "cold-foods", label: "Cold Foods" },
  { id: "main-meal", label: "Main Meal" },
  { id: "drinks", label: "Drinks" },
];

// Sub-categories for each main category
export const SUB_CATEGORIES: Record<string, Array<{ id: string; label: string }>> = {
  "hot-foods": [
    { id: "dumplings", label: "Dumplings" },
    { id: "spring-rolls", label: "Spring Rolls" },
    { id: "bao-buns", label: "Bao Buns" },
    { id: "hot-soups", label: "Hot Soups" },
    { id: "hot-appetizers", label: "Hot Appetizers" },
  ],
  "cold-foods": [
    { id: "sushi-sashimi", label: "Sushi & Sashimi" },
    { id: "cold-appetizers", label: "Cold Appetizers" },
    { id: "salads", label: "Salads" },
    { id: "cold-noodles", label: "Cold Noodles" },
  ],
  "main-meal": [
    { id: "rice-dishes", label: "Rice Dishes" },
    { id: "noodle-dishes", label: "Noodle Dishes" },
    { id: "stir-fry", label: "Stir Fry" },
    { id: "curry", label: "Curry" },
    { id: "grilled-bbq", label: "Grilled & BBQ" },
  ],
  drinks: [
    { id: "tea", label: "Tea" },
    { id: "soft-drinks", label: "Soft Drinks" },
    { id: "juice", label: "Juice" },
    { id: "beer", label: "Beer" },
    { id: "wine", label: "Wine" },
    { id: "sake-soju", label: "Sake & Soju" },
    { id: "cocktails", label: "Cocktails" },
  ],
};

export type ItemCurrency = "foreign" | "domestic";

// Menu items by sub-category. Each item has its OWN native currency — prices are
// NOT converted. A domestic item at ₩5,000 and a foreign item at $5 live side by
// side; an order sums them into two independent totals.
export const MENU_ITEMS: Record<string, Array<{ id: string; name: string; price: number; currency?: ItemCurrency }>> = {
  // Hot Foods
  dumplings: [
    { id: "pork-dumplings", name: "Pork Dumplings", price: 8.00 },
    { id: "shrimp-dumplings", name: "Shrimp Dumplings", price: 9.00 },
    { id: "vegetable-dumplings", name: "Vegetable Dumplings", price: 7.00 },
    { id: "chicken-dumplings", name: "Chicken Dumplings", price: 8.00 },
    { id: "soup-dumplings", name: "Soup Dumplings", price: 10.00 },
  ],
  "spring-rolls": [
    { id: "veggie-spring-roll", name: "Vegetable Spring Rolls", price: 6.00 },
    { id: "pork-spring-roll", name: "Pork Spring Rolls", price: 7.00 },
    { id: "shrimp-spring-roll", name: "Shrimp Spring Rolls", price: 8.00 },
    { id: "crispy-rolls", name: "Crispy Egg Rolls", price: 7.00 },
  ],
  "bao-buns": [
    { id: "pork-belly-bao", name: "Pork Belly Bao", price: 9000, currency: "domestic" },
    { id: "chicken-bao", name: "Chicken Bao", price: 8000, currency: "domestic" },
    { id: "veggie-bao", name: "Vegetable Bao", price: 7000, currency: "domestic" },
    { id: "duck-bao", name: "Duck Bao", price: 10000, currency: "domestic" },
  ],
  "hot-soups": [
    { id: "miso-soup", name: "Miso Soup", price: 5000, currency: "domestic" },
    { id: "hot-sour-soup", name: "Hot & Sour Soup", price: 6.00 },
    { id: "wonton-soup", name: "Wonton Soup", price: 7.00 },
    { id: "ramen", name: "Ramen", price: 12000, currency: "domestic" },
    { id: "pho", name: "Pho", price: 13.00 },
  ],
  "hot-appetizers": [
    { id: "edamame", name: "Edamame", price: 5.00 },
    { id: "gyoza", name: "Gyoza", price: 8000, currency: "domestic" },
    { id: "takoyaki", name: "Takoyaki", price: 9000, currency: "domestic" },
    { id: "tempura", name: "Tempura", price: 10.00 },
  ],
  // Cold Foods
  "sushi-sashimi": [
    { id: "salmon-sushi", name: "Salmon Sushi", price: 8.00 },
    { id: "tuna-sushi", name: "Tuna Sushi", price: 9.00 },
    { id: "california-roll", name: "California Roll", price: 10.00 },
    { id: "spicy-tuna-roll", name: "Spicy Tuna Roll", price: 11.00 },
    { id: "sashimi-platter", name: "Sashimi Platter", price: 20.00 },
  ],
  "cold-appetizers": [
    { id: "seaweed-salad", name: "Seaweed Salad", price: 6.00 },
    { id: "kimchi", name: "Kimchi", price: 5000, currency: "domestic" },
    { id: "pickled-vegetables", name: "Pickled Vegetables", price: 5000, currency: "domestic" },
  ],
  salads: [
    { id: "asian-chicken-salad", name: "Asian Chicken Salad", price: 10.00 },
    { id: "cucumber-salad", name: "Cucumber Salad", price: 6.00 },
    { id: "papaya-salad", name: "Papaya Salad", price: 8.00 },
  ],
  "cold-noodles": [
    { id: "soba-noodles", name: "Cold Soba Noodles", price: 9.00 },
    { id: "sesame-noodles", name: "Sesame Noodles", price: 8.00 },
  ],
  // Main Meal
  "rice-dishes": [
    { id: "fried-rice", name: "Fried Rice", price: 12.00 },
    { id: "bibimbap", name: "Bibimbap", price: 14000, currency: "domestic" },
    { id: "curry-rice", name: "Curry Rice", price: 13.00 },
    { id: "donburi", name: "Chicken Donburi", price: 14000, currency: "domestic" },
  ],
  "noodle-dishes": [
    { id: "pad-thai", name: "Pad Thai", price: 13.00 },
    { id: "chow-mein", name: "Chow Mein", price: 12.00 },
    { id: "lo-mein", name: "Lo Mein", price: 12.00 },
    { id: "udon", name: "Udon Noodles", price: 13000, currency: "domestic" },
    { id: "dan-dan-noodles", name: "Dan Dan Noodles", price: 11.00 },
  ],
  "stir-fry": [
    { id: "kung-pao-chicken", name: "Kung Pao Chicken", price: 15.00 },
    { id: "mongolian-beef", name: "Mongolian Beef", price: 16.00 },
    { id: "cashew-chicken", name: "Cashew Chicken", price: 15.00 },
    { id: "mixed-vegetables", name: "Mixed Vegetables", price: 12.00 },
  ],
  curry: [
    { id: "thai-green-curry", name: "Thai Green Curry", price: 14.00 },
    { id: "thai-red-curry", name: "Thai Red Curry", price: 14.00 },
    { id: "japanese-curry", name: "Japanese Curry", price: 13.00 },
    { id: "massaman-curry", name: "Massaman Curry", price: 15.00 },
  ],
  "grilled-bbq": [
    { id: "teriyaki-chicken", name: "Teriyaki Chicken", price: 16000, currency: "domestic" },
    { id: "bulgogi", name: "Bulgogi", price: 18000, currency: "domestic" },
    { id: "grilled-salmon", name: "Grilled Salmon", price: 20.00 },
    { id: "yakitori", name: "Yakitori", price: 12000, currency: "domestic" },
  ],
  // Drinks
  tea: [
    { id: "green-tea", name: "Green Tea", price: 3000, currency: "domestic" },
    { id: "jasmine-tea", name: "Jasmine Tea", price: 3000, currency: "domestic" },
    { id: "oolong-tea", name: "Oolong Tea", price: 3500, currency: "domestic" },
    { id: "bubble-tea", name: "Bubble Tea", price: 5000, currency: "domestic" },
    { id: "thai-tea", name: "Thai Tea", price: 4.50 },
  ],
  "soft-drinks": [
    { id: "coke", name: "Coca-Cola", price: 3.00 },
    { id: "sprite", name: "Sprite", price: 3.00 },
    { id: "ginger-ale", name: "Ginger Ale", price: 3.00 },
  ],
  juice: [
    { id: "lychee-juice", name: "Lychee Juice", price: 4.00 },
    { id: "mango-juice", name: "Mango Juice", price: 4.00 },
    { id: "coconut-water", name: "Coconut Water", price: 4.50 },
  ],
  beer: [
    { id: "asahi", name: "Asahi", price: 7.00 },
    { id: "sapporo", name: "Sapporo", price: 7.00 },
    { id: "singha", name: "Singha", price: 6.00 },
    { id: "tsingtao", name: "Tsingtao", price: 6.00 },
  ],
  wine: [
    { id: "plum-wine", name: "Plum Wine", price: 8.00 },
    { id: "red-wine", name: "Red Wine", price: 9.00 },
    { id: "white-wine", name: "White Wine", price: 9.00 },
  ],
  "sake-soju": [
    { id: "sake-hot", name: "Hot Sake", price: 8000, currency: "domestic" },
    { id: "sake-cold", name: "Cold Sake", price: 8000, currency: "domestic" },
    { id: "soju", name: "Soju", price: 7000, currency: "domestic" },
    { id: "makgeolli", name: "Makgeolli", price: 9000, currency: "domestic" },
  ],
  cocktails: [
    { id: "lychee-martini", name: "Lychee Martini", price: 12.00 },
    { id: "sake-bomb", name: "Sake Bomb", price: 10.00 },
    { id: "mai-tai", name: "Mai Tai", price: 11.00 },
    { id: "singapore-sling", name: "Singapore Sling", price: 12.00 },
  ],
  appetizers: [
    { id: "wings", name: "Chicken Wings", price: 12.00 },
    { id: "calamari", name: "Fried Calamari", price: 14.00 },
    { id: "nachos", name: "Nachos", price: 10.00 },
    { id: "mozzarella-sticks", name: "Mozzarella Sticks", price: 9.00 },
    { id: "bruschetta", name: "Bruschetta", price: 11.00 },
    { id: "spinach-dip", name: "Spinach Artichoke Dip", price: 13.00 },
    { id: "sliders", name: "Beef Sliders", price: 15.00 },
    { id: "shrimp-cocktail", name: "Shrimp Cocktail", price: 16.00 },
  ],
  "soups-salads": [
    { id: "caesar-salad", name: "Caesar Salad", price: 14.00 },
    { id: "garden-salad", name: "Garden Salad", price: 12.00 },
    { id: "greek-salad", name: "Greek Salad", price: 13.00 },
    { id: "cobb-salad", name: "Cobb Salad", price: 15.00 },
    { id: "soup-day", name: "Soup of the Day", price: 8.00 },
    { id: "french-onion", name: "French Onion Soup", price: 9.00 },
    { id: "tomato-soup", name: "Tomato Basil Soup", price: 8.00 },
    { id: "clam-chowder", name: "Clam Chowder", price: 10.00 },
  ],
  entrees: [
    { id: "ribeye", name: "Ribeye Steak", price: 45.00 },
    { id: "salmon", name: "Grilled Salmon", price: 32.00 },
    { id: "lamb-chops", name: "Lamb Chops", price: 38.00 },
    { id: "filet-mignon", name: "Filet Mignon", price: 55.00 },
    { id: "chicken-parmesan", name: "Chicken Parmesan", price: 24.00 },
    { id: "fish-chips", name: "Fish & Chips", price: 22.00 },
    { id: "pasta-alfredo", name: "Fettuccine Alfredo", price: 20.00 },
    { id: "lobster-tail", name: "Lobster Tail", price: 58.00 },
    { id: "pork-chop", name: "Pork Chop", price: 28.00 },
    { id: "vegetarian-pasta", name: "Vegetarian Pasta", price: 19.00 },
  ],
  sides: [
    { id: "fries", name: "French Fries", price: 5.00 },
    { id: "truffle-fries", name: "Truffle Fries", price: 8.00 },
    { id: "mashed-potatoes", name: "Mashed Potatoes", price: 6.00 },
    { id: "steamed-veg", name: "Steamed Vegetables", price: 7.00 },
    { id: "mac-cheese", name: "Mac & Cheese", price: 8.00 },
    { id: "asparagus", name: "Grilled Asparagus", price: 9.00 },
    { id: "rice-pilaf", name: "Rice Pilaf", price: 6.00 },
    { id: "coleslaw", name: "Coleslaw", price: 5.00 },
  ],
  desserts: [
    { id: "cheesecake", name: "New York Cheesecake", price: 9.00 },
    { id: "chocolate-cake", name: "Chocolate Lava Cake", price: 10.00 },
    { id: "tiramisu", name: "Tiramisu", price: 9.00 },
    { id: "creme-brulee", name: "Cr\u00e8me Br\u00fbl\u00e9e", price: 10.00 },
    { id: "ice-cream", name: "Ice Cream", price: 6.00 },
    { id: "apple-pie", name: "Apple Pie", price: 8.00 },
  ],
};

// Floors for table grouping
export const FLOORS = [
  { id: "1F", label: "1st Floor" },
  { id: "2F", label: "2nd Floor" },
  { id: "bar", label: "Bar" },
];

// Table list for dropdown
export const TABLES = [
  { id: "T1", label: "Table 1", seats: 2, floor: "1F" },
  { id: "T2", label: "Table 2", seats: 4, floor: "1F" },
  { id: "T3", label: "Table 3", seats: 4, floor: "1F" },
  { id: "T4", label: "Table 4", seats: 6, floor: "1F" },
  { id: "T5", label: "Table 5", seats: 2, floor: "1F" },
  { id: "T6", label: "Table 6", seats: 8, floor: "2F" },
  { id: "T7", label: "Table 7", seats: 4, floor: "2F" },
  { id: "T8", label: "Table 8", seats: 6, floor: "2F" },
  { id: "T9", label: "Table 9", seats: 2, floor: "2F" },
  { id: "T10", label: "Table 10", seats: 4, floor: "2F" },
  { id: "T11", label: "Table 11", seats: 6, floor: "2F" },
  { id: "T12", label: "Table 12", seats: 8, floor: "2F" },
  { id: "BAR1", label: "Bar 1", seats: 1, floor: "bar" },
  { id: "BAR2", label: "Bar 2", seats: 1, floor: "bar" },
  { id: "BAR3", label: "Bar 3", seats: 1, floor: "bar" },
];

export interface OrderItem {
  id: string;
  baseId: string;
  /** @deprecated Resolved via i18n `orders:items.${baseId}` */
  name?: string;
  price: number;
  qty: number;
  category: string;
  modifiers?: string[];
  ordered?: boolean;
  deleted?: boolean;
  origQty?: number;
  currency: ItemCurrency;
}

export const INITIAL_TABLE_ORDERS: Record<string, OrderItem[]> = {
  T12: [
    { id: "lychee-martini", baseId: "lychee-martini", price: 12.0, qty: 2, category: "COCKTAILS", ordered: true, currency: "foreign" },
    { id: "wings", baseId: "wings", price: 12.0, qty: 1, category: "APPETIZERS", ordered: true, currency: "foreign" },
    {
      id: "grilled-salmon",
      baseId: "grilled-salmon",
      price: 20.0,
      qty: 1,
      category: "GRILLED BBQ",
      modifiers: ["no_garlic", "side_asparagus"],
      ordered: true,
      currency: "foreign",
    },
    {
      id: "bulgogi",
      baseId: "bulgogi",
      price: 18000,
      qty: 1,
      category: "GRILLED BBQ",
      modifiers: ["medium_rare"],
      ordered: true,
      currency: "domestic",
    },
  ],
};