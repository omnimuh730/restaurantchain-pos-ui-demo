import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme, useThemeClasses } from "../theme-context";
import { useColors } from "./useColors";
import type { Floor } from "./types";
import { formatFloorDisplayName } from "./floorI18n";

export function FloorTabsRow({
  floors,
  activeFloorId,
  setActiveFloorId,
  addFloor,
  removeFloor,
  setEditMode,
  onRenameFloor,
}: {
  floors: Floor[];
  activeFloorId: string;
  setActiveFloorId: (id: string) => void;
  addFloor: (name?: string) => void;
  removeFloor?: (id: string) => void;
  setEditMode: (v: boolean) => void;
  onRenameFloor: (id: string, name: string) => void;
  showSeats?: boolean;
  setShowSeats?: (v: boolean) => void;
}) {
  const { t } = useTranslation("floor");
  const C = useColors();
  const tc = useThemeClasses();
  const { role } = useTheme();
  const isAdmin = role === "Admin";
  const [renamingId, setRenamingId] = useState<string | null>(
    null,
  );
  const [renameVal, setRenameVal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startScroll: number;
    moved: boolean;
  }>({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (
        menuWrapRef.current &&
        !menuWrapRef.current.contains(e.target as Node)
      )
        setMenuOpen(false);
    };
    window.addEventListener("mousedown", onDoc);
    return () => window.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current;
    const el = scrollRef.current;
    if (!s.active || !el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    el.scrollLeft = s.startScroll - dx;
  };
  const onPointerUp = () => {
    dragState.current.active = false;
  };

  return (
    <div
      className={`px-2 md:px-4 flex items-center gap-2 border-b ${tc.isDark ? "border-gray-700 bg-[#1e2330]" : "border-slate-300 bg-white"}`}
    >
      <div
        ref={scrollRef}
        className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 overflow-x-auto no-scrollbar select-none"
        style={{ cursor: "grab", scrollbarWidth: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {floors.map((f) => {
          const isActive = f.id === activeFloorId;
          if (renamingId === f.id) {
            return (
              <input
                key={f.id}
                autoFocus
                value={renameVal}
                onChange={(e) => setRenameVal(e.target.value)}
                onBlur={() => {
                  onRenameFloor(f.id, renameVal);
                  setRenamingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onRenameFloor(f.id, renameVal);
                    setRenamingId(null);
                  }
                }}
                className="text-sm px-2 py-0.5 rounded border outline-none shrink-0"
                style={{
                  color: C.text1,
                  background: C.raised,
                  borderColor: C.border,
                  width: 80,
                }}
              />
            );
          }
          return (
            <button
              key={f.id}
              onClick={() => {
                if (dragState.current.moved) return;
                setActiveFloorId(f.id);
              }}
              onDoubleClick={() => {
                setRenamingId(f.id);
                setRenameVal(f.name);
              }}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-[14px] cursor-pointer transition-colors border-b-2 ${isActive ? `border-blue-500 ${tc.isDark ? "text-blue-400" : "text-slate-800"}` : `border-transparent ${tc.muted} ${tc.hover}`}`}
              title={t("tabs.doubleClickRename")}
            >
              {formatFloorDisplayName(f.name, t)}
              <span
                className={`min-w-[1.25rem] h-5 px-1.5 rounded text-[0.6875rem] flex items-center justify-center ${
                  isActive
                    ? tc.isDark
                      ? "text-blue-400"
                      : "text-slate-600"
                    : tc.subtext
                }`}
              >
                {f.tables.length}
              </span>
            </button>
          );
        })}
      </div>

      {isAdmin && (
        <div className="relative shrink-0" ref={menuWrapRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t("tabs.floorOptionsAria")}
            title={t("tabs.floorOptionsTitle")}
            className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <MoreVertical
              size={18}
              color={menuOpen ? "#2563eb" : undefined}
            />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-30 min-w-[180px] rounded-lg border shadow-lg overflow-hidden"
              style={{
                background: C.raised,
                borderColor: C.border,
              }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setAddName(`${floors.length + 1}F`);
                  setAddOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:opacity-80 cursor-pointer"
                style={{ color: C.text1 }}
              >
                <Plus size={16} /> {t("tabs.addFloor")}
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setEditMode(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:opacity-80 cursor-pointer"
                style={{ color: C.text1 }}
              >
                <Edit3 size={16} /> {t("tabs.editLayout")}
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setRemoveOpen(true);
                }}
                disabled={floors.length <= 1}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:opacity-80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: "#ef4444" }}
              >
                <Trash2 size={16} /> {t("tabs.removeFloor")}
              </button>
            </div>
          )}
        </div>
      )}

      {addOpen && (
        <ModalShell onClose={() => setAddOpen(false)}>
          <div
            className="w-[90vw] max-w-md rounded-lg shadow-xl border p-5"
            style={{
              background: C.raised,
              borderColor: C.border,
              color: C.text1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-base font-semibold mb-1">
              {t("addFloorModal.title")}
            </div>
            <div
              className="text-sm mb-4"
              style={{ color: C.text2 }}
            >
              {t("addFloorModal.hint")}
            </div>
            <input
              autoFocus
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && addName.trim()) {
                  addFloor(addName.trim());
                  setAddOpen(false);
                }
              }}
              placeholder={t("addFloorModal.placeholder")}
              className="w-full px-3 py-2 rounded border outline-none text-sm"
              style={{
                background: C.bg,
                borderColor: C.border,
                color: C.text1,
              }}
            />
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setAddOpen(false)}
                className="px-4 py-2 rounded text-sm cursor-pointer hover:opacity-80"
                style={{
                  background: C.bg,
                  color: C.text1,
                  border: `1px solid ${C.border}`,
                }}
              >
                {t("addFloorModal.cancel")}
              </button>
              <button
                disabled={!addName.trim()}
                onClick={() => {
                  addFloor(addName.trim());
                  setAddOpen(false);
                }}
                className="px-4 py-2 rounded text-sm cursor-pointer hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: C.primary, color: "#fff" }}
              >
                {t("addFloorModal.add")}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {removeOpen && (
        <ModalShell onClose={() => setRemoveOpen(false)}>
          <div
            className="w-[90vw] max-w-md rounded-lg shadow-xl border p-5"
            style={{
              background: C.raised,
              borderColor: C.border,
              color: C.text1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-base font-semibold mb-1">
              {t("removeFloorModal.title")}
            </div>
            <div
              className="text-sm mb-5"
              style={{ color: C.text2 }}
            >
              {t("removeFloorModal.confirm", {
                name: formatFloorDisplayName(floors.find((f) => f.id === activeFloorId)?.name ?? "", t),
              })}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRemoveOpen(false)}
                className="px-4 py-2 rounded text-sm cursor-pointer hover:opacity-80"
                style={{
                  background: C.bg,
                  color: C.text1,
                  border: `1px solid ${C.border}`,
                }}
              >
                {t("removeFloorModal.cancel")}
              </button>
              <button
                onClick={() => {
                  removeFloor?.(activeFloorId);
                  setRemoveOpen(false);
                }}
                className="px-4 py-2 rounded text-sm cursor-pointer hover:opacity-80"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                {t("removeFloorModal.delete")}
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      {children}
    </div>
  );
}