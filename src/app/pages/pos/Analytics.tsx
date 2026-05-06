import { useState, useEffect, useRef, useMemo, type FC } from "react";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "./theme-context";
import { AnalyticsSidebar, type AnalyticsSection } from "./analytics/AnalyticsSidebar";
import { DashboardView } from "./analytics/DashboardView";
import { MenuAnalysisView } from "./analytics/MenuAnalysisView";
import { CustomerAnalysisView } from "./analytics/CustomerAnalysisView";
import { HistoryView } from "./analytics/HistoryView";
import { AnalyticsCurrencyProvider } from "./analytics/currency";

const SECTION_COMPONENTS: Record<AnalyticsSection, FC> = {
  dashboard: DashboardView,
  "menu-analysis": MenuAnalysisView,
  "customer-analysis": CustomerAnalysisView,
  history: HistoryView,
};

export default function Analytics() {
  const { t } = useTranslation("analytics");
  const sectionTitle = useMemo(
    (): Record<AnalyticsSection, string> => ({
      dashboard: t("titles.dashboard"),
      "menu-analysis": t("titles.menuAnalysis"),
      "customer-analysis": t("titles.customerAnalysis"),
      history: t("titles.history"),
    }),
    [t],
  );
  const [activeSection, setActiveSection] = useState<AnalyticsSection>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const tc = useThemeClasses();

  const ActiveView = SECTION_COMPONENTS[activeSection];

  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const BASE = 900;
    const MIN_SCALE = 1;
    const update = () => {
      const w = el.clientWidth;
      if (!w) return;
      const s = Math.min(1, Math.max(MIN_SCALE, w / BASE));
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <AnalyticsCurrencyProvider>
    <div className={`flex-1 min-h-0 h-full flex ${tc.page}`}>
      {/* Sidebar */}
      <AnalyticsSidebar
        active={activeSection}
        onSelect={setActiveSection}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div ref={contentRef} className="flex-1 min-w-0 min-h-0 flex flex-col h-full overflow-hidden">
        {/* Mobile header */}
        <div className={`sm:hidden flex items-center gap-3 px-4 py-3 border-b ${tc.border} ${tc.raised} shrink-0 sticky top-0 z-10`}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label={t("sidebar.openMenuAria")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
              tc.isDark ? "hover:bg-slate-700 text-slate-200" : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className={`text-[1.125rem] ${tc.heading} truncate`}>{sectionTitle[activeSection]}</h1>
          <div className="ml-auto"></div>
        </div>

        {/* Desktop header with currency toggle */}
        <div className={`hidden sm:flex items-center justify-between gap-3 px-5 py-3 border-b ${tc.border} ${tc.raised} shrink-0`}>
          <h1 className={`text-[1.125rem] ${tc.heading}`}>{sectionTitle[activeSection]}</h1>
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-4 sm:p-5" style={{ zoom: scale }}>
          <ActiveView />
        </div>
      </div>
    </div>
    </AnalyticsCurrencyProvider>
  );
}
