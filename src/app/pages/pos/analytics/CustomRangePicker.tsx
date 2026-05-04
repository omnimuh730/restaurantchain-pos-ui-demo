import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useThemeClasses } from "../theme-context";

export type DateRange = { start: Date; end: Date };

interface CustomRangePickerProps {
  open: boolean;
  onClose: () => void;
  onApply: (range: DateRange) => void;
  initial?: DateRange | null;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function inRange(d: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const t = d.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function CustomRangePicker({ open, onClose, onApply, initial }: CustomRangePickerProps) {
  const tc = useThemeClasses();
  const [viewYear, setViewYear] = useState(() => (initial?.start ?? new Date(2026, 3, 1)).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (initial?.start ?? new Date(2026, 3, 1)).getMonth());
  const [start, setStart] = useState<Date | null>(initial?.start ?? null);
  const [end, setEnd] = useState<Date | null>(initial?.end ?? null);

  useEffect(() => {
    if (open) {
      setStart(initial?.start ?? null);
      setEnd(initial?.end ?? null);
    }
  }, [open, initial]);

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const result: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(new Date(viewYear, viewMonth, d));
    return result;
  }, [viewYear, viewMonth]);

  const handleClick = (d: Date) => {
    if (!start || (start && end)) {
      setStart(d);
      setEnd(null);
    } else if (d.getTime() < start.getTime()) {
      setStart(d);
    } else {
      setEnd(d);
    }
  };

  const navigate = (dir: -1 | 1) => {
    let m = viewMonth + dir, y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m); setViewYear(y);
  };

  const presets: { label: string; getRange: () => DateRange }[] = [
    {
      label: "Last 1 Week",
      getRange: () => {
        const today = new Date();
        const lastSat = new Date(today);
        lastSat.setHours(0, 0, 0, 0);
        lastSat.setDate(today.getDate() - today.getDay() - 1);
        const lastSun = new Date(lastSat);
        lastSun.setDate(lastSat.getDate() - 6);
        return { start: lastSun, end: lastSat };
      },
    },
    {
      label: "Last 2 weeks",
      getRange: () => {
        const today = new Date();
        const lastSat = new Date(today);
        lastSat.setHours(0, 0, 0, 0);
        lastSat.setDate(today.getDate() - today.getDay() - 1);
        const start = new Date(lastSat);
        start.setDate(lastSat.getDate() - 13);
        return { start, end: lastSat };
      },
    },
    {
      label: "This Month",
      getRange: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { start, end };
      },
    },
    {
      label: "Last Month",
      getRange: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start, end };
      },
    },
  ];

  const fmt = (d: Date | null) => d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  const canApply = start && end;
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className={`${tc.card} rounded-2xl w-full max-w-[520px] overflow-hidden shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between px-5 py-4 border-b ${tc.border}`}>
              <div>
                <h3 className={`text-[1rem] ${tc.heading}`}>Select date range</h3>
                <p className={`text-[0.875rem] ${tc.subtext} mt-0.5`}>{fmt(start)} — {fmt(end)}</p>
              </div>
              <button onClick={onClose} className={`p-1.5 rounded-full cursor-pointer transition-colors ${tc.hover}`}>
                <X className={`w-4 h-4 ${tc.subtext}`} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 px-5 pt-4">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { const r = p.getRange(); setStart(r.start); setEnd(r.end); setViewMonth(r.end.getMonth()); setViewYear(r.end.getFullYear()); }}
                  className={`px-2.5 py-1 rounded-full text-[0.8125rem] cursor-pointer transition-colors ${tc.hover} ${tc.subtext} border ${tc.border}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => navigate(-1)} className={`p-1.5 rounded-full cursor-pointer transition-colors ${tc.hover}`}>
                  <ChevronLeft className={`w-4 h-4 ${tc.subtext}`} />
                </button>
                <span className={`text-[0.9375rem] ${tc.heading}`}>{monthLabel}</span>
                <button onClick={() => navigate(1)} className={`p-1.5 rounded-full cursor-pointer transition-colors ${tc.hover}`}>
                  <ChevronRight className={`w-4 h-4 ${tc.subtext}`} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((w, i) => (
                  <div key={`wh-${i}`} className={`text-center text-[0.75rem] ${tc.subtext} py-1`}>{w}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                  if (!d) return <div key={`e-${i}`} className="aspect-square" />;
                  const isStart = start && sameDay(d, start);
                  const isEnd = end && sameDay(d, end);
                  const isIn = inRange(d, start, end);
                  const isEndpoint = isStart || isEnd;
                  const isToday = sameDay(d, new Date());
                  return (
                    <button
                      key={`d-${d.getTime()}`}
                      onClick={() => handleClick(d)}
                      className={`aspect-square rounded-lg text-[0.875rem] cursor-pointer transition-colors border-2 ${
                        isToday ? (tc.isDark ? "border-white" : "border-slate-900") : "border-transparent"
                      } ${
                        isEndpoint
                          ? "bg-blue-600 text-white"
                          : isIn
                            ? tc.isDark ? "bg-blue-800/40 text-blue-100" : "bg-blue-100 text-blue-800"
                            : `${tc.subtext} ${tc.hover}`
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 px-5 py-3 border-t ${tc.border}`}>
              <button onClick={onClose} className={`px-3 py-1.5 rounded-full text-[0.875rem] cursor-pointer transition-colors ${tc.subtext} ${tc.hover}`}>
                Cancel
              </button>
              <button
                onClick={() => { if (canApply) { onApply({ start: start!, end: end! }); onClose(); } }}
                disabled={!canApply}
                className={`px-4 py-1.5 rounded-full text-[0.875rem] cursor-pointer transition-colors ${
                  canApply ? "bg-blue-600 text-white hover:bg-blue-700" : `${tc.isDark ? "bg-slate-700" : "bg-slate-200"} ${tc.subtext} cursor-not-allowed`
                }`}
              >
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
