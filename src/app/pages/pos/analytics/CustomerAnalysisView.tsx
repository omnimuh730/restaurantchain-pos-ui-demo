import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, AreaChart, Area,
} from "recharts";
import { TrendingUp, TrendingDown, Users, UserPlus, Repeat, Star } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import { DateFilterBar, type Period } from "./DateFilterBar";
import { AnimatedContent } from "./AnimatedContent";

const KPI_BY_PERIOD: Record<string, { totalCust: string; newCust: string; returning: string; satisfaction: string; custChange: string; newChange: string; retChange: string; satChange: string }> = {
  today: { totalCust: "82", newCust: "14", returning: "58%", satisfaction: "4.7", custChange: "+4.1%", newChange: "+8.5%", retChange: "+1.2%", satChange: "+0.1" },
  week: { totalCust: "1,284", newCust: "186", returning: "62%", satisfaction: "4.6", custChange: "+8.3%", newChange: "+14.2%", retChange: "+3.1%", satChange: "-0.1" },
  month: { totalCust: "5,120", newCust: "742", returning: "65%", satisfaction: "4.6", custChange: "+10.1%", newChange: "+12.8%", retChange: "+4.5%", satChange: "+0.2" },
  "3month": { totalCust: "14,860", newCust: "2,104", returning: "63%", satisfaction: "4.5", custChange: "+12.6%", newChange: "+16.4%", retChange: "+2.8%", satChange: "-0.2" },
  custom: { totalCust: "1,284", newCust: "186", returning: "62%", satisfaction: "4.6", custChange: "+8.3%", newChange: "+14.2%", retChange: "+3.1%", satChange: "-0.1" },
};

const CUSTOMER_TYPE_BY_PERIOD: Record<string, { name: string; value: number; fill: string }[]> = {
  today: [{ name: "Returning", value: 58, fill: "#3b82f6" }, { name: "New", value: 42, fill: "#22c55e" }],
  week: [{ name: "Returning", value: 62, fill: "#3b82f6" }, { name: "New", value: 38, fill: "#22c55e" }],
  month: [{ name: "Returning", value: 65, fill: "#3b82f6" }, { name: "New", value: 35, fill: "#22c55e" }],
  "3month": [{ name: "Returning", value: 63, fill: "#3b82f6" }, { name: "New", value: 37, fill: "#22c55e" }],
  custom: [{ name: "Returning", value: 62, fill: "#3b82f6" }, { name: "New", value: 38, fill: "#22c55e" }],
};

const VISIT_FREQUENCY_BY_PERIOD: Record<string, { visits: string; customers: number }[]> = {
  today: [
    { visits: "1x", customers: 34 }, { visits: "2-3x", customers: 26 },
    { visits: "4-6x", customers: 14 }, { visits: "7-10x", customers: 6 }, { visits: "10x+", customers: 2 },
  ],
  week: [
    { visits: "1x", customers: 486 }, { visits: "2-3x", customers: 384 },
    { visits: "4-6x", customers: 228 }, { visits: "7-10x", customers: 124 }, { visits: "10x+", customers: 62 },
  ],
  month: [
    { visits: "1x", customers: 1792 }, { visits: "2-3x", customers: 1536 },
    { visits: "4-6x", customers: 1024 }, { visits: "7-10x", customers: 512 }, { visits: "10x+", customers: 256 },
  ],
  "3month": [
    { visits: "1x", customers: 5202 }, { visits: "2-3x", customers: 4158 },
    { visits: "4-6x", customers: 2972 }, { visits: "7-10x", customers: 1636 }, { visits: "10x+", customers: 892 },
  ],
  custom: [
    { visits: "1x", customers: 486 }, { visits: "2-3x", customers: 384 },
    { visits: "4-6x", customers: 228 }, { visits: "7-10x", customers: 124 }, { visits: "10x+", customers: 62 },
  ],
};

const PARTY_SIZE = [
  { size: "1", pct: 8 }, { size: "2", pct: 32 },
  { size: "3-4", pct: 38 }, { size: "5-6", pct: 15 },
  { size: "7+", pct: 7 },
];

const HOURLY_TRAFFIC = [
  { hour: "8", customers: 12 }, { hour: "9", customers: 28 },
  { hour: "10", customers: 45 }, { hour: "11", customers: 82 },
  { hour: "12", customers: 120 }, { hour: "13", customers: 105 },
  { hour: "14", customers: 52 }, { hour: "15", customers: 28 },
  { hour: "16", customers: 18 }, { hour: "17", customers: 48 },
  { hour: "18", customers: 98 }, { hour: "19", customers: 135 },
  { hour: "20", customers: 110 }, { hour: "21", customers: 65 },
  { hour: "22", customers: 22 },
];

export function CustomerAnalysisView() {
  const [period, setPeriod] = useState<Period>("week");
  const tc = useThemeClasses();
  const themedTooltip = tc.tooltipStyle;

  const kpis = KPI_BY_PERIOD[period];
  const customerType = CUSTOMER_TYPE_BY_PERIOD[period];
  const visitFrequency = VISIT_FREQUENCY_BY_PERIOD[period];
  const peakHour = HOURLY_TRAFFIC.reduce((a, b) => (a.customers > b.customers ? a : b));
  const returningPct = customerType.find((d) => d.name === "Returning")?.value || 62;

  const kpiCards = useMemo(() => [
    { label: "Total Customers", value: kpis.totalCust, change: kpis.custChange, up: !kpis.custChange.startsWith("-"), icon: Users },
    { label: "New Customers", value: kpis.newCust, change: kpis.newChange, up: !kpis.newChange.startsWith("-"), icon: UserPlus },
    { label: "Returning Rate", value: kpis.returning, change: kpis.retChange, up: !kpis.retChange.startsWith("-"), icon: Repeat },
    { label: "Avg Satisfaction", value: kpis.satisfaction, change: kpis.satChange, up: !kpis.satChange.startsWith("-"), icon: Star },
  ], [kpis]);

  return (
    <div className="space-y-4">
      <DateFilterBar period={period} setPeriod={setPeriod} title="Customer Analysis" />

      <AnimatedContent animationKey={period} className="space-y-4">

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className={`${tc.card} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`w-4 h-4 ${tc.subtext}`} />
              <span className={`flex items-center gap-0.5 text-[0.8125rem] ${kpi.up ? "text-green-500" : "text-red-500"}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className={`text-[1.5rem] ${tc.heading}`}>{kpi.value}</p>
            <p className={`text-[0.8125rem] ${tc.subtext} mt-0.5`}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Traffic + Customer Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Hourly traffic */}
        <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
          <p className={`text-[1rem] ${tc.heading} mb-1`}>
            Most visitors come at <span className="text-blue-500">{peakHour.hour}:00</span>
          </p>
          <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>Customer traffic by hour</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={HOURLY_TRAFFIC} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs key="defs">
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} vertical={false} />
              <XAxis key="xaxis" dataKey="hour" tick={{ fontSize: 10, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={themedTooltip} />
              <Area key="area" type="monotone" dataKey="customers" stroke="#3b82f6" fill="url(#trafficGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Customer type donut */}
        <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
          <p className={`text-[1rem] ${tc.heading} mb-1`}>
            <span className="text-blue-500">{returningPct}%</span> of customers are returning!
          </p>
          <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>New vs Returning customers</p>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie data={customerType} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" nameKey="name" paddingAngle={3} strokeWidth={0} />
            </PieChart>
            <div className="flex-1 space-y-4">
              {customerType.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
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

      {/* Visit Frequency + Party Size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Visit frequency */}
        <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
          <h3 className={`text-[1rem] ${tc.heading} mb-4`}>Visit Frequency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visitFrequency} layout="vertical">
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} horizontal={false} />
              <XAxis key="xaxis" type="number" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" dataKey="visits" type="category" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} width={45} />
              <Tooltip key="tooltip" contentStyle={themedTooltip} />
              <Bar key="bar" dataKey="customers" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Party size */}
        <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
          <h3 className={`text-[1rem] ${tc.heading} mb-1`}>
            Groups of <span className="text-blue-500">3-4</span> are the most common!
          </h3>
          <p className={`text-[0.875rem] ${tc.subtext} mb-4`}>Party size distribution</p>
          <div className="space-y-3">
            {PARTY_SIZE.map((p) => (
              <div key={p.size}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[0.9375rem] ${tc.text2}`}>{p.size} guests</span>
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
