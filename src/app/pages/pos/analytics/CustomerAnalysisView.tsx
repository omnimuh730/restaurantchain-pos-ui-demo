import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  AreaChart,
  Area,
} from "recharts";
import { Trans, useTranslation } from "react-i18next";
import { TrendingUp, TrendingDown, Users, UserPlus, Repeat, Star } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import { DateFilterBar, type Period } from "./DateFilterBar";
import { AnimatedContent } from "./AnimatedContent";

const KPI_BY_PERIOD: Record<
  string,
  {
    totalCust: string;
    newCust: string;
    returning: string;
    satisfaction: string;
    custChange: string;
    newChange: string;
    retChange: string;
    satChange: string;
  }
> = {
  today: {
    totalCust: "82",
    newCust: "14",
    returning: "58%",
    satisfaction: "4.7",
    custChange: "+4.1%",
    newChange: "+8.5%",
    retChange: "+1.2%",
    satChange: "+0.1",
  },
  week: {
    totalCust: "1,284",
    newCust: "186",
    returning: "62%",
    satisfaction: "4.6",
    custChange: "+8.3%",
    newChange: "+14.2%",
    retChange: "+3.1%",
    satChange: "-0.1",
  },
  month: {
    totalCust: "5,120",
    newCust: "742",
    returning: "65%",
    satisfaction: "4.6",
    custChange: "+10.1%",
    newChange: "+12.8%",
    retChange: "+4.5%",
    satChange: "+0.2",
  },
  "3month": {
    totalCust: "14,860",
    newCust: "2,104",
    returning: "63%",
    satisfaction: "4.5",
    custChange: "+12.6%",
    newChange: "+16.4%",
    retChange: "+2.8%",
    satChange: "-0.2",
  },
  custom: {
    totalCust: "1,284",
    newCust: "186",
    returning: "62%",
    satisfaction: "4.6",
    custChange: "+8.3%",
    newChange: "+14.2%",
    retChange: "+3.1%",
    satChange: "-0.1",
  },
};

type SegmentKey = "returning" | "new";

const CUSTOMER_TYPE_BY_PERIOD: Record<string, { segmentKey: SegmentKey; value: number; fill: string }[]> = {
  today: [
    { segmentKey: "returning", value: 58, fill: "#3b82f6" },
    { segmentKey: "new", value: 42, fill: "#22c55e" },
  ],
  week: [
    { segmentKey: "returning", value: 62, fill: "#3b82f6" },
    { segmentKey: "new", value: 38, fill: "#22c55e" },
  ],
  month: [
    { segmentKey: "returning", value: 65, fill: "#3b82f6" },
    { segmentKey: "new", value: 35, fill: "#22c55e" },
  ],
  "3month": [
    { segmentKey: "returning", value: 63, fill: "#3b82f6" },
    { segmentKey: "new", value: 37, fill: "#22c55e" },
  ],
  custom: [
    { segmentKey: "returning", value: 62, fill: "#3b82f6" },
    { segmentKey: "new", value: 38, fill: "#22c55e" },
  ],
};

type FreqKey = "1x" | "2-3x" | "4-6x" | "7-10x" | "10x+";

const VISIT_FREQUENCY_BY_PERIOD: Record<string, { visitsKey: FreqKey; customers: number }[]> = {
  today: [
    { visitsKey: "1x", customers: 34 },
    { visitsKey: "2-3x", customers: 26 },
    { visitsKey: "4-6x", customers: 14 },
    { visitsKey: "7-10x", customers: 6 },
    { visitsKey: "10x+", customers: 2 },
  ],
  week: [
    { visitsKey: "1x", customers: 486 },
    { visitsKey: "2-3x", customers: 384 },
    { visitsKey: "4-6x", customers: 228 },
    { visitsKey: "7-10x", customers: 124 },
    { visitsKey: "10x+", customers: 62 },
  ],
  month: [
    { visitsKey: "1x", customers: 1792 },
    { visitsKey: "2-3x", customers: 1536 },
    { visitsKey: "4-6x", customers: 1024 },
    { visitsKey: "7-10x", customers: 512 },
    { visitsKey: "10x+", customers: 256 },
  ],
  "3month": [
    { visitsKey: "1x", customers: 5202 },
    { visitsKey: "2-3x", customers: 4158 },
    { visitsKey: "4-6x", customers: 2972 },
    { visitsKey: "7-10x", customers: 1636 },
    { visitsKey: "10x+", customers: 892 },
  ],
  custom: [
    { visitsKey: "1x", customers: 486 },
    { visitsKey: "2-3x", customers: 384 },
    { visitsKey: "4-6x", customers: 228 },
    { visitsKey: "7-10x", customers: 124 },
    { visitsKey: "10x+", customers: 62 },
  ],
};

const PARTY_SIZE: { sizeKey: string; pct: number }[] = [
  { sizeKey: "1", pct: 8 },
  { sizeKey: "2", pct: 32 },
  { sizeKey: "3-4", pct: 38 },
  { sizeKey: "5-6", pct: 15 },
  { sizeKey: "7+", pct: 7 },
];

const HOURLY_TRAFFIC: { hourKey: string; customers: number }[] = [
  { hourKey: "8", customers: 12 },
  { hourKey: "9", customers: 28 },
  { hourKey: "10", customers: 45 },
  { hourKey: "11", customers: 82 },
  { hourKey: "12", customers: 120 },
  { hourKey: "13", customers: 105 },
  { hourKey: "14", customers: 52 },
  { hourKey: "15", customers: 28 },
  { hourKey: "16", customers: 18 },
  { hourKey: "17", customers: 48 },
  { hourKey: "18", customers: 98 },
  { hourKey: "19", customers: 135 },
  { hourKey: "20", customers: 110 },
  { hourKey: "21", customers: 65 },
  { hourKey: "22", customers: 22 },
];

export function CustomerAnalysisView() {
  const { t, i18n } = useTranslation("analytics");
  const [period, setPeriod] = useState<Period>("week");
  const tc = useThemeClasses();
  const themedTooltip = tc.tooltipStyle;

  const kpis = KPI_BY_PERIOD[period];
  const customerTypeRaw = CUSTOMER_TYPE_BY_PERIOD[period];
  const visitFrequencyRaw = VISIT_FREQUENCY_BY_PERIOD[period];

  const hourlyTraffic = useMemo(
    () =>
      HOURLY_TRAFFIC.map((row) => ({
        ...row,
        hour: t(`axis.hour.${row.hourKey}` as "axis.hour.8"),
        customers: row.customers,
      })),
    [t],
  );

  const customerType = useMemo(
    () =>
      customerTypeRaw.map((d) => ({
        ...d,
        name: t(d.segmentKey === "returning" ? "customer.customerReturning" : "customer.customerNew"),
      })),
    [customerTypeRaw, t],
  );

  const visitFrequency = useMemo(
    () =>
      visitFrequencyRaw.map((row) => ({
        ...row,
        visits: t(`customer.freqKeys.${row.visitsKey}` as "customer.freqKeys.1x"),
      })),
    [visitFrequencyRaw, t],
  );

  const peakHour = HOURLY_TRAFFIC.reduce((a, b) => (a.customers > b.customers ? a : b));
  const hourDisplay =
    i18n.language === "ko"
      ? t(`axis.hour.${peakHour.hourKey}` as "axis.hour.8")
      : `${peakHour.hourKey}:00`;

  const returningPct = customerTypeRaw.find((d) => d.segmentKey === "returning")?.value ?? 62;

  const kpiCards = useMemo(
    () => [
      {
        label: t("customer.totalCustomers"),
        value: kpis.totalCust,
        change: kpis.custChange,
        up: !kpis.custChange.startsWith("-"),
        icon: Users,
      },
      {
        label: t("customer.newCustomers"),
        value: kpis.newCust,
        change: kpis.newChange,
        up: !kpis.newChange.startsWith("-"),
        icon: UserPlus,
      },
      {
        label: t("customer.returningRate"),
        value: kpis.returning,
        change: kpis.retChange,
        up: !kpis.retChange.startsWith("-"),
        icon: Repeat,
      },
      {
        label: t("customer.avgSatisfaction"),
        value: kpis.satisfaction,
        change: kpis.satChange,
        up: !kpis.satChange.startsWith("-"),
        icon: Star,
      },
    ],
    [t, kpis],
  );

  return (
    <div className="space-y-4 pb-4">
      <DateFilterBar period={period} setPeriod={setPeriod} title={t("titles.customerAnalysis")} />

      <AnimatedContent animationKey={period} className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {kpiCards.map((kpi) => (
            <div key={kpi.label} className={`${tc.card} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-4 h-4 ${tc.subtext}`} />
                <span
                  className={`flex items-center gap-0.5 text-[0.8125rem] ${kpi.up ? "text-green-500" : "text-red-500"}`}
                >
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className={`text-[1.5rem] ${tc.heading}`}>{kpi.value}</p>
              <p className={`text-[0.8125rem] ${tc.subtext} mt-0.5`}>{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
            <p className={`text-[1rem] ${tc.heading} mb-1`}>
              <Trans
                ns="analytics"
                i18nKey="customer.peakHour"
                values={{ hour: hourDisplay }}
                components={{ highlight: <span className="text-blue-500" /> }}
              />
            </p>
            <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>{t("customer.trafficByHour")}</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={hourlyTraffic} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs key="defs">
                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} vertical={false} />
                <XAxis
                  key="xaxis"
                  dataKey="hour"
                  tick={{ fontSize: 10, fill: tc.tickFill }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis key="yaxis" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
                <Tooltip key="tooltip" contentStyle={themedTooltip} />
                <Area
                  key="area"
                  type="monotone"
                  dataKey="customers"
                  stroke="#3b82f6"
                  fill="url(#trafficGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
            <p className={`text-[1rem] ${tc.heading} mb-1`}>
              <Trans
                ns="analytics"
                i18nKey="customer.returningShare"
                values={{ pct: returningPct }}
                components={{ highlight: <span className="text-blue-500" /> }}
              />
            </p>
            <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>{t("customer.newVsReturning")}</p>
            <div className="flex items-center gap-6">
              <PieChart width={160} height={160}>
                <Pie
                  data={customerType}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                  strokeWidth={0}
                />
              </PieChart>
              <div className="flex-1 space-y-4">
                {customerType.map((d) => (
                  <div key={d.segmentKey} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.fill }} />
                    <div>
                      <p className={`text-[0.9375rem] ${tc.text2}`}>{d.name}</p>
                      <p className={`text-[1.25rem] ${tc.heading}`}>{d.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
            <h3 className={`text-[1rem] ${tc.heading} mb-4`}>{t("customer.visitFrequency")}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={visitFrequency} layout="vertical">
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} horizontal={false} />
                <XAxis key="xaxis" type="number" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
                <YAxis
                  key="yaxis"
                  dataKey="visits"
                  type="category"
                  tick={{ fontSize: 11, fill: tc.tickFill }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip key="tooltip" contentStyle={themedTooltip} />
                <Bar key="bar" dataKey="customers" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
            <h3 className={`text-[1rem] ${tc.heading} mb-1`}>
              <Trans
                ns="analytics"
                i18nKey="customer.partyTitle"
                components={{ highlight: <span className="text-blue-500" /> }}
              />
            </h3>
            <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>{t("customer.partySubtitle")}</p>
            <div className="space-y-3">
              {PARTY_SIZE.map((p) => (
                <div key={p.sizeKey}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[0.9375rem] ${tc.text2}`}>
                      {t("customer.partyGuests", { size: p.sizeKey })}
                    </span>
                    <span className={`text-[0.9375rem] ${tc.heading}`}>{p.pct}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${tc.isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                    <div
                      className={`h-full rounded-full ${p.pct === 38 ? "bg-blue-500" : tc.isDark ? "bg-slate-500" : "bg-slate-400"}`}
                      style={{ width: `${p.pct * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
