import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";

export type ActiveRole = "Admin" | "Cashier" | "Chef" | "Waiter";

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
  role: ActiveRole;
  setRole: (r: ActiveRole) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
  role: "Admin",
  setRole: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [role, setRole] = useState<ActiveRole>("Admin");
  const toggle = useCallback(() => setIsDark((d) => !d), []);
  const value = useMemo(
    () => ({ isDark, toggle, role, setRole }),
    [isDark, toggle, role]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Role → permitted nav‑item ids.
 * Matches the ROLE_DEFAULTS permission map from settings/data.ts.
 * "Admin" has access to everything including analytics.
 */
export const ROLE_NAV_ACCESS: Record<ActiveRole, string[]> = {
  Admin: ["floor-plan", "orders", "kitchen", "analytics", "settings"],
  Cashier: ["floor-plan", "orders", "kitchen", "settings"], // floor-plan, orders, kitchen + settings(password)
  Waiter: ["orders", "kitchen", "settings"],       // orders, kitchen + settings(password)
  Chef: ["kitchen", "settings"],                    // kitchen + settings(password)
};

/** Returns commonly used themed class strings for POS pages */
function buildThemeClasses(isDark: boolean) {
  return {
    isDark,
    // Page backgrounds
    page: isDark ? "text-gray-100" : "text-gray-900",
    pageBg: "transparent",
    // Card / panel
    card: isDark
      ? "bg-[#2a2d35] border border-gray-700"
      : "bg-white border border-gray-200 shadow-sm",
    cardBg: isDark ? "#2a2d35" : "#ffffff",
    cardBorder: isDark ? "border-gray-700" : "border-gray-200",
    // Raised / header surfaces
    raised: isDark ? "bg-[#1e2028]" : "bg-white",
    raisedBg: isDark ? "#1e2028" : "#ffffff",
    // Input / surface
    surface: isDark ? "bg-[#3a3f4d]" : "bg-gray-100",
    surfaceBg: isDark ? "#3a3f4d" : "#f3f4f6",
    input: [
      "w-full px-3 py-2 rounded-lg border text-[0.8125rem] outline-none",
      "focus:border-blue-500",
      isDark
        ? "border-gray-700 bg-[#3a3f4d] text-gray-100 placeholder:text-gray-500"
        : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400",
    ].join(" "),
    // Text
    heading: isDark ? "text-gray-100" : "text-gray-900",
    text1: isDark ? "text-gray-100" : "text-gray-900",
    text2: isDark ? "text-gray-200" : "text-gray-800",
    subtext: isDark ? "text-gray-400" : "text-gray-500",
    muted: isDark ? "text-gray-500" : "text-gray-400",
    // Borders & hover
    border: isDark ? "border-gray-700" : "border-gray-200",
    borderHalf: isDark ? "border-gray-700/50" : "border-gray-200",
    hover: isDark ? "hover:bg-[#3a3f4d]" : "hover:bg-gray-100",
    hoverBg: isDark ? "#3a3f4d" : "#f3f4f6",
    // Overlays
    overlay: isDark ? "bg-black/60" : "bg-black/40",
    modalBg: isDark ? "bg-[#2a2d35] border-gray-700" : "bg-white border-gray-200",
    drawerBg: isDark ? "bg-[#2a2d35] border-gray-700" : "bg-white border-gray-200",
    // Navigation
    activeNav: isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-50 text-blue-600",
    inactiveNav: isDark
      ? "text-gray-400 hover:text-gray-200 hover:bg-[#3a3f4d]"
      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
    // Badges / chips
    badge: isDark ? "bg-[#3a3f4d] text-gray-400" : "bg-gray-100 text-gray-500",
    iconBg: isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-700",
    disabledIconBg: isDark ? "bg-[#3a3f4d] text-gray-600" : "bg-gray-200 text-gray-500",
    // Sections
    sectionBg: isDark ? "bg-[#1a1a2e]" : "bg-gray-50",
    dangerBg: isDark ? "bg-red-900/10 border-red-700/30" : "bg-red-50 border-red-200",
    dangerText: isDark ? "text-red-400" : "text-red-600",
    warningBg: isDark
      ? "bg-amber-900/20 border-amber-700/30 text-amber-400"
      : "bg-amber-50 border-amber-200 text-amber-700",
    // Buttons
    btnSecondary: isDark
      ? "border border-gray-600 text-gray-300 hover:bg-[#3a3f4d]"
      : "border border-gray-300 text-gray-700 hover:bg-gray-100",
    dotBorder: isDark ? "border-[#2a2d35]" : "border-white",
    // Chart / tooltip styles
    tooltipStyle: isDark
      ? { backgroundColor: "#2a2d35", border: "1px solid #4b5563", borderRadius: 8, fontSize: 12, color: "#e5e7eb" }
      : { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#1f2937" },
    gridStroke: isDark ? "#374151" : "#e5e7eb",
    tickFill: isDark ? "#9ca3af" : "#6b7280",
    // Search input specific
    searchInput: isDark
      ? "bg-[#3a3f4d] border border-transparent text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
      : "bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500",
    // Dropdown / select
    dropdown: isDark
      ? "bg-[#2a2d35] border border-gray-700 shadow-xl"
      : "bg-white border border-gray-200 shadow-lg",
    dropdownItem: isDark
      ? "text-gray-300 hover:bg-[#3a3f4d]"
      : "text-gray-700 hover:bg-gray-100",
    dropdownItemActive: isDark
      ? "bg-blue-600/20 text-blue-400"
      : "bg-blue-50 text-blue-600",
  };
}

const THEME_CLASSES_DARK = buildThemeClasses(true);
const THEME_CLASSES_LIGHT = buildThemeClasses(false);

export function useThemeClasses() {
  const { isDark } = useTheme();
  return isDark ? THEME_CLASSES_DARK : THEME_CLASSES_LIGHT;
}
