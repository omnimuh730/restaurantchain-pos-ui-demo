import { startTransition, useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useNavigation } from "react-router";
import {
  FloorPlanSkeleton,
  OrdersSkeleton,
  KitchenSkeleton,
  AnalyticsSkeleton,
  SettingsSkeleton,
  PaymentSkeleton,
  PageSkeleton,
} from "./components/Skeletons";
import {
  LayoutGrid, Sun, Moon,
  ChevronDown, Wallet, UserCheck, ShieldCheck, Lock, ChefHat,
} from "lucide-react";
import { ThemeProvider, useTheme, ROLE_NAV_ACCESS, type ActiveRole } from "./theme-context";
import { NavBadgeProvider, useNavBadges } from "./NavBadgeContext";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";
import {
  AnalyticsFilled, FloorPlanFilled, OrdersFilled, KitchenFilled, SettingsFilled,
} from "./components/NavIcons";

const NAV_IDS = ["analytics", "floor-plan", "orders", "kitchen", "settings"] as const;

const NAV_ICONS: Record<(typeof NAV_IDS)[number], typeof AnalyticsFilled> = {
  analytics: AnalyticsFilled,
  "floor-plan": FloorPlanFilled,
  orders: OrdersFilled,
  kitchen: KitchenFilled,
  settings: SettingsFilled,
};

const ROLE_OPTIONS: { role: ActiveRole; icon: typeof ShieldCheck }[] = [
  { role: "Admin", icon: ShieldCheck },
  { role: "Cashier", icon: Wallet },
  { role: "Chef", icon: ChefHat },
  { role: "Waiter", icon: UserCheck },
];

function RouteOutlet() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const targetPath = (navigation.location?.pathname ?? "").replace(/^\/pos\/?/, "").split("/")[0] || "";
  if (isLoading) {
    switch (targetPath) {
      case "": return <FloorPlanSkeleton />;
      case "orders": return <OrdersSkeleton />;
      case "kitchen": return <KitchenSkeleton />;
      case "analytics": return <AnalyticsSkeleton />;
      case "settings": return <SettingsSkeleton />;
      case "payment": return <PaymentSkeleton />;
      default: return <PageSkeleton />;
    }
  }
  return <Outlet />;
}

function POSLayoutInner() {
  const { t } = useTranslation(["pos", "common"]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle: toggleTheme, role: currentRole, setRole: setCurrentRole } = useTheme();
  const { badges } = useNavBadges();
  const mergedBadges: Record<string, number> = { ...badges };

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activePath = location.pathname.replace(/^\/pos\/?/, "").split("/")[0] || "";

  // Filter nav items based on role
  const allowedNav = useMemo(
    () =>
      NAV_IDS.filter((id) => ROLE_NAV_ACCESS[currentRole].includes(id)).map((id) => ({
        id,
        label: t(`pos:nav.${id}`),
        icon: NAV_ICONS[id],
      })),
    [currentRole, t],
  );

  // Redirect to first allowed page when role changes and current page isn't accessible
  useEffect(() => {
    const allowed = ROLE_NAV_ACCESS[currentRole];
    if (!allowed.includes(activePath)) {
      const first = allowed[0];
      const to = `/pos/${first}`;
      startTransition(() => navigate(to, { replace: true }));
    }
  }, [currentRole]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentRoleOption = ROLE_OPTIONS.find((r) => r.role === currentRole)!;
  const RoleIcon = currentRoleOption.icon;

  return (
    <div
      className="h-screen overflow-hidden flex flex-col transition-colors duration-200"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #141A22 0%, #0B0F14 100%)"
          : "linear-gradient(180deg, #e2e8f0 0%, #f8fafc 100%)",
      }}
    >
      {/* ── Top Header — 64px ── */}
      <header
        className="h-16 flex items-center justify-between px-4 sm:px-5 shrink-0 z-50 transition-colors duration-200"
        style={{
          background: "transparent",
          borderBottom: isDark ? "1px solid #222C38" : "1px solid #cbd5e1",
        }}
      >
        {/* Left: Logo + Restaurant Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="text-[0.9375rem] tracking-tight"
              style={{ color: isDark ? "#e5e7eb" : "#1e293b" }}
            >
              {t("pos:brandName")}
            </span>
            <span
              className="text-[0.625rem] tracking-wider uppercase"
              style={{ color: isDark ? "#4A5463" : "#94a3b8" }}
            >
              {t("pos:brandSubtitle")}
            </span>
          </div>
        </div>

        {/* Right: Theme toggle + Lock + Role selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Lock button */}
          <button
            onClick={() => navigate("/lock", { state: { name: "Admin", username: "admin" } })}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            style={{
              color: isDark ? "#9ca3af" : "#64748b",
              background: isDark ? "rgba(58,63,77,0.5)" : "rgba(241,245,249,1)",
            }}
            title={t("pos:lockScreen")}
          >
            <Lock className="w-5 h-5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            style={{
              color: isDark ? "#9ca3af" : "#64748b",
              background: isDark ? "rgba(58,63,77,0.5)" : "rgba(241,245,249,1)",
            }}
            title={isDark ? t("pos:themeLight") : t("pos:themeDark")}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Role selector dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 rounded-xl cursor-pointer transition-colors"
              style={{
                background: isDark ? "rgba(58,63,77,0.5)" : "rgba(241,245,249,1)",
                color: isDark ? "#e5e7eb" : "#334155",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)",
                  color: "#3b82f6",
                }}
              >
                <RoleIcon className="w-4 h-4" />
              </div>
              <span className="text-[0.8125rem] hidden sm:block">{t(`pos:roles.${currentRole}`)}</span>
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{
                  color: isDark ? "#6b7280" : "#94a3b8",
                  transform: roleDropdownOpen ? "rotate(180deg)" : undefined,
                }}
              />
            </button>

            {/* Dropdown */}
            {roleDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50 shadow-xl"
                style={{
                  background: isDark ? "#2a2d35" : "#ffffff",
                  border: isDark ? "1px solid #374151" : "1px solid #e2e8f0",
                }}
              >
                <div
                  className="px-3.5 py-2.5 text-[0.6875rem] uppercase tracking-wider"
                  style={{ color: isDark ? "#6b7280" : "#94a3b8" }}
                >
                  {t("pos:switchRole")}
                </div>
                {ROLE_OPTIONS.map(({ role, icon: Icon }) => {
                  const isActive = currentRole === role;
                  const permCount = ROLE_NAV_ACCESS[role].length;
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 text-[0.8125rem] cursor-pointer transition-colors"
                      style={{
                        background: isActive
                          ? isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.06)"
                          : "transparent",
                        color: isActive
                          ? "#3b82f6"
                          : isDark ? "#d1d5db" : "#475569",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            isDark ? "rgba(58,63,77,0.6)" : "rgba(241,245,249,1)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: isActive
                            ? isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)"
                            : isDark ? "rgba(58,63,77,0.8)" : "rgba(241,245,249,1)",
                          color: isActive ? "#3b82f6" : isDark ? "#9ca3af" : "#64748b",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col items-start gap-0.5">
                        <span>{t(`pos:roles.${role}`)}</span>
                        <span
                          className="text-[0.5625rem]"
                          style={{ color: isDark ? "#6b7280" : "#94a3b8" }}
                        >
                          {t("pos:pageCount", { count: permCount })}
                        </span>
                      </div>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden pb-20">
        <RouteOutlet />
      </main>

      {/* Bottom navigation bar — 80px */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 h-20 flex items-stretch transition-colors duration-200"
        style={{
          background: isDark ? "#0B0F14" : "#ffffff",
          borderTop: isDark ? "1px solid #222C38" : "1px solid #cbd5e1",
        }}
      >
        {allowedNav.map(({ id, label, icon: Icon }) => {
          const isActive = activePath === id;
          const to = `/pos/${id}`;
          const badgeCount = mergedBadges[id] ?? 0;
          return (
            <button
              key={id}
              onClick={() => startTransition(() => navigate(to))}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
              style={{
                color: isActive
                  ? isDark ? "#ffffff" : "#000000"
                  : isDark ? "#4A5463" : "#94a3b8",
              }}
            >
              <span className="relative inline-flex">
                <Icon className="w-6 h-6" />
                {badgeCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "#2563eb" }}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </span>
              <span className="text-[0.6875rem] leading-tight">{label}</span>
            </button>
          );
        })}
      </nav>

      <Toaster position="top-right" richColors closeButton offset={44} />
      <ToastClearAll />
    </div>
  );
}

function ToastClearAll() {
  const { t } = useTranslation("common");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const recount = () => {
      const list = document.querySelectorAll("[data-sonner-toast]");
      setCount(list.length);
    };
    recount();
    const obs = new MutationObserver(recount);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  if (count < 2) return null;

  return (
    <button
      onClick={() => toast.dismiss()}
      style={{
        zIndex: 2147483647,
        pointerEvents: "auto",
        background: "linear-gradient(135deg, rgba(219,234,254,0.55), rgba(191,219,254,0.45))",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(147,197,253,0.55)",
        boxShadow: "0 6px 18px -6px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.6)",
        color: "#1d4ed8",
      }}
      className="fixed right-5 top-2 px-3 py-[5px] rounded-full text-[0.6875rem] cursor-pointer hover:brightness-105 active:scale-95 transition-all"
      aria-label={t("clearAllAria")}
    >
      {t("clearAll")}
    </button>
  );
}

export default function POSLayout() {
  return (
    <ThemeProvider>
      <NavBadgeProvider>
        <POSLayoutInner />
      </NavBadgeProvider>
    </ThemeProvider>
  );
}