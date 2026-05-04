import { useState, useMemo } from "react";
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle,
} from "recharts";
import { useThemeClasses } from "../theme-context";
import { DateFilterBar, type Period } from "./DateFilterBar";
import { AnimatedContent } from "./AnimatedContent";
import { useAnalyticsCurrency } from "./currency";

// Independent ₩ and $ streams — no conversion between them.
const HOURLY_REVENUE = [
  { label: "8",  revenueUsd: 60,   revenueKrw: 820_000 },
  { label: "9",  revenueUsd: 140,  revenueKrw: 1_460_000 },
  { label: "10", revenueUsd: 95,   revenueKrw: 2_640_000 },
  { label: "11", revenueUsd: 380,  revenueKrw: 5_120_000 },
  { label: "12", revenueUsd: 720,  revenueKrw: 6_480_000 },
  { label: "13", revenueUsd: 620,  revenueKrw: 3_820_000 },
  { label: "14", revenueUsd: 210,  revenueKrw: 1_940_000 },
  { label: "15", revenueUsd: 110,  revenueKrw: 540_000 },
  { label: "16", revenueUsd: 90,   revenueKrw: 380_000 },
  { label: "17", revenueUsd: 260,  revenueKrw: 1_260_000 },
  { label: "18", revenueUsd: 1320, revenueKrw: 3_240_000 },
  { label: "19", revenueUsd: 2080, revenueKrw: 3_760_000 },
  { label: "20", revenueUsd: 1720, revenueKrw: 5_340_000 },
  { label: "21", revenueUsd: 980,  revenueKrw: 6_280_000 },
  { label: "22", revenueUsd: 240,  revenueKrw: 2_620_000 },
];

const WEEKLY_REVENUE = [
  { label: "Mon", revenueUsd: 540,  revenueKrw: 4_620_000 },
  { label: "Tue", revenueUsd: 1820, revenueKrw: 2_140_000 },
  { label: "Wed", revenueUsd: 920,  revenueKrw: 6_980_000 },
  { label: "Thu", revenueUsd: 2420, revenueKrw: 3_580_000 },
  { label: "Fri", revenueUsd: 1380, revenueKrw: 6_420_000 },
  { label: "Sat", revenueUsd: 3240, revenueKrw: 2_720_000 },
  { label: "Sun", revenueUsd: 680,  revenueKrw: 5_460_000 },
];

const MONTHLY_REVENUE = [
  { label: "W1", revenueUsd: 5320,  revenueKrw: 13_620_000 },
  { label: "W2", revenueUsd: 10180, revenueKrw: 20_680_000 },
  { label: "W3", revenueUsd: 6740,  revenueKrw: 29_120_000 },
  { label: "W4", revenueUsd: 12040, revenueKrw: 16_820_000 },
];

const QUARTERLY_REVENUE = [
  { label: "Jan", revenueUsd: 20460, revenueKrw: 103_680_000 },
  { label: "Feb", revenueUsd: 36180, revenueKrw: 75_340_000 },
  { label: "Mar", revenueUsd: 27240, revenueKrw: 124_320_000 },
  { label: "Apr", revenueUsd: 42860, revenueKrw: 87_460_000 },
];

// Foreign ($) and Domestic (₩) are tracked independently — two separate registers.
// Foreign ($) and Domestic (₩) splits differ — dine-in dominates $ orders, delivery skews higher in ₩.
interface TypeRow { name: string; revenueUsd: number; revenueKrw: number; pctUsd: number; pctKrw: number }
const REVENUE_BY_TYPE_DATA: Record<string, TypeRow[]> = {
  today: [
    { name: "Dine-in",  revenueUsd: 1420, revenueKrw: 1_820_000, pctUsd: 72, pctKrw: 42 },
    { name: "Takeaway", revenueUsd: 380,  revenueKrw: 1_640_000, pctUsd: 19, pctKrw: 38 },
    { name: "Delivery", revenueUsd: 180,  revenueKrw: 860_000,   pctUsd: 9,  pctKrw: 20 },
  ],
  week: [
    { name: "Dine-in",  revenueUsd: 8240, revenueKrw: 9_620_000,  pctUsd: 68, pctKrw: 36 },
    { name: "Takeaway", revenueUsd: 2680, revenueKrw: 11_240_000, pctUsd: 22, pctKrw: 42 },
    { name: "Delivery", revenueUsd: 1220, revenueKrw: 5_880_000,  pctUsd: 10, pctKrw: 22 },
  ],
  month: [
    { name: "Dine-in",  revenueUsd: 22460, revenueKrw: 28_640_000, pctUsd: 64, pctKrw: 33 },
    { name: "Takeaway", revenueUsd: 9820,  revenueKrw: 36_840_000, pctUsd: 28, pctKrw: 42 },
    { name: "Delivery", revenueUsd: 2820,  revenueKrw: 21_840_000, pctUsd: 8,  pctKrw: 25 },
  ],
  "3month": [
    { name: "Dine-in",  revenueUsd: 78420, revenueKrw: 108_240_000, pctUsd: 62, pctKrw: 28 },
    { name: "Takeaway", revenueUsd: 36840, revenueKrw: 162_480_000, pctUsd: 29, pctKrw: 42 },
    { name: "Delivery", revenueUsd: 11620, revenueKrw: 116_080_000, pctUsd: 9,  pctKrw: 30 },
  ],
  custom: [
    { name: "Dine-in",  revenueUsd: 8240, revenueKrw: 9_620_000,  pctUsd: 68, pctKrw: 36 },
    { name: "Takeaway", revenueUsd: 2680, revenueKrw: 11_240_000, pctUsd: 22, pctKrw: 42 },
    { name: "Delivery", revenueUsd: 1220, revenueKrw: 5_880_000,  pctUsd: 10, pctKrw: 22 },
  ],
};

const COMPARISONS: Record<string, { currentUsd: number; currentKrw: number; previousUsd: number; previousKrw: number }> = {
  today:    { currentUsd: 1980,   currentKrw: 4_320_000,   previousUsd: 2240,   previousKrw: 3_620_000 },
  week:     { currentUsd: 12140,  currentKrw: 26_740_000,  previousUsd: 10860,  previousKrw: 28_920_000 },
  month:    { currentUsd: 34280,  currentKrw: 80_340_000,  previousUsd: 29640,  previousKrw: 86_760_000 },
  "3month": { currentUsd: 126880, currentKrw: 390_800_000, previousUsd: 108240, previousKrw: 342_460_000 },
  custom:   { currentUsd: 12140,  currentKrw: 26_740_000,  previousUsd: 10860,  previousKrw: 28_920_000 },
};

function getChartData(period: Period) {
  switch (period) {
    case "today": return HOURLY_REVENUE;
    case "week": case "custom": return WEEKLY_REVENUE;
    case "month": return MONTHLY_REVENUE;
    case "3month": return QUARTERLY_REVENUE;
  }
}

export function RevenueAnalysisView() {
  const [period, setPeriod] = useState<Period>("week");
  const tc = useThemeClasses();
  const { pick, isDomestic } = useAnalyticsCurrency();
  const themedTooltip = tc.tooltipStyle;

  const chartData = getChartData(period);
  const comparison = COMPARISONS[period];
  const revenueByType = REVENUE_BY_TYPE_DATA[period];
  const currentActive = isDomestic ? comparison.currentKrw : comparison.currentUsd;
  const previousActive = isDomestic ? comparison.previousKrw : comparison.previousUsd;
  const maxComp = Math.max(currentActive, previousActive);

  const activeKey = isDomestic ? "revenueKrw" : "revenueUsd";
  const peakEntry = chartData.reduce((a, b) => (a[activeKey] > b[activeKey] ? a : b));
  const comparisonRows = [
    { label: "This Period", value: currentActive, color: "#3b82f6" },
    { label: "Last Period", value: previousActive, color: "#94a3b8" },
  ];

  const coloredChartData = useMemo(() =>
    chartData.map((e) => ({
      ...e,
      fill: e.label === peakEntry.label ? "#3b82f6" : tc.isDark ? "#374151" : "#cbd5e1",
    })), [chartData, peakEntry.label, tc.isDark]);

  const topType = revenueByType.reduce((a, b) => {
    const av = isDomestic ? a.revenueKrw : a.revenueUsd;
    const bv = isDomestic ? b.revenueKrw : b.revenueUsd;
    return av > bv ? a : b;
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      <DateFilterBar period={period} setPeriod={setPeriod} title="Revenue Analysis" />

      <AnimatedContent animationKey={period} className="flex-1 min-h-0 flex flex-col gap-4">

      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-3">
        {comparisonRows.map((r) => (
          <div key={r.label} className={`${tc.card} rounded-xl p-4`}>
            <p className={`text-[0.8125rem] ${tc.subtext} mb-1`}>{r.label}</p>
            <p className={`text-[1.5rem] ${tc.heading}`}>{isDomestic ? `₩${r.value.toLocaleString()}` : `$${r.value.toLocaleString()}`}</p>
            <div className={`h-1 rounded-full mt-2 ${tc.isDark ? "bg-slate-700" : "bg-slate-200"}`}>
              <div className="h-full rounded-full" style={{ width: `${(r.value / (maxComp * 1.1)) * 100}%`, background: r.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className={`${tc.card} rounded-xl p-4 sm:p-5 flex-1 min-h-[320px] flex flex-col`}>
        <p className={`text-[1rem] ${tc.heading} mb-1`}>
          Peak revenue at <span className="text-blue-500">{peakEntry.label}</span>
        </p>
        <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>Revenue over time</p>
        <div className="flex-1 min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coloredChartData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} vertical={false} />
              <XAxis key="xaxis" dataKey="label" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={themedTooltip} />
              <Bar key="bar" dataKey={activeKey} radius={[6, 6, 0, 0]}
                shape={(props: any) => <Rectangle {...props} fill={props.fill} radius={[6, 6, 0, 0]} />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by order type */}
      <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
        <h3 className={`text-[1rem] ${tc.heading} mb-1`}>
          <span className="text-blue-500">{topType.name}</span> generates the most revenue!
        </h3>
        <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>Revenue by order type</p>
        <div className="space-y-3">
          {revenueByType.map((t) => {
            const pct = isDomestic ? t.pctKrw : t.pctUsd;
            return (
            <div key={t.name}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[0.9375rem] ${tc.text2}`}>{t.name}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-[0.9375rem] ${tc.heading}`}>{pick({ usd: t.revenueUsd, krw: t.revenueKrw })}</span>
                  <span className={`text-[0.8125rem] ${tc.subtext} w-10 text-right`}>{pct}%</span>
                </div>
              </div>
              <div className={`h-2 rounded-full w-full ${tc.isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
            );
          })}
        </div>
      </div>
      </AnimatedContent>
    </div>
  );
}
