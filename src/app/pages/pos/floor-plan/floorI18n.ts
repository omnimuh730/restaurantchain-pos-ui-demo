import type { TFunction } from "i18next";

export function formatFloorDisplayName(name: string, t: TFunction<"floor">): string {
  if (name === "Hall") return t("mock.hall");
  if (name === "Lounge") return t("mock.lounge");
  return name;
}

export function formatTableLabel(label: string, t: TFunction<"floor">): string {
  const trimmed = label.trim();
  if (/ copy$/i.test(trimmed)) {
    const base = trimmed.replace(/ copy$/i, "").trim();
    return `${formatTableLabel(base, t)} ${t("edit.copySuffix")}`;
  }
  const m = /^Table\s+(\d+)$/i.exec(trimmed);
  if (m) return t("mock.tableLabel", { n: m[1] });
  return label;
}
