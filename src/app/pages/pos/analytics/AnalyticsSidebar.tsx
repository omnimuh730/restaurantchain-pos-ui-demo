import { useEffect, useState } from "react";
import { BarChart3, UtensilsCrossed, Users, Settings2, History } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { POS_OVERLAY_BACKDROP, POS_OVERLAY_SHEET_LEFT } from "../posOverlayLayers";

export type AnalyticsSection = "dashboard" | "menu-analysis" | "customer-analysis" | "history";

interface AnalyticsSidebarProps {
  active: AnalyticsSection;
  onSelect: (s: AnalyticsSection) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function AnalyticsSidebar({ active, onSelect, isMobileOpen, onMobileClose }: AnalyticsSidebarProps) {
  const { t } = useTranslation("analytics");
  const tc = useThemeClasses();
  const [drawerIn, setDrawerIn] = useState(false);
  useEffect(() => {
    if (isMobileOpen) {
      requestAnimationFrame(() => requestAnimationFrame(() => setDrawerIn(true)));
    } else {
      setDrawerIn(false);
    }
  }, [isMobileOpen]);

  const sections: { id: AnalyticsSection; labelKey: string; icon: typeof BarChart3 }[] = [
    { id: "dashboard", labelKey: "sidebar.dashboard", icon: BarChart3 },
    { id: "menu-analysis", labelKey: "sidebar.menuAnalysis", icon: UtensilsCrossed },
    { id: "customer-analysis", labelKey: "sidebar.customerAnalysis", icon: Users },
    { id: "history", labelKey: "sidebar.history", icon: History },
  ];

  const sidebar = (
    <div className={`w-full h-full flex flex-col py-4 ${tc.isDark ? "bg-[#141820]" : "bg-white"}`}>
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Settings2 className={`w-4 h-4 ${tc.subtext}`} />
          <h2 className={`text-[1rem] ${tc.heading}`}>{t("sidebar.title")}</h2>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                onSelect(s.id);
                onMobileClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.9375rem] cursor-pointer transition-colors text-left ${
                isActive ? "bg-blue-600 text-white" : `${tc.subtext} ${tc.hover}`
              }`}
            >
              <s.icon className="w-4 h-4 shrink-0" />
              {t(s.labelKey as "sidebar.dashboard")}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <div className={`hidden sm:block w-[220px] shrink-0 border-r ${tc.border} h-full overflow-y-auto`}>
        {sidebar}
      </div>

      {isMobileOpen && (
        <>
          <div
            className={`${POS_OVERLAY_BACKDROP} bg-black/50 sm:hidden`}
            style={{ opacity: drawerIn ? 1 : 0 }}
            onClick={onMobileClose}
          />
          <div
            className={`${POS_OVERLAY_SHEET_LEFT} w-[260px] sm:hidden shadow-xl pb-20 ${
              tc.isDark ? "bg-[#141820]" : "bg-white"
            }`}
            style={{ transform: drawerIn ? "translateX(0)" : "translateX(-100%)" }}
          >
            {sidebar}
          </div>
        </>
      )}
    </>
  );
}
