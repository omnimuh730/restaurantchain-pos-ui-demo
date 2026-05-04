import { useMemo, useState } from "react";
import { CalendarRange } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { CustomRangePicker, type DateRange } from "./CustomRangePicker";

export type Period = "today" | "week" | "month" | "3month" | "custom";

interface DateFilterBarProps {
  period: Period;
  setPeriod: (p: Period) => void;
  title?: string;
  onRangeChange?: (range: DateRange | null) => void;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function fmtDate(d: Date) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}.${day}.${year}`;
}

export function DateFilterBar({ period, setPeriod, title, onRangeChange }: DateFilterBarProps) {
  const { t } = useTranslation();
  const tc = useThemeClasses();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [range, setRange] = useState<DateRange | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const today = useMemo(() => new Date(), []);

  // Generate a strip of the last 14 days, ending with today.
  const days = useMemo(() => {
    const sunday = new Date(today);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(today.getDate() - today.getDay());
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [today]);

  const weekdayFmt = new Intl.DateTimeFormat("ko-KR", { weekday: "short" });

  const selectDay = (d: Date) => {
    setSelectedDate(d);
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);
    const r = { start, end };
    setRange(r);
    setPeriod(isSameDay(d, today) ? "today" : "custom");
    onRangeChange?.(r);
  };

  const openCustom = () => setPickerOpen(true);

  const customActive = period === "custom" && range && !(isSameDay(range.start, range.end) && days.some((d) => isSameDay(d, range.start)));

  const dateDisplay =
    customActive && range
      ? `${fmtDate(range.start)} - ${fmtDate(range.end)}`
      : isSameDay(selectedDate, today)
        ? t("analytics.dateFilter.today")
        : fmtDate(selectedDate);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div className="flex flex-col items-center gap-1 w-full sm:w-auto min-w-0 mx-auto">
        <div className={`flex items-center justify-center gap-4 overflow-x-auto no-scrollbar p-1.5 w-full sm:w-auto mx-auto`}>
          {days.map((d) => {
            const isToday = isSameDay(d, today);
            const isSelected = isSameDay(d, selectedDate) && !customActive;
            return (
              <div key={d.toISOString()} className="flex flex-col items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isToday ? (tc.isDark ? "bg-white" : "bg-slate-900") : "bg-transparent"}`} />
                <button
                  onClick={() => selectDay(d)}
                  className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors border-2 ${
                    isSelected
                      ? tc.isDark
                        ? "bg-transparent text-white border-white"
                        : "bg-transparent text-slate-900 border-slate-900"
                      : tc.isDark
                        ? `bg-transparent text-slate-400 ${tc.hover} border-slate-600`
                        : `bg-transparent text-slate-500 ${tc.hover} border-slate-300`
                  }`}
                  title={d.toDateString()}
                >
                  <span className="uppercase tracking-wider text-[14px]">
                    {weekdayFmt.format(d).charAt(0)}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={openCustom}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full cursor-pointer transition-colors text-[0.8125rem] ${
            customActive ? "bg-blue-600 text-white" : `${tc.card} ${tc.subtext} ${tc.hover}`
          }`}
        >
          <CalendarRange className="w-4 h-4" />
          <span className="whitespace-nowrap">{dateDisplay}</span>
        </button>
      </div>

      <CustomRangePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onApply={(r) => { setRange(r); setPeriod("custom"); onRangeChange?.(r); }}
        initial={range}
      />
    </div>
  );
}
