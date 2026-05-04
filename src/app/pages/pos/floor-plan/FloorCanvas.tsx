import React, { useRef, useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { useTheme } from "../theme-context";
import { useColors } from "./useColors";
import type { Table } from "./types";
import { SNAP_GRID, CANVAS_W, CANVAS_H } from "./types";

interface FloorCanvasProps {
  tables: Table[];
  editMode: boolean;
  selectedTable: string | null;
  setSelectedTable: (id: string | null) => void;
  showSeats: boolean;
  zoom: number;
  setZoom: (fn: (prev: number) => number) => void;
  onMouseDown: (e: React.MouseEvent, tableId: string) => void;
  guides: { x: number | null; y: number | null };
  addTable: () => void;
  isMobile: boolean;
  setMobileEditDrawerOpen: (v: boolean) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function FloorCanvas({
  tables, editMode, selectedTable, setSelectedTable, showSeats, zoom, setZoom,
  onMouseDown, guides, addTable, isMobile, setMobileEditDrawerOpen, scrollRef,
}: FloorCanvasProps) {
  const C = useColors();
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scrollDragging, setScrollDragging] = useState(false);
  const scrollDragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const dotColor = editMode ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.15)") : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)");
  const dotR = 1.5;
  const dotGridSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${SNAP_GRID}' height='${SNAP_GRID}'%3E%3Ccircle cx='${dotR}' cy='${dotR}' r='${dotR}' fill='${encodeURIComponent(dotColor)}'/%3E%3C/svg%3E")`;

  const handleCanvasDragStart = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    if (editMode) {
      setSelectedTable(null);
      setMobileEditDrawerOpen(false);
    }
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    setScrollDragging(true);
    scrollDragStart.current = { x: e.clientX, y: e.clientY, scrollLeft: scrollEl.scrollLeft, scrollTop: scrollEl.scrollTop };
    e.preventDefault();
  };

  useEffect(() => {
    if (!scrollDragging) return;
    const move = (e: MouseEvent) => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;
      const dx = e.clientX - scrollDragStart.current.x;
      const dy = e.clientY - scrollDragStart.current.y;
      scrollEl.scrollLeft = scrollDragStart.current.scrollLeft - dx;
      scrollEl.scrollTop = scrollDragStart.current.scrollTop - dy;
    };
    const up = () => setScrollDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [scrollDragging]);

  const minZoom = (() => {
    if (editMode) return 0.1;
    const el = scrollRef.current;
    if (!el || tables.length === 0) return 0.3;
    const maxX = Math.max(...tables.map((t) => t.x + t.width));
    const maxY = Math.max(...tables.map((t) => t.y + t.height));
    if (maxX <= 0 || maxY <= 0) return 0.3;
    const fitW = el.clientWidth / maxX;
    const fitH = el.clientHeight / maxY;
    return Math.min(1, Math.max(0.1, Math.min(fitW, fitH)));
  })();

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom((prev: number) => {
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        return Math.min(3, Math.max(minZoom, prev + delta));
      });
    }
  }, [minZoom]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, editMode]);

  useEffect(() => {
    setZoom((prev) => (prev < minZoom ? minZoom : prev));
  }, [minZoom, setZoom]);

  const bg = editMode ? C.editBg : C.bg;
  const scaledW = CANVAS_W * zoom;
  const scaledH = CANVAS_H * zoom;

  return (
    <div ref={canvasRef} className="relative w-full h-full" style={{ background: bg, overflow: "hidden" }}>
      <div
        ref={scrollRef}
        className={`w-full h-full edit-canvas-scrollbar${isDark ? ' edit-canvas-scrollbar-dark' : ''}`}
        style={{
          overflow: "auto", backgroundColor: bg, backgroundImage: dotGridSvg,
          backgroundSize: `${SNAP_GRID}px ${SNAP_GRID}px`,
          cursor: scrollDragging ? "grabbing" : (editMode ? "default" : "grab"),
        }}
      >
        <div style={{ width: scaledW, height: scaledH, position: "relative" }}>
          <div
            style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom})`, transformOrigin: "0 0", position: "absolute", top: 0, left: 0 }}
            onMouseDown={handleCanvasDragStart}
          >
            {editMode && guides.x !== null && <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: guides.x, width: 1, background: "#6EE7B7" }} />}
            {editMode && guides.y !== null && <div className="absolute left-0 right-0 pointer-events-none" style={{ top: guides.y, height: 1, background: "#6EE7B7" }} />}

            {tables.map((t) => {
              if (editMode) {
                const isSelected = selectedTable === t.id;
                return (
                  <div
                    key={t.id}
                    className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                    style={{
                      left: t.x, top: t.y, width: t.width, height: t.height,
                      background: isSelected ? C.editSelected : C.editTableDefault,
                      borderRadius: t.shape === "circle" ? Math.min(t.width, t.height) / 2 : 12,
                      boxShadow: isSelected ? "0 4px 20px rgba(75,131,255,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                      border: isSelected ? "2px solid #3370E8" : "none",
                    }}
                    onMouseDown={(e) => onMouseDown(e, t.id)}
                  >
                    <span className="text-xs font-semibold pointer-events-none text-center" style={{ color: isSelected ? "#fff" : C.editText2 }}>
                      {t.label}{showSeats && <span className="ml-1 opacity-60">({t.seats})</span>}
                    </span>
                  </div>
                );
              }

              const isOcc = t.status === "occupied";
              const isRes = t.status === "reserved";
              const colors = isOcc ? C.occupied : isRes ? C.reserved : C.available;
              return (
                <div
                  key={t.id}
                  className="absolute flex flex-col items-center justify-center cursor-pointer transition-all hover:brightness-110"
                  style={{
                    left: t.x, top: t.y, width: t.width, height: t.height,
                    background: isOcc ? C.editSelected : C.editTableDefault,
                    border: isOcc ? "2px solid #3370E8" : `1.5px solid ${colors.border}`,
                    borderRadius: t.shape === "circle" ? Math.min(t.width, t.height) / 2 : 12,
                    boxShadow: isOcc ? "0 4px 20px rgba(75,131,255,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                  onClick={() => setSelectedTable(t.id)}
                >
                  <span className="text-center text-[14px]" style={{ color: isOcc ? "#fff" : C.editText1 }}>{t.label}</span>
                  <span className="mt-0.5 text-center opacity-80 text-xs" style={{ color: isOcc ? "#fff" : C.editText2 }}>
                    {isOcc ? `${t.occupiedSeats ?? t.seats}/${t.seats}` : t.seats}
                  </span>
                  {isOcc && t.revenue && <span className="mt-1 text-center text-[13px]" style={{ color: "#fff" }}>{"\u20A9"}{t.revenue.toLocaleString()}</span>}
                  {isRes && <span className="mt-1 text-center" style={{ color: C.editText2, fontSize: 11 }}>Reserved {t.reservationTime}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Zoom indicator */}
      <div
        className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold select-none pointer-events-none"
        style={{ background: editMode ? "rgba(0,0,0,0.06)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"), color: editMode ? C.editText2 : C.text3 }}
      >
        {Math.round(zoom * 100)}%
      </div>

      {/* Mobile FAB: Add Table */}
      {editMode && isMobile && (
        <button
          onClick={addTable}
          className="absolute bottom-16 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          style={{ background: "#3370E8", color: "#fff" }}
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}
