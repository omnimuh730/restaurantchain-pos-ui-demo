import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Rectangle,
} from "recharts";
import { Trans, useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { DateFilterBar, type Period } from "./DateFilterBar";
import { AnimatedContent } from "./AnimatedContent";
import { useAnalyticsCurrency } from "./currency";

type Cur = "foreign" | "domestic";

const CATEGORY_MULTIPLIER: Record<Period, number> = {
  today: 0.14,
  week: 1,
  month: 4.2,
  "3month": 12.8,
  custom: 1,
};

interface BaseItem {
  nameKey: string;
  categoryKey: string;
  currency: Cur;
  baseQty: number;
  basePrice: number;
  weeklyBest?: number[];
}

const BASE_ITEMS: BaseItem[] = [
  {
    nameKey: "ribeyeSteak",
    categoryKey: "grilledBbq",
    currency: "foreign",
    baseQty: 102,
    basePrice: 45,
    weeklyBest: [14, 17, 13, 15, 22, 28, 19],
  },
  { nameKey: "grilledSalmon", categoryKey: "grilledBbq", currency: "foreign", baseQty: 128, basePrice: 20 },
  { nameKey: "lobsterTail", categoryKey: "entrees", currency: "foreign", baseQty: 58, basePrice: 58 },
  { nameKey: "caesarSalad", categoryKey: "salads", currency: "foreign", baseQty: 158, basePrice: 14 },
  { nameKey: "truffleFries", categoryKey: "sides", currency: "foreign", baseQty: 182, basePrice: 8 },
  { nameKey: "lycheeMartini", categoryKey: "cocktails", currency: "foreign", baseQty: 94, basePrice: 12 },
  { nameKey: "chickenWings", categoryKey: "appetizers", currency: "foreign", baseQty: 146, basePrice: 12 },
  { nameKey: "tiramisu", categoryKey: "desserts", currency: "foreign", baseQty: 74, basePrice: 9 },
  { nameKey: "fishAndChips", categoryKey: "entrees", currency: "foreign", baseQty: 88, basePrice: 22 },
  { nameKey: "maiTai", categoryKey: "cocktails", currency: "foreign", baseQty: 63, basePrice: 11 },
  {
    nameKey: "bibimbap",
    categoryKey: "riceDishes",
    currency: "domestic",
    baseQty: 212,
    basePrice: 14000,
    weeklyBest: [24, 28, 31, 26, 36, 42, 33],
  },
  { nameKey: "bulgogi", categoryKey: "grilledBbq", currency: "domestic", baseQty: 165, basePrice: 18000 },
  { nameKey: "soju", categoryKey: "sakeSoju", currency: "domestic", baseQty: 288, basePrice: 7000 },
  { nameKey: "makgeolli", categoryKey: "sakeSoju", currency: "domestic", baseQty: 142, basePrice: 9000 },
  { nameKey: "kimchi", categoryKey: "coldDishes", currency: "domestic", baseQty: 196, basePrice: 5000 },
  { nameKey: "ramen", categoryKey: "hotSoups", currency: "domestic", baseQty: 176, basePrice: 12000 },
  { nameKey: "udonNoodles", categoryKey: "noodles", currency: "domestic", baseQty: 134, basePrice: 13000 },
  { nameKey: "gyoza", categoryKey: "hotAppetizers", currency: "domestic", baseQty: 158, basePrice: 8000 },
  { nameKey: "greenTea", categoryKey: "tea", currency: "domestic", baseQty: 224, basePrice: 3000 },
  { nameKey: "hotSake", categoryKey: "sakeSoju", currency: "domestic", baseQty: 96, basePrice: 8000 },
];

const WEEK_AXIS_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const CATEGORY_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6", "#ec4899"];

export function MenuAnalysisView() {
  const { t } = useTranslation("analytics");
  const [period, setPeriod] = useState<Period>("week");
  const [sortBy, setSortBy] = useState<"revenue" | "volume">("revenue");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const tc = useThemeClasses();
  const { isDomestic, symbol, fmt } = useAnalyticsCurrency();
  const themedTooltip = tc.tooltipStyle;

  const activeCur: Cur = isDomestic ? "domestic" : "foreign";
  const mult = CATEGORY_MULTIPLIER[period];

  const poolItems = useMemo(
    () =>
      BASE_ITEMS.filter((i) => i.currency === activeCur).map((i) => ({
        nameKey: i.nameKey,
        name: t(`menuItems.${i.nameKey}`),
        categoryKey: i.categoryKey,
        category: t(`menuCategories.${i.categoryKey}`),
        qty: Math.round(i.baseQty * mult),
        revenue: Math.round(i.basePrice * i.baseQty * mult),
        weeklyBest: i.weeklyBest,
      })),
    [activeCur, mult, t],
  );

  const categoryData = useMemo(() => {
    const byCat = new Map<string, { categoryKey: string; name: string; revenue: number; orders: number }>();
    for (const it of poolItems) {
      const e = byCat.get(it.categoryKey) ?? {
        categoryKey: it.categoryKey,
        name: it.category,
        revenue: 0,
        orders: 0,
      };
      e.revenue += it.revenue;
      e.orders += it.qty;
      byCat.set(it.categoryKey, e);
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

  const topCat = categoryData[0] ?? { name: t("menuAnalysis.dash"), revenue: 0, categoryKey: "" };

  const filteredItems = useMemo(() => {
    const list = selectedCategory ? poolItems.filter((i) => i.categoryKey === selectedCategory) : poolItems;
    return [...list].sort((a, b) =>
      sortBy === "revenue" ? b.revenue - a.revenue : b.qty - a.qty,
    );
  }, [poolItems, selectedCategory, sortBy]);

  const bestSeller = useMemo(() => {
    const withTrend = poolItems.find((i) => i.weeklyBest);
    return withTrend ?? poolItems[0];
  }, [poolItems]);

  const bestSellerData = useMemo(() => {
    if (!bestSeller?.weeklyBest) return [];
    const scaled = bestSeller.weeklyBest.map((n) => Math.round(n * mult));
    const peak = Math.max(...scaled);
    return WEEK_AXIS_KEYS.map((key, i) => ({
      day: t(`axis.week.${key}`),
      qty: scaled[i],
      fill: scaled[i] === peak ? "#3b82f6" : tc.isDark ? "#374151" : "#cbd5e1",
    }));
  }, [bestSeller, mult, tc.isDark, t]);

  if (poolItems.length === 0) {
    return (
      <div className="space-y-4 pb-4">
        <DateFilterBar period={period} setPeriod={setPeriod} title={t("titles.menuAnalysis")} />
        <div className={`${tc.card} rounded-xl p-10 text-center ${tc.muted} text-[0.875rem]`}>
          {t("menuAnalysis.noItemsSold", {
            pool: t(activeCur === "domestic" ? "menuAnalysis.poolDomestic" : "menuAnalysis.poolForeign"),
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <DateFilterBar period={period} setPeriod={setPeriod} title={t("titles.menuAnalysis")} />

      <AnimatedContent animationKey={`${period}-${activeCur}`} className="space-y-4">
        <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
          <p className={`text-[1rem] ${tc.heading} mb-1`}>
            <Trans
              ns="analytics"
              i18nKey="menuAnalysis.topCategoryLoved"
              values={{ category: topCat.name, currency: symbol }}
              components={{ highlight: <span className="text-blue-500" /> }}
            />
          </p>
          <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>
            {t("menuAnalysis.categoryIntro", {
              pool: t(activeCur === "domestic" ? "menuAnalysis.poolDomestic" : "menuAnalysis.poolForeign"),
            })}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <PieChart width={200} height={200}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={88}
                dataKey="value"
                nameKey="name"
                paddingAngle={3}
                strokeWidth={0}
              />
            </PieChart>

            <div className="flex-1 w-full space-y-3">
              {categoryData.map((d) => (
                <button
                  key={d.categoryKey}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === d.categoryKey ? null : d.categoryKey)
                  }
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-left ${
                    selectedCategory === d.categoryKey
                      ? tc.isDark
                        ? "bg-slate-700"
                        : "bg-blue-50"
                      : tc.hover
                  }`}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.fill }} />
                  <span className={`text-[0.9375rem] ${tc.text2} min-w-[100px] truncate`}>{d.name}</span>
                  <span className={`text-[0.875rem] ${tc.subtext}`}>{d.value}%</span>
                  <span className={`text-[0.9375rem] ${tc.heading} ml-auto tabular-nums`}>{fmt(d.revenue)}</span>
                  <span className={`text-[0.8125rem] ${tc.subtext} tabular-nums`}>
                    {d.orders.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-[1rem] ${tc.heading}`}>
                {selectedCategory
                  ? t("menuAnalysis.itemsWithCategory", {
                      category: poolItems.find((i) => i.categoryKey === selectedCategory)?.category ?? "",
                    })
                  : t(activeCur === "domestic" ? "menuAnalysis.allDomesticItems" : "menuAnalysis.allForeignItems")}
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-[0.8125rem] text-blue-500 cursor-pointer mt-0.5"
                >
                  {t("menuAnalysis.showAllCategories")}
                </button>
              )}
            </div>
            <div
              className={`flex items-center gap-0.5 rounded-lg p-0.5 ${tc.isDark ? "bg-slate-800" : "bg-slate-100"}`}
            >
              {(["revenue", "volume"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 rounded-md text-[0.8125rem] cursor-pointer transition-colors ${
                    sortBy === s ? "bg-blue-600 text-white" : tc.subtext
                  }`}
                >
                  {s === "revenue" ? t("menuAnalysis.sortRevenue") : t("menuAnalysis.sortVolume")}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`grid grid-cols-[1fr_auto_auto_auto] gap-x-2 px-3 py-2 text-[0.8125rem] ${tc.subtext} border-b ${tc.border}`}
          >
            <span>{t("menuAnalysis.colItem")}</span>
            <span className="w-18 text-right">{t("menuAnalysis.colCategory")}</span>
            <span className="w-9 text-right">{t("menuAnalysis.colSold")}</span>
            <span className="w-22 text-right">{t("menuAnalysis.colRevenue")}</span>
          </div>

          <div className="space-y-0.5 mt-1">
            {filteredItems.map((item, i) => (
              <div
                key={item.nameKey}
                className={`grid grid-cols-[1fr_auto_auto_auto] gap-x-2 items-center px-3 py-2.5 rounded-lg ${
                  i === 0 ? (tc.isDark ? "bg-blue-600/10" : "bg-blue-50") : ""
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[0.8125rem] shrink-0 ${
                      i === 0 ? "bg-blue-600 text-white" : "bg-blue-600/15 text-blue-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-[0.8125rem] ${tc.text2} truncate`}>{item.name}</span>
                </div>
                <span className={`w-18 text-right text-[0.8125rem] ${tc.subtext} truncate`}>{item.category}</span>
                <span className={`w-9 text-right text-[0.8125rem] ${tc.text2} tabular-nums`}>{item.qty}</span>
                <span className={`w-22 text-right text-[0.8125rem] ${tc.heading} tabular-nums`}>
                  {fmt(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {bestSeller?.weeklyBest && (
          <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
            <h3 className={`text-[1rem] ${tc.heading} mb-1`}>
              <span className="text-blue-500">{bestSeller.name}</span> — {t("menuAnalysis.weeklyTrend")}
            </h3>
            <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>
              {t(activeCur === "domestic" ? "menuAnalysis.topSellerDomestic" : "menuAnalysis.topSellerForeign")}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bestSellerData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} vertical={false} />
                <XAxis
                  key="xaxis"
                  dataKey="day"
                  tick={{ fontSize: 11, fill: tc.tickFill }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  key="yaxis"
                  tick={{ fontSize: 11, fill: tc.tickFill }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip key="tooltip" contentStyle={themedTooltip} />
                <Bar
                  key="bar"
                  dataKey="qty"
                  radius={[6, 6, 0, 0]}
                  shape={(props: Record<string, unknown>) => (
                    <Rectangle {...props} fill={props.fill as string} radius={[6, 6, 0, 0]} />
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </AnimatedContent>
    </div>
  );
}
