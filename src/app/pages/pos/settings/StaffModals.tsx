import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { InlineModal, InlineToggle } from "./ui-helpers";
import { ALL_PERMISSIONS, ROLE_DEFAULTS, STAFF_ROLES, ROLE_CONFIG, PERMISSION_GROUP_I18N_SLUG } from "./data";
import type { StaffMember, StaffRole } from "./types";
import { Users, Check, Settings as SettingsIcon } from "lucide-react";

// ─── Shared Avatar ──────────────────────────────────────
function Avatar({ name, tc }: { name: string; tc: ReturnType<typeof useThemeClasses> }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return <div className={`w-10 h-10 text-[0.8125rem] rounded-full ${tc.iconBg} flex items-center justify-center shrink-0`}>{initials}</div>;
}

// ─── Permissions Modal ──────────────────────────────────
export function StaffPermissionsModal({
  member, onClose, onSave,
}: {
  member: StaffMember | null;
  onClose: () => void;
  onSave: (memberId: string, perms: Record<string, boolean>) => void;
}) {
  const { t } = useTranslation("settings");
  const tc = useThemeClasses();
  const [permState, setPermState] = useState<Record<string, boolean>>({});
  const totalPermCount = Object.values(ALL_PERMISSIONS).flat().length;

  useEffect(() => {
    if (member) setPermState({ ...member.permissions });
  }, [member]);

  if (!member) return <InlineModal open={false} onClose={onClose}><div /></InlineModal>;

  const togglePerm = (id: string) => setPermState((prev) => ({ ...prev, [id]: !prev[id] }));
  const enabledPermCount = Object.values(permState).filter(Boolean).length;

  const selectAllPerms = () => {
    const all: Record<string, boolean> = {};
    Object.values(ALL_PERMISSIONS).flat().forEach((p) => { all[p.id] = true; });
    setPermState(all);
  };

  return (
    <InlineModal open={!!member} onClose={onClose} size="md">
      <div className={`p-5 border-b ${tc.cardBorder}`}>
        <div className="flex items-center gap-3">
          <Avatar name={member.name} tc={tc} />
          <div>
            <h3 className={`text-[1rem] ${tc.heading}`}>{member.name}</h3>
            <p className={`text-[0.75rem] ${tc.subtext}`}>{t("staff.permModalOf", { enabled: enabledPermCount, total: totalPermCount })}</p>
          </div>
        </div>
      </div>
      <div className="p-5 max-h-[60vh] overflow-y-auto">
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => {
            const d = ROLE_DEFAULTS[member.role];
            if (d) setPermState(d);
          }} className={`px-2.5 py-1 text-[0.6875rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>
            {t("staff.resetToRoleDefaults", { role: t(`staff.roles.${member.role}`) })}
          </button>
          <button onClick={selectAllPerms} className={`px-2.5 py-1 text-[0.6875rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>{t("staff.selectAll")}</button>
          <button onClick={() => setPermState({})} className={`px-2.5 py-1 text-[0.6875rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>{t("staff.clearAll")}</button>
        </div>
        {Object.entries(ALL_PERMISSIONS).map(([group, perms]) => {
          const groupSlug = PERMISSION_GROUP_I18N_SLUG[group] ?? group;
          const groupEnabled = perms.filter((p) => !!permState[p.id]).length;
          return (
            <div key={group} className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className={`text-[0.6875rem] ${tc.muted} tracking-wider uppercase flex items-center gap-1.5`}>
                  <SettingsIcon className="w-3 h-3" /> {t(`staff.permGroups.${groupSlug}`)}
                </p>
                <span className={`text-[0.625rem] ${tc.muted}`}>{groupEnabled}/{perms.length}</span>
              </div>
              <div className="space-y-1">
                {perms.map((p) => {
                  const isOn = !!permState[p.id];
                  return (
                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isOn ? (tc.isDark ? "bg-blue-900/10" : "bg-blue-50") : tc.hover}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isOn ? tc.iconBg : tc.disabledIconBg}`}>
                        <p.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[0.8125rem] ${tc.isDark ? "text-gray-200" : "text-gray-700"}`}>{t(`staff.perms.${p.id}.label`)}</p>
                        <p className={`text-[0.6875rem] ${tc.muted}`}>{t(`staff.perms.${p.id}.desc`)}</p>
                      </div>
                      <InlineToggle checked={isOn} onChange={() => togglePerm(p.id)} size="sm" />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
        <button onClick={onClose} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>{t("general.cancel")}</button>
        <button onClick={() => onSave(member.id, permState)} className="flex items-center gap-1.5 px-3.5 py-1.5 text-[0.75rem] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors">
          <Check className="w-4 h-4" /> {t("staff.savePermissions")}
        </button>
      </div>
    </InlineModal>
  );
}

// ─── Edit Modal ────────────────────────────────────────
export function StaffEditModal({
  member, onClose, onSave,
}: {
  member: StaffMember | null;
  onClose: () => void;
  onSave: (memberId: string, data: { name: string; username: string; role: StaffRole }) => void;
}) {
  const { t } = useTranslation("settings");
  const tc = useThemeClasses();
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState<StaffRole>("Waiter");

  useEffect(() => {
    if (member) {
      setEditName(member.name);
      setEditUsername(member.username);
      setEditRole(member.role);
    }
  }, [member]);

  if (!member) return <InlineModal open={false} onClose={onClose}><div /></InlineModal>;

  return (
    <InlineModal open={!!member} onClose={onClose} size="md">
      <div className={`p-5 border-b ${tc.cardBorder}`}>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className={`text-[1rem] ${tc.heading}`}>{t("staff.editStaff")}</h3>
        </div>
      </div>
      <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
        <div>
          <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>{t("staff.fullNamePlain")}</label>
          <input value={editName} onChange={(e) => setEditName(e.target.value)} className={tc.input} />
        </div>
        <div>
          <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>{t("staff.usernamePlain")}</label>
          <input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder={t("staff.placeholderUsername")} className={tc.input} />
        </div>
        {/* Role */}
        <div>
          <label className={`text-[0.8125rem] ${tc.subtext} mb-2 block`}>{t("staff.rolePlain")}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STAFF_ROLES.map((r) => {
              const cfg = ROLE_CONFIG[r];
              const Icon = cfg.icon;
              const isSelected = editRole === r;
              return (
                <button key={r} onClick={() => setEditRole(r)} className={`flex flex-col items-center gap-1 sm:gap-1.5 py-2 sm:py-3 px-2 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected ? "border-blue-500 bg-blue-900/10 text-blue-400" : `${tc.cardBorder} ${tc.hover} ${tc.subtext}`
                }`}>
                  <Icon className="w-5 h-5" /><span className="text-[0.75rem]">{t(`staff.roles.${r}`)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
        <button onClick={onClose} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>{t("general.cancel")}</button>
        <button onClick={() => onSave(member.id, { name: editName, username: editUsername, role: editRole })} className="flex items-center gap-1.5 px-3.5 py-1.5 text-[0.75rem] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors">
          <Check className="w-4 h-4" /> {t("saveChanges")}
        </button>
      </div>
    </InlineModal>
  );
}
