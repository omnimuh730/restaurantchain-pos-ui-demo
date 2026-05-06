import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  XCircle,
  CreditCard,
  Banknote,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { Trans, useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { DateFilterBar, type Period } from "./DateFilterBar";
import { AnimatedContent } from "./AnimatedContent";
import { useAnalyticsCurrency } from "./currency";
import { formatDomesticWon, formatForeignUsd } from "../../../../i18n/formatMoney";

interface TrendRowRaw {
  labelKey: string;
  revenueUsd: number;
  revenueKrw: number;
  orders: number;
}

const HOURLY_DATA: TrendRowRaw[] = [
  { labelKey: "8", revenueUsd: 40, revenueKrw: 680_000, orders: 8 },
  { labelKey: "9", revenueUsd: 120, revenueKrw: 1_240_000, orders: 14 },
  { labelKey: "10", revenueUsd: 85, revenueKrw: 2_180_000, orders: 28 },
  { labelKey: "11", revenueUsd: 310, revenueKrw: 4_620_000, orders: 52 },
  { labelKey: "12", revenueUsd: 620, revenueKrw: 5_900_000, orders: 85 },
  { labelKey: "13", revenueUsd: 540, revenueKrw: 3_280_000, orders: 72 },
  { labelKey: "14", revenueUsd: 180, revenueKrw: 1_640_000, orders: 35 },
  { labelKey: "15", revenueUsd: 90, revenueKrw: 460_000, orders: 18 },
  { labelKey: "16", revenueUsd: 75, revenueKrw: 320_000, orders: 12 },
  { labelKey: "17", revenueUsd: 220, revenueKrw: 1_080_000, orders: 32 },
  { labelKey: "18", revenueUsd: 1180, revenueKrw: 2_940_000, orders: 68 },
  { labelKey: "19", revenueUsd: 1840, revenueKrw: 3_420_000, orders: 92 },
  { labelKey: "20", revenueUsd: 1520, revenueKrw: 4_860_000, orders: 78 },
  { labelKey: "21", revenueUsd: 880, revenueKrw: 5_720_000, orders: 45 },
  { labelKey: "22", revenueUsd: 210, revenueKrw: 2_380_000, orders: 18 },
];

const WEEKLY_DATA: TrendRowRaw[] = [
  { labelKey: "mon", revenueUsd: 480, revenueKrw: 4_180_000, orders: 42 },
  { labelKey: "tue", revenueUsd: 1640, revenueKrw: 1_920_000, orders: 48 },
  { labelKey: "wed", revenueUsd: 820, revenueKrw: 6_340_000, orders: 55 },
  { labelKey: "thu", revenueUsd: 2180, revenueKrw: 3_260_000, orders: 50 },
  { labelKey: "fri", revenueUsd: 1240, revenueKrw: 5_820_000, orders: 68 },
  { labelKey: "sat", revenueUsd: 2940, revenueKrw: 2_480_000, orders: 82 },
  { labelKey: "sun", revenueUsd: 620, revenueKrw: 4_960_000, orders: 61 },
];

const MONTHLY_DATA: TrendRowRaw[] = [
  { labelKey: "w1", revenueUsd: 4820, revenueKrw: 12_360_000, orders: 268 },
  { labelKey: "w2", revenueUsd: 9240, revenueKrw: 18_780_000, orders: 312 },
  { labelKey: "w3", revenueUsd: 6120, revenueKrw: 26_450_000, orders: 365 },
  { labelKey: "w4", revenueUsd: 10940, revenueKrw: 15_260_000, orders: 338 },
];

const QUARTERLY_DATA: TrendRowRaw[] = [
  { labelKey: "jan", revenueUsd: 18560, revenueKrw: 94_200_000, orders: 1080 },
  { labelKey: "feb", revenueUsd: 32840, revenueKrw: 68_400_000, orders: 996 },
  { labelKey: "mar", revenueUsd: 24720, revenueKrw: 112_880_000, orders: 1232 },
  { labelKey: "apr", revenueUsd: 38900, revenueKrw: 79_420_000, orders: 1283 },
];

interface KpiRow {
  totalRev: number;
  totalOrders: string;
  avgTicket: number;
  cancels: string;
  revChange: string;
  ordChange: string;
  ticketChange: string;
  cancelChange: string;
}

const KPI_FOREIGN: Record<string, KpiRow> = {
  today: {
    totalRev: 8450,
    totalOrders: "38",
    avgTicket: 22.24,
    cancels: "1",
    revChange: "+7.4%",
    ordChange: "+2.1%",
    ticketChange: "+5.2%",
    cancelChange: "-50%",
  },
  week: {
    totalRev: 9920,
    totalOrders: "186",
    avgTicket: 53.34,
    cancels: "4",
    revChange: "-2.8%",
    ordChange: "+11.0%",
    ticketChange: "-12.4%",
    cancelChange: "+33%",
  },
  month: {
    totalRev: 31120,
    totalOrders: "682",
    avgTicket: 45.63,
    cancels: "19",
    revChange: "+18.6%",
    ordChange: "+6.4%",
    ticketChange: "+11.5%",
    cancelChange: "-14%",
  },
  "3month": {
    totalRev: 115020,
    totalOrders: "2,108",
    avgTicket: 54.56,
    cancels: "58",
    revChange: "+21.3%",
    ordChange: "+8.2%",
    ticketChange: "+12.1%",
    cancelChange: "-6%",
  },
  custom: {
    totalRev: 9920,
    totalOrders: "186",
    avgTicket: 53.34,
    cancels: "4",
    revChange: "-2.8%",
    ordChange: "+11.0%",
    ticketChange: "-12.4%",
    cancelChange: "+33%",
  },
};

const KPI_DOMESTIC: Record<string, KpiRow> = {
  today: {
    totalRev: 3_840_000,
    totalOrders: "54",
    avgTicket: 71_100,
    cancels: "3",
    revChange: "-4.1%",
    ordChange: "+18.6%",
    ticketChange: "-19.1%",
    cancelChange: "+200%",
  },
  week: {
    totalRev: 28_960_000,
    totalOrders: "312",
    avgTicket: 92_820,
    cancels: "11",
    revChange: "+24.6%",
    ordChange: "+3.3%",
    ticketChange: "+20.6%",
    cancelChange: "-18%",
  },
  month: {
    totalRev: 82_840_000,
    totalOrders: "1,486",
    avgTicket: 55_740,
    cancels: "42",
    revChange: "+6.1%",
    ordChange: "+14.2%",
    ticketChange: "-7.0%",
    cancelChange: "+9%",
  },
  "3month": {
    totalRev: 324_160_000,
    totalOrders: "4,820",
    avgTicket: 67_250,
    cancels: "172",
    revChange: "+9.8%",
    ordChange: "+21.8%",
    ticketChange: "-9.8%",
    cancelChange: "-3%",
  },
  custom: {
    totalRev: 28_960_000,
    totalOrders: "312",
    avgTicket: 92_820,
    cancels: "11",
    revChange: "+24.6%",
    ordChange: "+3.3%",
    ticketChange: "+20.6%",
    cancelChange: "-18%",
  },
};

type PayMethod = "credit" | "cash";

const PAYMENT_SPLIT: Record<
  "foreign" | "domestic",
  { methodKey: PayMethod; value: number; fill: string; icon: typeof CreditCard }[]
> = {
  foreign: [
    { methodKey: "credit", value: 78, fill: "#3b82f6", icon: CreditCard },
    { methodKey: "cash", value: 22, fill: "#22c55e", icon: Banknote },
  ],
  domestic: [
    { methodKey: "credit", value: 41, fill: "#3b82f6", icon: CreditCard },
    { methodKey: "cash", value: 59, fill: "#22c55e", icon: Banknote },
  ],
};

function SalesTooltip({
  active,
  payload,
  isDomestic,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  isDomestic: boolean;
}) {
  if (!active || !payload?.length) return null;
  const rev = payload[0];
  const val = rev?.value ?? 0;
  const label = isDomestic ? formatDomesticWon(val) : formatForeignUsd(val);
  return (
    <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[0.875rem] shadow-lg">
      <span>{label}</span>
    </div>
  );
}

function getDataForPeriod(period: Period): TrendRowRaw[] {
  switch (period) {
    case "today":
      return HOURLY_DATA;
    case "week":
    case "custom":
      return WEEKLY_DATA;
    case "month":
      return MONTHLY_DATA;
    case "3month":
      return QUARTERLY_DATA;
  }
}

function axisNs(period: Period): "axis.hour" | "axis.week" | "axis.month" | "axis.quarter" {
  if (period === "today") return "axis.hour";
  if (period === "month") return "axis.month";
  if (period === "3month") return "axis.quarter";
  return "axis.week";
}

export function DashboardView() {
  const { t } = useTranslation("analytics");
  const [period, setPeriod] = useState<Period>("week");
  const tc = useThemeClasses();
  const { isDomestic, fmt } = useAnalyticsCurrency();

  const trendDataRaw = getDataForPeriod(period);
  const axisPrefix = axisNs(period);

  const trendData = useMemo(
    () =>
      trendDataRaw.map((e) => ({
        ...e,
        label: t(`${axisPrefix}.${e.labelKey}` as "axis.week.mon"),
      })),
    [trendDataRaw, axisPrefix, t],
  );

  const kpis = (isDomestic ? KPI_DOMESTIC : KPI_FOREIGN)[period];
  const kpiDomestic = KPI_DOMESTIC[period];
  const kpiForeign = KPI_FOREIGN[period];

  const fmtMoney = (v: number) => (isDomestic ? formatDomesticWon(v) : formatForeignUsd(v));

  const kpiCards = useMemo(
    () => [
      {
        label: t("dashboard.totalOrders"),
        value: kpis.totalOrders,
        change: kpis.ordChange,
        up: !kpis.ordChange.startsWith("-"),
        icon: ShoppingCart,
      },
      {
        label: t("dashboard.avgTicket"),
        value: fmtMoney(kpis.avgTicket),
        change: kpis.ticketChange,
        up: !kpis.ticketChange.startsWith("-"),
        icon: TrendingUp,
      },
      {
        label: t("dashboard.cancellations"),
        value: kpis.cancels,
        change: kpis.cancelChange,
        up: kpis.cancelChange.startsWith("-"),
        icon: XCircle,
      },
    ],
    [t, kpis, fmtMoney],
  );

  const activeKey = isDomestic ? "revenueKrw" : "revenueUsd";
  const peakIdx = trendDataRaw.reduce(
    (bestIdx, row, i, arr) => (row[activeKey] > arr[bestIdx][activeKey] ? i : bestIdx),
    0,
  );
  const peakLabel = trendData[peakIdx]?.label ?? "";

  const coloredChartData = useMemo(
    () =>
      trendData.map((e, i) => ({
        ...e,
        fill: i === peakIdx ? "#3b82f6" : tc.isDark ? "#374151" : "#cbd5e1",
      })),
    [trendData, peakIdx, tc.isDark],
  );

  const payLabel = (methodKey: PayMethod) =>
    methodKey === "credit" ? t("dashboard.paymentCredit") : t("dashboard.paymentCash");

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      <DateFilterBar period={period} setPeriod={setPeriod} title={t("titles.dashboard")} />

      <AnimatedContent animationKey={period} className="flex-1 min-h-0 flex flex-col gap-3">
        <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-[0.875rem] ${tc.subtext}`}>{t("dashboard.totalRevenue")}</p>
                <span
                  className={`flex items-center gap-0.5 text-[0.8125rem] ${!kpis.revChange.startsWith("-") ? "text-green-500" : "text-red-500"}`}
                >
                  {!kpis.revChange.startsWith("-") ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {kpis.revChange}
                </span>
              </div>
              <p className={`text-[1.5rem] sm:text-[2.25rem] ${tc.heading} flex flex-col gap-1`}>
                {kpiDomestic.totalRev > 0 && (
                  <span className="text-blue-600 text-right">
                    {formatDomesticWon(kpiDomestic.totalRev)}
                  </span>
                )}
                {kpiForeign.totalRev > 0 && (
                  <span className="text-red-600 flex justify-between items-center">
                    {kpiDomestic.totalRev > 0 && <span>+</span>}
                    <span>
                      {formatForeignUsd(kpiForeign.totalRev)}
                    </span>
                  </span>
                )}
              </p>
            </div>
            <div className="space-y-3">
              {PAYMENT_SPLIT.domestic.map((d, idx) => {
                const domesticItem = PAYMENT_SPLIT.domestic[idx];
                const foreignItem = PAYMENT_SPLIT.foreign[idx];
                const amountKrw = Math.round((kpiDomestic.totalRev * domesticItem.value) / 100);
                const amountUsd = (kpiForeign.totalRev * foreignItem.value) / 100;
                const Icon = d.icon;
                return (
                  <div key={d.methodKey}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" style={{ color: d.fill }} />
                        <span className={`text-[0.875rem] ${tc.text2} truncate`}>
                          {payLabel(d.methodKey)}
                        </span>
                      </div>
                      <span
                        className={`text-[0.9375rem] ${tc.heading} shrink-0 flex flex-col items-end gap-0.5`}
                      >
                        {amountKrw > 0 && (
                          <span className="text-blue-600">{formatDomesticWon(amountKrw)}</span>
                        )}
                        {amountUsd > 0 && (
                          <span className="text-red-600 flex justify-between w-full">
                            {amountKrw > 0 && <span>+</span>}
                            <span>{formatForeignUsd(amountUsd)}</span>
                          </span>
                        )}
                      </span>
                    </div>
                    {idx < PAYMENT_SPLIT.domestic.length - 1 && (
                      <div className={`border-t border-dashed ${tc.border} my-3`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <div className="grid grid-cols-3 gap-2">
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

          <div className={`${tc.card} rounded-xl p-4 sm:p-5 flex-1 min-h-[320px] flex flex-col`}>
            <h3 className={`text-[1rem] ${tc.heading}`}>{t("dashboard.salesTrend")}</h3>
            <p className={`text-[0.875rem] ${tc.subtext} mt-0.5 mb-3`}>{t("dashboard.salesTrendHint")}</p>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <defs key="defs">
                    <linearGradient id={`trendGrad-${period}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    key="grid"
                    strokeDasharray="3 3"
                    stroke={tc.gridStroke}
                    vertical={false}
                  />
                  <XAxis
                    key="xaxis"
                    dataKey="label"
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
                  <Tooltip key="tooltip" content={<SalesTooltip isDomestic={isDomestic} />} />
                  <Area
                    key="area"
                    type="monotone"
                    dataKey={isDomestic ? "revenueKrw" : "revenueUsd"}
                    stroke="#3b82f6"
                    fill={`url(#trendGrad-${period})`}
                    strokeWidth={2.5}
                    dot={{
                      r: 3,
                      fill: "#3b82f6",
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${tc.card} rounded-xl p-4 sm:p-5 flex-1 min-h-[320px] flex flex-col`}>
            <p className={`text-[1rem] ${tc.heading} mb-1`}>
              <Trans
                ns="analytics"
                i18nKey="revenueAnalysis.peakRevenue"
                values={{ label: peakLabel }}
                components={{ highlight: <span className="text-blue-500" /> }}
              />
            </p>
            <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>{t("dashboard.barOverTime")}</p>
            <div className="flex-1 min-h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coloredChartData}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} vertical={false} />
                  <XAxis
                    key="xaxis"
                    dataKey="label"
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
                  <Tooltip key="tooltip" contentStyle={tc.tooltipStyle} />
                  <Bar
                    key="bar"
                    dataKey={activeKey}
                    radius={[6, 6, 0, 0]}
                    shape={(props: Record<string, unknown>) => (
                      <Rectangle {...props} fill={props.fill as string} radius={[6, 6, 0, 0]} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
