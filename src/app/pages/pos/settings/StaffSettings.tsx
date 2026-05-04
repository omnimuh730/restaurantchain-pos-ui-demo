import { useThemeClasses } from "../theme-context";
import React, { useState } from "react";
import {
  Users, Search, Check, X, Copy,
  Shield, Plus, UserPlus, Ban, Trash2, KeyRound,
  Clock, CheckCircle2,
} from "lucide-react";
import { INITIAL_STAFF, STAFF_ROLES, ROLE_CONFIG, PERM_ICONS, ALL_PERMISSIONS, ROLE_DEFAULTS } from "./data";
import type { StaffMember, StaffRole } from "./types";
import { StaffPermissionsModal } from "./StaffModals";
import { InlineModal } from "./ui-helpers";

export function StaffSettings() {
  const tc = useThemeClasses();
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [permissionsModal, setPermissionsModal] = useState<StaffMember | null>(null);

  // Register staff modal
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regRole, setRegRole] = useState<StaffRole>("Waiter");

  // Confirm action modals
  const [confirmAction, setConfirmAction] = useState<{
    type: "deactivate" | "activate" | "remove" | "resetPassword";
    member: StaffMember;
  } | null>(null);
  const [resetPasswordDone, setResetPasswordDone] = useState<string | null>(null);

  const totalPermCount = Object.values(ALL_PERMISSIONS).flat().length;
  const roleCounts = STAFF_ROLES.reduce((acc, r) => {
    acc[r] = staff.filter((s) => s.role === r).length; return acc;
  }, {} as Record<string, number>);

  const pendingStaff = staff.filter((s) => s.status === "pending");
  const nonPendingStaff = staff.filter((s) => s.status !== "pending");

  const filtered = nonPendingStaff
    .filter((s) => roleFilter === "all" || s.role === roleFilter)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.username.toLowerCase().includes(search.toLowerCase()));

  const activeCount = staff.filter((s) => s.status === "active").length;
  const inactiveCount = staff.filter((s) => s.status === "inactive").length;
  const pendingCount = pendingStaff.length;

  const Avatar = ({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) => {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
    const sz = size === "lg" ? "w-10 h-10 text-[0.8125rem]" : "w-8 h-8 text-[0.6875rem]";
    return <div className={`${sz} rounded-full ${tc.iconBg} flex items-center justify-center shrink-0`}>{initials}</div>;
  };

  const handleSavePermissions = (memberId: string, perms: Record<string, boolean>) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === memberId
          ? { ...s, permissions: { ...perms }, permissionCount: Object.values(perms).filter(Boolean).length }
          : s
      )
    );
    setPermissionsModal(null);
  };

  const handleRegister = () => {
    if (!regName.trim() || !regUsername.trim()) return;
    const defaults = ROLE_DEFAULTS[regRole] || {};
    const permCount = Object.values(defaults).filter(Boolean).length;
    const newMember: StaffMember = {
      id: String(Date.now()),
      name: regName.trim(),
      username: regUsername.trim(),
      role: regRole,
      status: "active",
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      permissionCount: permCount,
      permissions: { ...defaults },
    };
    setStaff((prev) => [...prev, newMember]);
    setShowRegister(false);
    setRegName(""); setRegUsername(""); setRegRole("Waiter");
  };

  const handleApproveStaff = (memberId: string) => {
    setStaff((prev) => prev.map((s) =>
      s.id === memberId ? { ...s, status: "active" as const } : s
    ));
  };

  const handleRejectStaff = (memberId: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== memberId));
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    const { type, member } = confirmAction;
    switch (type) {
      case "deactivate":
        setStaff((prev) => prev.map((s) => s.id === member.id ? { ...s, status: "inactive" as const } : s));
        break;
      case "activate":
        setStaff((prev) => prev.map((s) => s.id === member.id ? { ...s, status: "active" as const } : s));
        break;
      case "remove":
        setStaff((prev) => prev.filter((s) => s.id !== member.id));
        break;
      case "resetPassword":
        // Simulate reset — show temp PIN
        setResetPasswordDone(member.id);
        setTimeout(() => setResetPasswordDone(null), 5000);
        break;
    }
    setConfirmAction(null);
  };

  const actionLabels: Record<string, { title: string; desc: string; btnText: string; btnColor: string }> = {
    deactivate: { title: "Deactivate Staff", desc: "This staff member will no longer be able to log in.", btnText: "Deactivate", btnColor: "bg-amber-600 hover:bg-amber-700" },
    activate: { title: "Activate Staff", desc: "This staff member will be able to log in again.", btnText: "Activate", btnColor: "bg-blue-600 hover:bg-blue-700" },
    remove: { title: "Remove Staff", desc: "This action cannot be undone. The staff member will be permanently removed.", btnText: "Remove", btnColor: "bg-red-600 hover:bg-red-700" },
    resetPassword: { title: "Reset PIN", desc: "This will generate a temporary PIN for the staff member.", btnText: "Reset PIN", btnColor: "bg-amber-600 hover:bg-amber-700" },
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`${tc.card} rounded-lg p-4 sm:p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <h3 className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}><Users className="w-4 h-4 text-blue-400" /> Staff Management</h3>
            <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>Register staff and manage permissions</p>
          </div>
          <button
            onClick={() => setShowRegister(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[0.75rem] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Register Staff
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Total", value: staff.length, icon: Users, color: "text-blue-400" },
          { label: "Active", value: activeCount, icon: Check, color: "text-blue-400" },
          { label: "Inactive", value: inactiveCount, icon: X, color: "text-gray-400" },
          { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className={`${tc.card} rounded-lg p-2 sm:p-3`}>
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className={`text-[0.6875rem] ${tc.subtext}`}>{s.label}</span>
            </div>
            <p className={`text-[1.25rem] ${tc.heading}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Registration Requests */}
      {pendingStaff.length > 0 && (
        <div className={`${tc.card} rounded-lg overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${tc.cardBorder} flex items-center gap-2`}>
            <UserPlus className="w-4 h-4 text-blue-500" />
            <h4 className={`text-[0.875rem] ${tc.heading}`}>Pending Requests</h4>
            <span className="ml-auto px-2 py-0.5 rounded-full text-[0.625rem] bg-blue-600 text-white">
              {pendingStaff.length}
            </span>
          </div>
          <div className="divide-y divide-gray-700/50">
            {pendingStaff.map((member) => {
              const cfg = ROLE_CONFIG[member.role];
              const RoleIcon = cfg.icon;
              const roleSoftColor = tc.isDark ? cfg.softColor : cfg.softColorLight;
              return (
                <div key={member.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar name={member.name} size="sm" />
                    <div className="min-w-0">
                      <p className={`text-[0.8125rem] ${tc.heading} truncate`}>{member.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[0.6875rem] ${tc.muted}`}>@{member.username}</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.5625rem] bg-blue-600 text-white">
                          <RoleIcon className="w-2.5 h-2.5" /> {member.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleApproveStaff(member.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.6875rem] bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleRejectStaff(member.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.6875rem] border border-blue-500/50 text-blue-500 hover:bg-blue-600/10 hover:border-blue-500 cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.muted}`} />
        <input placeholder="Search by name, username or card ID..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${tc.input} pl-10`} />
      </div>

      {/* Role filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button onClick={() => setRoleFilter("all")} className={`px-3 py-1.5 rounded-lg text-[0.75rem] cursor-pointer transition-colors border ${
          roleFilter === "all" ? "bg-blue-600 text-white border-blue-600" : `${tc.cardBorder} ${tc.subtext} ${tc.hover}`
        }`}>All Roles ({nonPendingStaff.length})</button>
        {STAFF_ROLES.map((r) => {
          const cfg = ROLE_CONFIG[r];
          const Icon = cfg.icon;
          return (
            <button key={r} onClick={() => setRoleFilter(roleFilter === r ? "all" : r)} className={`px-3 py-1.5 rounded-lg text-[0.75rem] cursor-pointer transition-colors border flex items-center gap-1.5 ${
              roleFilter === r ? "bg-blue-600 text-white border-blue-600" : `${tc.cardBorder} ${tc.subtext} ${tc.hover}`
            }`}><Icon className="w-3 h-3" /> {r} ({roleCounts[r] || 0})</button>
          );
        })}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((member) => {
          const cfg = ROLE_CONFIG[member.role];
          const RoleIcon = cfg.icon;
          const roleSoftColor = tc.isDark ? cfg.softColor : cfg.softColorLight;
          const isActive = member.status === "active";
          const isInactive = member.status === "inactive";
          return (
            <div key={member.id} className={`${tc.card} rounded-lg overflow-hidden ${isInactive ? "opacity-60" : ""}`}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar name={member.name} />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${tc.dotBorder} ${isActive ? "bg-blue-500" : "bg-gray-500"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-[0.875rem] ${tc.heading} truncate`}>{member.name}</p>
                    </div>
                    <span className={`text-[0.6875rem] ${tc.muted}`}>@{member.username}</span>
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.625rem] bg-blue-600 text-white">
                        <RoleIcon className="w-3 h-3" /> {member.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-3 text-[0.6875rem] ${tc.muted} mb-2`}>
                  <span>Joined {member.joinDate}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[0.5625rem] ${isActive ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-500"}`}>
                    {member.status}
                  </span>
                </div>
                {resetPasswordDone === member.id && (
                  <div className={`mb-2 px-2.5 py-1.5 rounded-lg text-[0.6875rem] bg-blue-900/20 border border-blue-700/30 text-blue-400`}>
                    Temp PIN: <span className="font-mono tracking-widest">123456</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[0.6875rem] ${tc.muted} shrink-0`}>{member.permissionCount}/{totalPermCount} permissions</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {PERM_ICONS.map((p) => {
                      const isEnabled = !!member.permissions[p.id];
                      return (
                        <div key={p.id} className={`w-6 h-6 rounded-lg flex items-center justify-center ${isEnabled ? tc.iconBg : tc.disabledIconBg}`}>
                          <p.icon className="w-3 h-3" />
                        </div>
                      );
                    })}
                    {member.permissionCount > 5 && <span className={`text-[0.625rem] ${tc.muted} ml-1`}>+{member.permissionCount - 5}</span>}
                  </div>
                </div>
              </div>
              <div className={`flex border-t ${tc.cardBorder}`}>
                <button onClick={() => setPermissionsModal(member)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[0.75rem] transition-colors border-r ${tc.cardBorder} ${tc.subtext} ${tc.hover} cursor-pointer`}>
                  <Shield className="w-3.5 h-3.5" /> Permissions
                </button>
                {/* Actions dropdown-like area */}
                <div className="flex items-stretch">
                  {isActive ? (
                    <button
                      onClick={() => setConfirmAction({ type: "deactivate", member })}
                      className={`px-2.5 flex items-center justify-center border-r ${tc.cardBorder} ${tc.muted} ${tc.hover} transition-colors cursor-pointer`}
                      title="Deactivate"
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmAction({ type: "activate", member })}
                      className={`px-2.5 flex items-center justify-center border-r ${tc.cardBorder} text-blue-400 ${tc.hover} transition-colors cursor-pointer`}
                      title="Activate"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmAction({ type: "resetPassword", member })}
                    className={`px-2.5 flex items-center justify-center border-r ${tc.cardBorder} ${tc.muted} ${tc.hover} transition-colors cursor-pointer`}
                    title="Reset PIN"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmAction({ type: "remove", member })}
                    className={`px-2.5 flex items-center justify-center text-red-400/60 hover:text-red-400 ${tc.hover} transition-colors cursor-pointer`}
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Staff Modal */}
      <InlineModal open={showRegister} onClose={() => setShowRegister(false)} size="md">
        <div className={`p-5 border-b ${tc.cardBorder}`}>
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            <h3 className={`text-[1rem] ${tc.heading}`}>Register New Staff</h3>
          </div>
        </div>
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>Full Name *</label>
            <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="e.g. John Smith" className={tc.input} />
          </div>
          <div>
            <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>Username *</label>
            <input value={regUsername} onChange={(e) => setRegUsername(e.target.value)} placeholder="e.g. john.smith" className={tc.input} />
          </div>
          {/* Role Selection */}
          <div>
            <label className={`text-[0.8125rem] ${tc.subtext} mb-2 block`}>Role *</label>
            <div className="grid grid-cols-3 gap-2">
              {STAFF_ROLES.map((r) => {
                const cfg = ROLE_CONFIG[r];
                const Icon = cfg.icon;
                const isSelected = regRole === r;
                const defaults = ROLE_DEFAULTS[r];
                const permCount = Object.values(defaults).filter(Boolean).length;
                return (
                  <button key={r} onClick={() => setRegRole(r)} className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border-2 transition-all cursor-pointer ${
                    isSelected ? "border-blue-500 bg-blue-900/10 text-blue-400" : `${tc.cardBorder} ${tc.hover} ${tc.subtext}`
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-[0.75rem]">{r}</span>
                    <span className={`text-[0.5625rem] ${tc.muted}`}>{permCount} perms</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Role permissions preview */}
          <div className={`rounded-lg p-3 ${tc.isDark ? "bg-gray-800/50" : "bg-gray-50"}`}>
            <p className={`text-[0.6875rem] ${tc.muted} uppercase tracking-wider mb-2`}>Default Permissions for {regRole}</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(ROLE_DEFAULTS[regRole] || {}).filter(([, v]) => v).map(([permId]) => {
                const perm = Object.values(ALL_PERMISSIONS).flat().find(p => p.id === permId);
                return perm ? (
                  <span key={permId} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.625rem] ${tc.isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
                    <perm.icon className="w-3 h-3" /> {perm.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
        <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
          <button onClick={() => setShowRegister(false)} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>Cancel</button>
          <button
            onClick={handleRegister}
            disabled={!regName.trim() || !regUsername.trim()}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${
              !regName.trim() || !regUsername.trim()
                ? `${tc.isDark ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"} cursor-not-allowed`
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Check className="w-4 h-4" /> Register
          </button>
        </div>
      </InlineModal>

      {/* Confirm Action Modal */}
      <InlineModal open={!!confirmAction} onClose={() => setConfirmAction(null)} size="sm">
        {confirmAction && (() => {
          const a = actionLabels[confirmAction.type];
          return (
            <>
              <div className="p-5">
                <h3 className={`text-[1rem] ${tc.heading} mb-2`}>{a.title}</h3>
                <p className={`text-[0.8125rem] ${tc.subtext} mb-1`}>
                  Staff: <span className={tc.heading}>{confirmAction.member.name}</span> (@{confirmAction.member.username})
                </p>
                <p className={`text-[0.8125rem] ${tc.muted}`}>{a.desc}</p>
              </div>
              <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
                <button onClick={() => setConfirmAction(null)} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg text-white cursor-pointer transition-colors ${a.btnColor}`}
                >
                  {a.btnText}
                </button>
              </div>
            </>
          );
        })()}
      </InlineModal>

      {/* Modals */}
      <StaffPermissionsModal member={permissionsModal} onClose={() => setPermissionsModal(null)} onSave={handleSavePermissions} />
    </div>
  );
}