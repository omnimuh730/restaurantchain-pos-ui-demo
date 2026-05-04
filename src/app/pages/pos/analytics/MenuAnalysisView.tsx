import { useState, useMemo } from "react";
import { PieChart, Pie, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Rectangle } from "recharts";
import { useThemeClasses } from "../theme-context";
import { DateFilterBar, type Period } from "./DateFilterBar";
import { AnimatedContent } from "./AnimatedContent";
import { useAnalyticsCurrency } from "./currency";

type Cur = "foreign" | "domestic";

const CATEGORY_MULTIPLIER: Record<string, number> = {
  today: 0.14, week: 1, month: 4.2, "3month": 12.8, custom: 1,
};

// Every menu item is sold in EXACTLY ONE currency. No conversions.
// Prices and quantities for each pool are independent, uncorrelated numbers.
interface BaseItem {
  name: string;
  category: string;
  currency: Cur;
  baseQty: number;   // weekly base units sold
  basePrice: number; // native-currency unit price
  weeklyBest?: number[]; // Mon..Sun units — only peak seller per currency fills this
}

const BASE_ITEMS: BaseItem[] = [
  // Foreign ($) items
  { name: "Ribeye Steak",    category: "Grilled & BBQ", currency: "foreign", baseQty: 102, basePrice: 45,
    weeklyBest: [14, 17, 13, 15, 22, 28, 19] },
  { name: "Grilled Salmon",  category: "Grilled & BBQ", currency: "foreign", baseQty: 128, basePrice: 20 },
  { name: "Lobster Tail",    category: "Entrees",       currency: "foreign", baseQty: 58,  basePrice: 58 },
  { name: "Caesar Salad",    category: "Salads",        currency: "foreign", baseQty: 158, basePrice: 14 },
  { name: "Truffle Fries",   category: "Sides",         currency: "foreign", baseQty: 182, basePrice: 8 },
  { name: "Lychee Martini",  category: "Cocktails",     currency: "foreign", baseQty: 94,  basePrice: 12 },
  { name: "Chicken Wings",   category: "Appetizers",    currency: "foreign", baseQty: 146, basePrice: 12 },
  { name: "Tiramisu",        category: "Desserts",      currency: "foreign", baseQty: 74,  basePrice: 9 },
  { name: "Fish & Chips",    category: "Entrees",       currency: "foreign", baseQty: 88,  basePrice: 22 },
  { name: "Mai Tai",         category: "Cocktails",     currency: "foreign", baseQty: 63,  basePrice: 11 },

  // Domestic (₩) items
  { name: "Bibimbap",        category: "Rice Dishes",   currency: "domestic", baseQty: 212, basePrice: 14000,
    weeklyBest: [24, 28, 31, 26, 36, 42, 33] },
  { name: "Bulgogi",         category: "Grilled & BBQ", currency: "domestic", baseQty: 165, basePrice: 18000 },
  { name: "Soju",            category: "Sake & Soju",   currency: "domestic", baseQty: 288, basePrice: 7000 },
  { name: "Makgeolli",       category: "Sake & Soju",   currency: "domestic", baseQty: 142, basePrice: 9000 },
  { name: "Kimchi",          category: "Cold Dishes",   currency: "domestic", baseQty: 196, basePrice: 5000 },
  { name: "Ramen",           category: "Hot Soups",     currency: "domestic", baseQty: 176, basePrice: 12000 },
  { name: "Udon Noodles",    category: "Noodles",       currency: "domestic", baseQty: 134, basePrice: 13000 },
  { name: "Gyoza",           category: "Hot Appetizers",currency: "domestic", baseQty: 158, basePrice: 8000 },
  { name: "Green Tea",       category: "Tea",           currency: "domestic", baseQty: 224, basePrice: 3000 },
  { name: "Hot Sake",        category: "Sake & Soju",   currency: "domestic", baseQty: 96,  basePrice: 8000 },
];

const CATEGORY_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6", "#ec4899"];

export function MenuAnalysisView() {
  const [period, setPeriod] = useState<Period>("week");
  const [sortBy, setSortBy] = useState<"revenue" | "volume">("revenue");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const tc = useThemeClasses();
  const { isDomestic, symbol } = useAnalyticsCurrency();
  const themedTooltip = tc.tooltipStyle;

  const activeCur: Cur = isDomestic ? "domestic" : "foreign";
  const mult = CATEGORY_MULTIPLIER[period];

  const fmtMoney = (v: number) =>
    activeCur === "domestic" ? `₩${Math.round(v).toLocaleString()}` : `$${v.toFixed(2)}`;

  // Only items in the active currency exist in this view — uncorrelated with the other pool.
  const poolItems = useMemo(() =>
    BASE_ITEMS.filter((i) => i.currency === activeCur).map((i) => ({
      name: i.name,
      category: i.category,
      qty: Math.round(i.baseQty * mult),
      revenue: Math.round(i.basePrice * i.baseQty * mult),
      weeklyBest: i.weeklyBest,
    })), [activeCur, mult]);

  const categoryData = useMemo(() => {
    const byCat = new Map<string, { name: string; revenue: number; orders: number }>();
    for (const it of poolItems) {
      const e = byCat.get(it.category) ?? { name: it.category, revenue: 0, orders: 0 };
      e.revenue += it.revenue;
      e.orders += it.qty;
      byCat.set(it.category, e);
    }
    const totalRev = [...byCat.values()].reduce((s, c) => s + c.revenue, 0) || 1;
    return [...byCat.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .map((c, i) => ({
        ...c,
        value: Number(((c.revenue / totalRev) * 100).toFixed(1)),
        fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }));
  }, [poolItems]);

  const topCat = categoryData[0] ?? { name: "—", revenue: 0 };

  const filteredItems = useMemo(() => {
    const list = selectedCategory ? poolItems.filter((i) => i.category === selectedCategory) : poolItems;
    return [...list].sort((a, b) =>
      sortBy === "revenue" ? b.revenue - a.revenue : b.qty - a.qty
    );
  }, [poolItems, selectedCategory, sortBy]);

  const bestSeller = useMemo(() => {
    const withTrend = poolItems.find((i) => i.weeklyBest);
    return withTrend ?? poolItems[0];
  }, [poolItems]);

  const bestSellerData = useMemo(() => {
    if (!bestSeller?.weeklyBest) return [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const scaled = bestSeller.weeklyBest.map((n) => Math.round(n * mult));
    const peak = Math.max(...scaled);
    return days.map((day, i) => ({
      day,
      qty: scaled[i],
      fill: scaled[i] === peak ? "#3b82f6" : tc.isDark ? "#374151" : "#cbd5e1",
    }));
  }, [bestSeller, mult, tc.isDark]);

  if (poolItems.length === 0) {
    return (
      <div className="space-y-4">
        <DateFilterBar period={period} setPeriod={setPeriod} title="Menu Analysis" />
        <div className={`${tc.card} rounded-xl p-10 text-center ${tc.muted} text-[0.875rem]`}>
          No {activeCur === "domestic" ? "domestic (₩)" : "foreign ($)"} menu items sold in this period.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DateFilterBar period={period} setPeriod={setPeriod} title="Menu Analysis" />

      <AnimatedContent animationKey={`${period}-${activeCur}`} className="space-y-4">

      {/* Category Donut */}
      <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
        <p className={`text-[1rem] ${tc.heading} mb-1`}>
          The <span className="text-blue-500">{topCat.name}</span> category is loved the most in {symbol}!
        </p>
        <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>
          {activeCur === "domestic" ? "Domestic (₩)" : "Foreign ($)"} category breakdown — independent pool
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <PieChart width={200} height={200}>
            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={88} dataKey="value" nameKey="name" paddingAngle={3} strokeWidth={0} />
          </PieChart>

          <div className="flex-1 w-full space-y-3">
            {categoryData.map((d) => (
              <button
                key={d.name}
                onClick={() => setSelectedCategory(selectedCategory === d.name ? null : d.name)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-left ${
                  selectedCategory === d.name
                    ? tc.isDark ? "bg-slate-700" : "bg-blue-50"
                    : tc.hover
                }`}
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.fill }} />
                <span className={`text-[0.9375rem] ${tc.text2} min-w-[100px] truncate`}>{d.name}</span>
                <span className={`text-[0.875rem] ${tc.subtext}`}>{d.value}%</span>
                <span className={`text-[0.9375rem] ${tc.heading} ml-auto tabular-nums`}>{fmtMoney(d.revenue)}</span>
                <span className={`text-[0.8125rem] ${tc.subtext} tabular-nums`}>{d.orders.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-[1rem] ${tc.heading}`}>
              {selectedCategory ? `${selectedCategory} Items` : `All ${activeCur === "domestic" ? "Domestic" : "Foreign"} Items`}
            </h3>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-[0.8125rem] text-blue-500 cursor-pointer mt-0.5"
              >
                Show all categories
              </button>
            )}
          </div>
          <div className={`flex items-center gap-0.5 rounded-lg p-0.5 ${tc.isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            {(["revenue", "volume"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-2.5 py-1 rounded-md text-[0.8125rem] capitalize cursor-pointer transition-colors ${
                  sortBy === s ? "bg-blue-600 text-white" : tc.subtext
                }`}
              >
                {s === "revenue" ? "Revenue" : "Volume"}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-3 py-2 text-[0.8125rem] ${tc.subtext} border-b ${tc.border}`}>
          <span>Item</span>
          <span className="w-24 text-right">Category</span>
          <span className="w-14 text-right">Sold</span>
          <span className="w-24 text-right">Revenue</span>
        </div>

        <div className="space-y-0.5 mt-1">
          {filteredItems.map((item, i) => (
            <div
              key={item.name}
              className={`grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center px-3 py-2.5 rounded-lg ${
                i === 0 ? (tc.isDark ? "bg-blue-600/10" : "bg-blue-50") : ""
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[0.8125rem] shrink-0 ${
                  i === 0 ? "bg-blue-600 text-white" : "bg-blue-600/15 text-blue-500"
                }`}>
                  {i + 1}
                </span>
                <span className={`text-[0.9375rem] ${tc.text2} truncate`}>{item.name}</span>
              </div>
              <span className={`w-24 text-right text-[0.8125rem] ${tc.subtext} truncate`}>{item.category}</span>
              <span className={`w-14 text-right text-[0.9375rem] ${tc.text2} tabular-nums`}>{item.qty}</span>
              <span className={`w-24 text-right text-[0.9375rem] ${tc.heading} tabular-nums`}>{fmtMoney(item.revenue)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best Seller Trend */}
      {bestSeller?.weeklyBest && (
        <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
          <h3 className={`text-[1rem] ${tc.heading} mb-1`}>
            <span className="text-blue-500">{bestSeller.name}</span> — Weekly Sales Trend
          </h3>
          <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>
            Top {activeCur === "domestic" ? "₩" : "$"} seller across the week
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bestSellerData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} vertical={false} />
              <XAxis key="xaxis" dataKey="day" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={themedTooltip} />
              <Bar key="bar" dataKey="qty" radius={[6, 6, 0, 0]}
                shape={(props: any) => <Rectangle {...props} fill={props.fill} radius={[6, 6, 0, 0]} />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      </AnimatedContent>
    </div>
  );
}
