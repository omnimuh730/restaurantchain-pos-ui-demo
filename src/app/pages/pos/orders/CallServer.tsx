import { useState, useEffect } from "react";
import { Bell, BellRing, X, Clock, MapPin, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useThemeClasses } from "../theme-context";
import { useNavBadges } from "../NavBadgeContext";

function fmtAgo(ts: number): string {
  const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function CallServerButton() {
  const tc = useThemeClasses();
  const { serverCalls, removeCall, clearCalls } = useNavBadges();
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);

  // Refresh "time ago" every 15s while open
  useEffect(() => {
    if (!open) return;
    const i = setInterval(() => setTick((n) => n + 1), 15000);
    return () => clearInterval(i);
  }, [open]);

  const hasCalls = serverCalls.length > 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={hasCalls ? `${serverCalls.length} server calls` : "No server calls"}
        className={`relative flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-colors border ${
          hasCalls
            ? tc.isDark
              ? "bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700"
              : "bg-white border-slate-200 text-blue-600 hover:bg-slate-50"
            : tc.isDark
              ? "bg-slate-700 border-transparent hover:bg-slate-600 text-slate-300"
              : "bg-slate-100 border-transparent hover:bg-slate-200 text-slate-600"
        }`}
      >
        {hasCalls ? (
          <motion.div
            animate={{ rotate: [0, -18, 18, -12, 12, -6, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
          >
            <BellRing className="w-4 h-4" />
          </motion.div>
        ) : (
          <Bell className="w-4 h-4" />
        )}
        {hasCalls && (
          <>
            <motion.span
              className="absolute inset-0 rounded-lg"
              style={{ background: "rgb(37 99 235 / 0.45)" }}
              animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center">
              {serverCalls.length}
            </span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: tc.isDark ? "rgba(8,12,20,0.6)" : "rgba(15,23,42,0.45)" }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className={`relative w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl ${tc.card} overflow-hidden shadow-2xl flex flex-col`}
              style={{ maxHeight: "75vh" }}
            >
              <div className={`flex items-center gap-2 px-4 py-3 border-b ${tc.cardBorder} shrink-0`}>
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <BellRing className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[0.9375rem] ${tc.heading}`}>Server Calls</p>
                  <p className={`text-[0.75rem] ${tc.subtext}`}>
                    {hasCalls ? `${serverCalls.length} ${serverCalls.length === 1 ? "table is" : "tables are"} calling` : "No active calls"}
                  </p>
                </div>
                {hasCalls && (
                  <button
                    onClick={clearCalls}
                    className={`text-[0.75rem] px-2 py-1 rounded cursor-pointer ${tc.hover} ${tc.subtext}`}
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className={`p-1.5 rounded cursor-pointer ${tc.hover}`}
                  aria-label="Close"
                >
                  <X className={`w-4 h-4 ${tc.text1}`} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {!hasCalls ? (
                  <div className={`px-6 py-12 text-center ${tc.muted}`}>
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-[0.875rem]">No tables are calling right now.</p>
                    <p className="text-[0.75rem] mt-1">Guests can call you from their mobile app.</p>
                  </div>
                ) : (
                  <ul className="py-1">
                    <AnimatePresence initial={false}>
                      {serverCalls.map((c) => (
                        <motion.li
                          key={c.id}
                          layout
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                          className={`px-4 py-3 border-b ${tc.cardBorder} last:border-b-0 flex items-start gap-3`}
                        >
                          <div className={`w-9 h-9 rounded-lg ${tc.isDark ? "bg-slate-800" : "bg-slate-100"} flex items-center justify-center shrink-0`}>
                            <MapPin className={`w-4 h-4 ${tc.subtext}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[0.875rem] ${tc.heading}`}>{c.tableLabel}</span>
                              <span className="text-[0.6875rem] px-1.5 py-0.5 rounded bg-blue-600/15 text-blue-600 dark:text-blue-400">called you</span>
                            </div>
                            {c.message && (
                              <p className={`text-[0.8125rem] ${tc.text1} mt-0.5 truncate`}>{c.message}</p>
                            )}
                            <p className={`text-[0.6875rem] ${tc.muted} mt-0.5 flex items-center gap-1`}>
                              <Clock className="w-3 h-3" /> {fmtAgo(c.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeCall(c.id)}
                            className={`p-1.5 rounded cursor-pointer ${tc.hover} shrink-0`}
                            aria-label="Remove call"
                            title="Remove"
                          >
                            <Trash2 className={`w-4 h-4 ${tc.subtext}`} />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
