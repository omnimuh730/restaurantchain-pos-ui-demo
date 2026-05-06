import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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

function fmtDate(d: Date, calendarLocale: string) {
  return d.toLocaleDateString(calendarLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function DateFilterBar({ period, setPeriod, title: _unusedTitle, onRangeChange }: DateFilterBarProps) {
  const { t, i18n } = useTranslation("analytics");
  const resolved = i18n.resolvedLanguage ?? i18n.language;
  const calendarLocale = resolved.startsWith("ko") ? "ko-KR" : "en-US";
  const tc = useThemeClasses();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [range, setRange] = useState<DateRange | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const today = useMemo(() => new Date(), []);
  const [weekOffset, setWeekOffset] = useState(0);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);

  const days = useMemo(() => {
    const sunday = new Date(today);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [today, weekOffset]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) {
      setSlideDir(-1);
      setWeekOffset((o) => o - 1);
    } else {
      const nextSunday = new Date(days[0]);
      nextSunday.setDate(nextSunday.getDate() + 7);
      if (nextSunday <= today) {
        setSlideDir(1);
        setWeekOffset((o) => o + 1);
      }
    }
  };

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
      ? `${fmtDate(range.start, calendarLocale)}${t("date.rangeDash")}${fmtDate(range.end, calendarLocale)}`
      : isSameDay(selectedDate, today)
        ? t("date.today")
        : fmtDate(selectedDate, calendarLocale);

  void _unusedTitle;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div className="flex flex-col items-center gap-1 w-full sm:w-auto min-w-0 mx-auto">
        <div
          className="overflow-hidden w-full sm:w-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "pan-y" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={weekOffset}
              initial={{ x: slideDir * 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: slideDir * -60, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex items-center justify-center gap-4 p-1.5 w-full sm:w-auto mx-auto select-none"
            >
              {days.map((d) => {
                const isToday = isSameDay(d, today);
                const isSelected = isSameDay(d, selectedDate) && !customActive;
                const isFuture = d > today;
                const isCurrentWeek = weekOffset === 0;
                return (
                  <div key={d.toISOString()} className="flex flex-col items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isToday ? (tc.isDark ? "bg-white" : "bg-slate-900") : "bg-transparent"}`} />
                    <button
                      onClick={() => !isFuture && selectDay(d)}
                      disabled={isFuture}
                      className={`shrink-0 flex flex-col items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors border-2 ${
                        isFuture
                          ? tc.isDark
                            ? "bg-transparent text-slate-600 border-slate-700 cursor-not-allowed"
                            : "bg-transparent text-slate-300 border-slate-200 cursor-not-allowed"
                          : isSelected
                            ? tc.isDark
                              ? "bg-transparent text-white border-white"
                              : "bg-transparent text-slate-900 border-slate-900"
                            : tc.isDark
                              ? `bg-transparent text-slate-400 ${tc.hover} border-slate-600`
                              : `bg-transparent text-slate-500 ${tc.hover} border-slate-300`
                      }`}
                      title={d.toDateString()}
                    >
                      {isCurrentWeek ? (
                        <span className="text-[13px] leading-none font-medium">
                          {new Intl.DateTimeFormat(calendarLocale, { weekday: "narrow" }).format(d)}
                        </span>
                      ) : (
                        <span className="text-[13px] leading-none font-medium">
                          {d.getDate()}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={openCustom}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full cursor-pointer transition-colors text-[0.8125rem] ${
            customActive ? "bg-blue-600 text-white" : `${tc.card} ${tc.subtext} ${tc.hover}`
          }`}
        >
          <CalendarRange className="w-4 h-4" />
          <span className="whitespace-nowrap">
            {customActive && range
              ? isSameDay(range.start, range.end)
                ? fmtDate(range.start, calendarLocale)
                : `${fmtDate(range.start, calendarLocale)}${t("date.rangeDash")}${fmtDate(range.end, calendarLocale)}`
              : isSameDay(selectedDate, today)
                ? t("date.today")
                : fmtDate(selectedDate, calendarLocale)}
          </span>
        </button>
      </div>

      <CustomRangePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onApply={(r) => {
          setRange(r);
          setPeriod("custom");
          onRangeChange?.(r);

          // Navigate week view to the week containing the selected date
          const targetDate = r.start;
          const todaySunday = new Date(today);
          todaySunday.setHours(0, 0, 0, 0);
          todaySunday.setDate(today.getDate() - today.getDay());

          const targetSunday = new Date(targetDate);
          targetSunday.setHours(0, 0, 0, 0);
          targetSunday.setDate(targetDate.getDate() - targetDate.getDay());

          const diff = Math.round((targetSunday.getTime() - todaySunday.getTime()) / (7 * 24 * 60 * 60 * 1000));
          setSlideDir(diff >= 0 ? 1 : -1);
          setWeekOffset(diff);
          setSelectedDate(targetDate);
        }}
        initial={range}
      />
    </div>
  );
}
