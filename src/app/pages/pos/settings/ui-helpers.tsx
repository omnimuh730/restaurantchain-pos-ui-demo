import { useThemeClasses } from "../theme-context";
import type { ReactNode } from "react";

export function InlineToggle({
  checked,
  onChange,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
}) {
  const w = size === "sm" ? "w-8" : "w-10";
  const h = size === "sm" ? "h-4.5" : "h-6";
  const dot = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  const translate = size === "sm" ? "translate-x-3.5" : "translate-x-4";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`${w} ${h} rounded-full relative transition-colors cursor-pointer shrink-0 ${
        checked ? "bg-blue-600" : "bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 ${dot} rounded-full bg-white shadow transition-transform ${
          checked ? translate : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function InlineModal({
  open,
  onClose,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md";
}) {
  const tc = useThemeClasses();
  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${tc.overlay} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`${tc.modalBg} border rounded-lg shadow-xl mx-4 ${
          size === "sm" ? "max-w-sm w-full" : "max-w-lg w-full"
        } max-h-[85vh] flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}