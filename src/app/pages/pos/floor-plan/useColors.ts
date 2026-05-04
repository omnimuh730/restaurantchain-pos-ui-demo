import { useState, useEffect } from "react";
import { useTheme } from "../theme-context";

export function useColors() {
  const { isDark } = useTheme();
  return isDark ? {
    bg: "transparent", card: "#141A22", raised: "#1C242F", border: "#222C38",
    text1: "#E8EDF2", text2: "#8A96A6", text3: "#4A5463",
    available: { fill: "#2A3441", border: "#3A4656", text: "#5A6778" },
    occupied: { fill: "rgba(43,108,255,0.15)", border: "#4A8BFF", text: "#7BA7FF" },
    reserved: { fill: "rgba(217,138,43,0.15)", border: "#E0A355", text: "#F0B870" },
    primary: "#2B6CFF", amber: "#D98A2B",
    editBg: "#0F1318", editCanvas: "#161B22", editBorder: "#2A3441",
    editSelected: "#4B83FF", editTableDefault: "#2A3441",
    editText1: "#E8EDF2", editText2: "#8A96A6", editText3: "#4A5463",
  } : {
    bg: "transparent", card: "#ffffff", raised: "#f8fafc", border: "#e2e8f0",
    text1: "#1e293b", text2: "#64748b", text3: "#94a3b8",
    available: { fill: "#f1f5f9", border: "#cbd5e1", text: "#94a3b8" },
    occupied: { fill: "rgba(59,130,246,0.1)", border: "#3b82f6", text: "#2563eb" },
    reserved: { fill: "rgba(245,158,11,0.1)", border: "#f59e0b", text: "#d97706" },
    primary: "#3b82f6", amber: "#f59e0b",
    editBg: "#F5F6FA", editCanvas: "#FFFFFF", editBorder: "#E0E3EA",
    editSelected: "#4B83FF", editTableDefault: "#D4D8E0",
    editText1: "#1A1D26", editText2: "#6B7280", editText3: "#9CA3AF",
  };
}

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}
