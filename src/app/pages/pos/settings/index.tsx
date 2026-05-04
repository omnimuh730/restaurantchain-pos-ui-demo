import { useState, useMemo } from "react";
import { Menu, Save, X, ChevronRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme, useThemeClasses } from "../theme-context";
import { GROUPS } from "./data";
import { GeneralSettings } from "./GeneralSettings";
import { MenuManagement } from "./MenuManagement";
import { AmenitiesSettings } from "./AmenitiesSettings";
import { SecurityPaymentsSettings } from "./SecurityPayments";
import { StaffSettings } from "./StaffSettings";
import { UpgradePlans } from "./UpgradePlans";

function SettingsInner() {
  const tc = useThemeClasses();
  const { isDark, role } = useTheme();
  const isAdmin = role === "Admin";
  const canManageMenu = isAdmin || role === "Cashier";

  // Admins see everything. Cashiers also see Menu Management. Others: Security only.
  const availableGroups = useMemo(
    () => {
      if (isAdmin) return GROUPS;
      if (canManageMenu) return GROUPS.filter((g) => g.id === "security" || g.id === "menu");
      return GROUPS.filter((g) => g.id === "security");
    },
    [isAdmin, canManageMenu],
  );

  const [active, setActive] = useState(isAdmin ? "general" : "security");
  const [saved, setSaved] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reset active tab when role changes
  if (!availableGroups.some((g) => g.id === active)) {
    setActive(availableGroups[0]?.id ?? "security");
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleSelectGroup = (id: string) => { setActive(id); setDrawerOpen(false); };

  const sidebarContent = (
    <div className="space-y-1">
      {availableGroups.map((g) => (
        <button
          key={g.id}
          onClick={() => handleSelectGroup(g.id)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
            active === g.id ? tc.activeNav : tc.inactiveNav
          }`}
        >
          <g.icon className="w-4 h-4 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[0.8125rem] truncate">{g.label}</p>
            <p className="text-[0.625rem] opacity-60 truncate">{g.description}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
        </button>
      ))}
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${tc.page} overflow-hidden`}>
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-4 md:px-5 py-3 shrink-0"
        style={{
          background: isDark ? "#1a1a1a" : "#f9fafb",
          borderBottom: isDark ? "1px solid rgba(55,65,81,0.5)" : "1px solid #e5e7eb",
        }}
      >
        <div className="flex items-center gap-2">
          {availableGroups.length > 1 && (
            <button onClick={() => setDrawerOpen(true)} className={`lg:hidden p-2 ${tc.hover} rounded-lg cursor-pointer ${tc.subtext}`}>
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className={`text-[1.125rem] ${tc.heading}`}>Settings</h1>
          {!isAdmin && (
            <span
              className="flex items-center gap-1 text-[0.6875rem] px-2 py-0.5 rounded-md ml-2"
              style={{
                background: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.1)",
                color: isDark ? "#f59e0b" : "#d97706",
              }}
            >
              <Lock className="w-3 h-3" />
              Password Only
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="flex items-center gap-1.5 px-3.5 py-1.5 text-[0.75rem] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors">
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-5">
        <div className="flex gap-4">
          {/* Desktop sidebar — only show for admin (multiple sections) */}
          {availableGroups.length > 1 && (
            <div className="hidden lg:block w-64 shrink-0">{sidebarContent}</div>
          )}

          {/* Mobile drawer */}
          {availableGroups.length > 1 && (
            <AnimatePresence>
              {drawerOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`fixed inset-0 z-40 ${tc.overlay} lg:hidden`}
                    onClick={() => setDrawerOpen(false)}
                  />
                  <motion.div
                    initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`fixed top-0 left-0 bottom-0 z-50 w-72 ${tc.drawerBg} border-r p-4 lg:hidden`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={`text-[1rem] ${tc.heading}`}>Settings</h2>
                      <button onClick={() => setDrawerOpen(false)} className={`p-1.5 rounded-lg ${tc.hover} cursor-pointer ${tc.subtext}`}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {sidebarContent}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isAdmin ? (
              <>
                {active === "general" && <GeneralSettings />}
                {active === "menu" && <MenuManagement />}
                {active === "amenities" && <AmenitiesSettings />}
                {active === "security" && <SecurityPaymentsSettings />}
                {active === "staff" && <StaffSettings />}
                {active === "upgrade" && <UpgradePlans />}
              </>
            ) : canManageMenu ? (
              <>
                {active === "menu" && <MenuManagement />}
                {active === "security" && <SecurityPaymentsSettings passwordOnly />}
              </>
            ) : (
              <SecurityPaymentsSettings passwordOnly />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function POSSettings() {
  return <SettingsInner />;
}
