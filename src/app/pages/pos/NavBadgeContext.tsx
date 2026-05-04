import { createContext, useContext, useState, useMemo, useCallback, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { BellRing, CalendarCheck, ChefHat, X as XIcon } from "lucide-react";
import { useTheme } from "./theme-context";
import { SAMPLE_RESERVATIONS } from "./floor-plan/data";
import { INITIAL_ORDERS } from "./kitchen/data";

type ToastKind = "floor";

const TOAST_ICON: Record<ToastKind, typeof CalendarCheck> = {
  floor: CalendarCheck,
};

const TOAST_GRAD: Record<ToastKind, string> = {
  floor: "from-blue-500 to-blue-700",
};
void ChefHat;
void BellRing;

function fmtNow() {
  return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

function RichToast({
  kind,
  title,
  desc,
  toastId,
  tag,
  dismissLabel,
}: {
  kind: ToastKind;
  title: string;
  desc?: string;
  toastId: string | number;
  tag: string;
  dismissLabel: string;
}) {
  const { isDark } = useTheme();
  const Icon = TOAST_ICON[kind];
  const grad = TOAST_GRAD[kind];

  const bg = isDark
    ? "linear-gradient(135deg, rgba(15,23,42,0.97), rgba(20,28,46,0.97))"
    : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(241,245,255,0.98))";

  return (
    <div
      className={`relative w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl backdrop-blur-xl ring-1 shadow-2xl ${
        isDark ? "ring-blue-400/25 shadow-blue-500/20" : "ring-blue-200 shadow-blue-500/10"
      }`}
      style={{ background: bg }}
    >
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${grad}`} />
      <div className={`pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${grad} ${isDark ? "opacity-20" : "opacity-10"} blur-2xl`} />
      <div className="relative flex items-start gap-3 p-3.5">
        <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2.25} />
          <span
            className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse ring-2 ${
              isDark ? "ring-[#0f172a]" : "ring-white"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[0.625rem] uppercase tracking-[0.12em] bg-gradient-to-r ${grad} bg-clip-text text-transparent`}>{tag}</span>
            <span className={`w-1 h-1 rounded-full ${isDark ? "bg-slate-600" : "bg-slate-300"}`} />
            <span className={`text-[0.625rem] tabular-nums ${isDark ? "text-slate-500" : "text-slate-400"}`}>{fmtNow()}</span>
          </div>
          <p className={`text-[0.875rem] leading-snug truncate ${isDark ? "text-slate-100" : "text-slate-900"}`}>{title}</p>
          {desc && <p className={`text-[0.75rem] mt-0.5 truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>{desc}</p>}
        </div>
        <button
          type="button"
          onClick={() => toast.dismiss(toastId)}
          className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
            isDark ? "text-slate-500 hover:text-slate-200 hover:bg-white/5" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          }`}
          aria-label={dismissLabel}
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

type NavId = "" | "orders" | "kitchen" | "analytics" | "settings";

export interface ServerCall {
  id: string;
  tableId: string;
  tableLabel: string;
  timestamp: number;
  message?: string;
}

export interface NotifyPrefs {
  floor: boolean;
  kitchen: boolean;
}

const SAMPLE_RESERVATION_GUEST_KEYS = ["parkJ", "leeS", "choiM", "kimM", "yoonA", "baekJ"] as const;

interface NavBadgeValue {
  badges: Partial<Record<NavId, number>>;
  setBadge: (id: NavId, n: number) => void;
  serverCalls: ServerCall[];
  prefs: NotifyPrefs;
  togglePref: (k: keyof NotifyPrefs) => void;
}

const INITIAL_BADGES: Partial<Record<NavId, number>> = {
  "": SAMPLE_RESERVATIONS.filter((r) => r.type === "request").length,
  kitchen: INITIAL_ORDERS.filter((o) => o.status === "received").length,
};

const NavBadgeContext = createContext<NavBadgeValue>({
  badges: {},
  setBadge: () => {},
  serverCalls: [],
  prefs: { floor: true, kitchen: true },
  togglePref: () => {},
});

export function NavBadgeProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { role } = useTheme();
  const notifiableRole = role === "Admin" || role === "Waiter" || role === "Cashier";
  const [badges, setBadges] = useState<Partial<Record<NavId, number>>>(INITIAL_BADGES);
  const [prefs, setPrefs] = useState<NotifyPrefs>({ floor: true, kitchen: true });

  const setBadge = useCallback((id: NavId, n: number) => {
    setBadges((prev) => (prev[id] === n ? prev : { ...prev, [id]: n }));
  }, []);
  const togglePref = useCallback((k: keyof NotifyPrefs) => {
    setPrefs((p) => ({ ...p, [k]: !p[k] }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const gk = SAMPLE_RESERVATION_GUEST_KEYS[Math.floor(Math.random() * SAMPLE_RESERVATION_GUEST_KEYS.length)];
      const guestName = t(`guests.${gk}`);
      const party = 2 + Math.floor(Math.random() * 5);
      const event = Math.random();
      let title = t("navToasts.reservationNew");
      let desc = t("navToasts.guestsCount", { guest: guestName, count: party });
      let bumpBadge = true;
      if (event < 0.34) {
        bumpBadge = false;
        title = t("navToasts.reservationCanceled");
        desc = t("navToasts.guestCanceled", { guest: guestName });
      } else if (event < 0.67) {
        bumpBadge = false;
        const hour = 17 + Math.floor(Math.random() * 4);
        const minute = Math.random() < 0.5 ? 0 : 30;
        const d = new Date();
        d.setHours(hour, minute, 0, 0);
        const newTime = d.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
        title = t("navToasts.reservationTimeUpdated");
        desc = t("navToasts.movedTo", { guest: guestName, time: newTime });
      }
      if (bumpBadge) {
        setBadges((prev) => ({ ...prev, "": (prev[""] ?? 0) + 1 }));
      }
      if (prefs.floor && notifiableRole) {
        toast.custom(
          (toastId) => (
            <RichToast
              kind="floor"
              toastId={toastId}
              title={title}
              desc={desc}
              tag={t("navToasts.floorTag")}
              dismissLabel={t("navToasts.dismiss")}
            />
          ),
          { duration: 5000 },
        );
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [prefs.floor, notifiableRole, t]);

  const value = useMemo(
    () => ({ badges, setBadge, serverCalls: [] as ServerCall[], prefs, togglePref }),
    [badges, setBadge, prefs, togglePref],
  );
  return <NavBadgeContext.Provider value={value}>{children}</NavBadgeContext.Provider>;
}

export function useNavBadges() {
  return useContext(NavBadgeContext);
}
