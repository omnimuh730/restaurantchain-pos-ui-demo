import React, { useRef } from "react";
import { GripVertical, Utensils, CreditCard } from "lucide-react";
import { useColors } from "./useColors";
import { useTheme } from "../theme-context";
import {
  getStartHour, getCurrentEndHour, getCurrentDuration, getBlockVisualState,
} from "./reservationLogic";

const BUSINESS_OPEN = 11;
const BUSINESS_CLOSE = 23;
import type { Table, Reservation } from "./types";

interface CalendarTimelineProps {
  allTables: Table[];
  dayReservations: Reservation[];
  reservations: Reservation[];
  calStartHour: number;
  calWindowHours: number;
  assigningId: string | null;
  assigningRez: Reservation | null;
  pendingAssignTableId: string | null;
  assignFlash: string | null;
  calDragRezId: string | null;
  calDragTargetTableId: string | null;
  isTableAvailableForRez: (tableId: string, rez: Reservation) => boolean;
  selectTableForAssign: (tableId: string) => void;
  getBlockStyle: (type: Reservation["type"]) => { bg: string; border: string; borderStyle: string };
  getCalTimeLabels: () => { label: string; hour: number }[];
  showNowLine: boolean;
  nowPercent: number;
  handleCalDragStart: (e: React.MouseEvent) => void;
  calDragActive: boolean;
  handleCalRezDragStart: (e: React.MouseEvent, rezId: string) => void;
  calTimelineRef: React.RefObject<HTMLDivElement | null>;
  calTableListRef: React.RefObject<HTMLDivElement | null>;
  calRowsRef: React.RefObject<HTMLDivElement | null>;
  handleTableListScroll: () => void;
  handleTimelineScroll: () => void;
  nowHour: number;
  isToday: boolean;
  markSeated: (rezId: string) => void;
  markPaid: (rezId: string) => void;
  onRezClick?: (rezId: string) => void;
}

export function CalendarTimeline(props: CalendarTimelineProps) {
  const {
    allTables, dayReservations, reservations, calStartHour, calWindowHours,
    assigningId, assigningRez, pendingAssignTableId, assignFlash,
    calDragRezId, calDragTargetTableId, isTableAvailableForRez,
    selectTableForAssign, getBlockStyle, getCalTimeLabels,
    showNowLine, nowPercent, handleCalDragStart, calDragActive,
    handleCalRezDragStart, calTimelineRef, calTableListRef, calRowsRef,
    handleTableListScroll, handleTimelineScroll,
    nowHour, isToday, markSeated, markPaid, onRezClick,
  } = props;
  const C = useColors();
  const { isDark } = useTheme();
  const clickStartRef = useRef<{ x: number; y: number; rezId: string } | null>(null);

  const endHour = calStartHour + calWindowHours;
  const toPercent = (hour: number) => ((hour - calStartHour) / calWindowHours) * 100;
  const timeLabels = getCalTimeLabels();
  const unavailBg = isDark ? "rgba(11,15,20,0.5)" : "rgba(148,163,184,0.18)";
  const closedOverlayBg = isDark ? "rgba(11,15,20,0.55)" : "rgba(148,163,184,0.22)";
  const openLeft = Math.max(0, toPercent(BUSINESS_OPEN));
  const openRight = Math.min(100, toPercent(BUSINESS_CLOSE));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Time header row */}
      <div className="flex flex-shrink-0 px-4 md:px-6" style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
        <div className="w-20 md:w-24 flex-shrink-0" />
        <div className="flex-1 relative overflow-hidden" style={{ height: 20 }}>
          {timeLabels.map(({ label, hour }) => {
            const pct = toPercent(hour);
            if (pct < -2 || pct > 102) return null;
            return <span key={hour} className="absolute text-xs -translate-x-1/2" style={{ left: `${pct}%`, color: C.text2 }}>{label}</span>;
          })}
        </div>
      </div>

      {/* Scrollable rows: table names (left) + timeline bars (right) */}
      <div className="flex-1 flex overflow-hidden px-4 md:px-6 pt-2">
        {/* Table name column */}
        <div
          ref={calTableListRef}
          className="w-20 md:w-24 flex-shrink-0 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: "none" }}
          onScroll={handleTableListScroll}
        >
          {allTables.map((table) => {
            const isAvail = assigningRez ? isTableAvailableForRez(table.id, assigningRez) : false;
            const isPending = pendingAssignTableId === table.id;
            const isDragTarget = calDragRezId && calDragTargetTableId === table.id;
            const dragCanDrop = isDragTarget ? (() => { const dr = reservations.find(r => r.id === calDragRezId); return dr ? isTableAvailableForRez(table.id, dr) : false; })() : false;
            return (
              <div
                key={table.id}
                className="h-12 md:h-14 mb-1.5 flex items-center px-1 rounded-l transition-all"
                style={{
                  color: isDragTarget
                    ? dragCanDrop ? C.primary : "#EF4444"
                    : assigningId
                    ? isPending ? "#fff" : isAvail ? C.primary : C.text3
                    : C.text1,
                  background: isDragTarget
                    ? dragCanDrop ? "rgba(43,108,255,0.15)" : "rgba(239,68,68,0.1)"
                    : isPending ? C.primary : "transparent",
                  opacity: assigningId && !isAvail && !isPending ? 0.35 : 1,
                  fontWeight: isPending ? 700 : 600,
                  fontSize: "clamp(11px, 1.2vw, 13px)",
                }}
              >
                <span className="truncate">{table.label}</span>
                <span className="ml-0.5 text-[8px] opacity-50">({table.seats})</span>
                {assigningId && isAvail && !isPending && <span className="ml-0.5 text-[8px]" style={{ color: C.primary }}>&#9679;</span>}
              </div>
            );
          })}
        </div>

        {/* Timeline column */}
        <div
          ref={(el) => {
            (calTimelineRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            (calRowsRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ cursor: calDragActive ? "grabbing" : assigningId ? "default" : "grab" }}
          onMouseDown={handleCalDragStart}
          onScroll={handleTimelineScroll}
        >
          {allTables.map((table) => {
            const rez = dayReservations.filter((r) => r.tableId === table.id);
            const isAvail = assigningRez ? isTableAvailableForRez(table.id, assigningRez) : false;
            const isPending = pendingAssignTableId === table.id;
            const isFlashing = assignFlash === table.id;

            return (
              <div
                key={table.id}
                className="relative h-12 md:h-14 mb-1.5 rounded transition-all"
                onClick={() => {
                  if (assigningId && assigningRez && isAvail) {
                    selectTableForAssign(table.id);
                  }
                }}
                style={{
                  cursor: assigningId && isAvail ? "pointer" : calDragRezId ? "default" : undefined,
                  background: calDragTargetTableId === table.id && calDragRezId
                    ? ((() => { const dr = reservations.find(r => r.id === calDragRezId); return dr && isTableAvailableForRez(table.id, dr); })() ? "rgba(43,108,255,0.1)" : "rgba(239,68,68,0.06)")
                    : isFlashing
                    ? "rgba(43,108,255,0.18)"
                    : isPending
                      ? "rgba(43,108,255,0.12)"
                      : assigningId
                        ? isAvail ? "rgba(43,108,255,0.04)" : unavailBg
                        : C.raised,
                  border: calDragTargetTableId === table.id && calDragRezId
                    ? `2px solid ${(() => { const dr = reservations.find(r => r.id === calDragRezId); return dr && isTableAvailableForRez(table.id, dr) ? C.primary : "#EF4444"; })()}`
                    : isPending
                    ? `2px solid ${C.primary}`
                    : isFlashing
                      ? `2px solid ${C.primary}`
                      : assigningId && isAvail
                        ? `1.5px solid rgba(43,108,255,0.3)`
                        : `1px solid transparent`,
                  boxShadow: isFlashing ? "0 0 16px rgba(43,108,255,0.35)" : isPending ? "0 0 12px rgba(43,108,255,0.2)" : "none",
                }}
              >
                {/* Closed-hours (outside business hours) bands */}
                {openLeft > 0 && (
                  <div className="absolute top-0 bottom-0 pointer-events-none rounded-l" style={{ left: 0, width: `${openLeft}%`, background: closedOverlayBg }} />
                )}
                {openRight < 100 && (
                  <div className="absolute top-0 bottom-0 pointer-events-none rounded-r" style={{ left: `${openRight}%`, right: 0, background: closedOverlayBg }} />
                )}

                {/* Grid lines */}
                {timeLabels.map(({ hour }) => {
                  const pct = toPercent(hour);
                  if (pct <= 0 || pct >= 100) return null;
                  return <div key={hour} className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pct}%`, width: 1, background: C.border }} />;
                })}

                {/* Reservation blocks */}
                {rez.map((r) => {
                  const startH = getStartHour(r);
                  const vState = getBlockVisualState(r, nowHour, isToday);
                  const isCompleted = vState === "COMPLETED";
                  const isNoShow = vState === "NO_SHOW";
                  // No-show blocks render as a short ~20-min stub at the start time
                  const eH = isNoShow ? startH + (20 / 60) : getCurrentEndHour(r);
                  if (eH < calStartHour || startH > endHour) return null;
                  const left = Math.max(0, toPercent(startH));
                  const right = Math.min(100, toPercent(eH));
                  const w = right - left;
                  const bStyle = getBlockStyle(r.type);
                  const isDraggingThis = calDragRezId === r.id;
                  const isWalkIn = !!r.walkIn;
                  // Solid fills for past/completed/no-show blocks
                  const bg = isCompleted
                    ? (isWalkIn
                        ? (isDark ? "#0EA5E9" : "#38BDF8")
                        : C.primary)
                    : isNoShow
                    ? (isDark ? "#64748B" : "#94A3B8")
                    : bStyle.bg;
                  const borderColor = isCompleted
                    ? (isWalkIn ? (isDark ? "#0EA5E9" : "#0284C7") : C.primary)
                    : isNoShow ? (isDark ? "#475569" : "#64748B")
                    : vState === "OVERRUN_HARD" ? "#EF4444"
                    : vState === "OVERRUN_SOFT" ? "#F59E0B"
                    : bStyle.border;
                  const borderWidth = vState === "OVERRUN_HARD" || vState === "OVERRUN_SOFT" ? 2 : 1.5;
                  const borderDash = isCompleted ? "solid" : isNoShow ? "dashed" : bStyle.borderStyle;
                  const canSeat = isToday && (r.status === "CONFIRMED" || (!r.status && r.type === "confirmed")) && !!r.tableId;
                  const canPay = r.status === "SEATED" && !r.paid;
                  return (
                    <div
                      key={r.id}
                      data-no-drag
                      className={`absolute top-1 bottom-1 rounded px-1.5 py-0.5 overflow-hidden flex items-center gap-1 group/block ${isDraggingThis ? "opacity-40" : ""}`}
                      style={{
                        left: `${left}%`, width: `${w}%`,
                        background: bg, border: `${borderWidth}px ${borderDash} ${borderColor}`,
                        cursor: isCompleted || isNoShow ? "default" : "grab",
                        zIndex: isDraggingThis ? 20 : isWalkIn ? 6 : 5, pointerEvents: "auto",
                      }}
                      onMouseDown={(e) => {
                        clickStartRef.current = { x: e.clientX, y: e.clientY, rezId: r.id };
                        if (!isCompleted && !isNoShow) handleCalRezDragStart(e, r.id);
                      }}
                      onMouseUp={(e) => {
                        const cs = clickStartRef.current;
                        clickStartRef.current = null;
                        if (!cs || cs.rezId !== r.id) return;
                        const dx = e.clientX - cs.x;
                        const dy = e.clientY - cs.y;
                        if (dx * dx + dy * dy < 16) onRezClick?.(r.id);
                      }}
                    >
                      {!isCompleted && !isNoShow && (
                        <GripVertical size={10} className="flex-shrink-0 opacity-0 group-hover/block:opacity-50 transition-opacity" style={{ color: C.text2 }} />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold truncate" style={{ color: isCompleted ? "#fff" : isNoShow ? "#fff" : C.text1, textDecoration: isNoShow ? "line-through" : "none" }}>
                          {r.guestName}
                          {isCompleted && !isWalkIn && <span className="ml-1 text-[9px] opacity-90">PAID</span>}
                          {isCompleted && isWalkIn && <span className="ml-1 text-[9px] opacity-90">WALK-IN</span>}
                          {isNoShow && <span className="ml-1 text-[9px] opacity-90">NO-SHOW</span>}
                          {vState === "OVERRUN_SOFT" && <span className="ml-1 text-[9px]" style={{ color: "#F59E0B" }}>OVER</span>}
                          {vState === "OVERRUN_HARD" && <span className="ml-1 text-[9px]" style={{ color: "#EF4444" }}>⚠</span>}
                        </div>
                        <div className="text-[10px] truncate hidden md:block" style={{ color: isCompleted || isNoShow ? "rgba(255,255,255,0.85)" : C.text2 }}>{r.partySize}P &middot; {isNoShow ? "no-show" : `${getCurrentDuration(r).toFixed(1)}h`}</div>
                      </div>
                      {canSeat && (
                        <button onClick={(e) => { e.stopPropagation(); markSeated(r.id); }} className="flex-shrink-0 p-0.5 rounded hover:opacity-80 cursor-pointer" style={{ color: C.primary }} title="Mark seated">
                          <Utensils size={11} />
                        </button>
                      )}
                      {canPay && (
                        <button onClick={(e) => { e.stopPropagation(); markPaid(r.id); }} className="flex-shrink-0 p-0.5 rounded hover:opacity-80 cursor-pointer" style={{ color: C.primary }} title="Mark paid">
                          <CreditCard size={11} />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Pending assignment preview */}
                {isPending && assigningRez && (() => {
                  const startH = getStartHour(assigningRez);
                  const eH = getCurrentEndHour(assigningRez);
                  if (eH < calStartHour || startH > endHour) return null;
                  const left = Math.max(0, toPercent(startH));
                  const right = Math.min(100, toPercent(eH));
                  const w = right - left;
                  return (
                    <div className="absolute top-1 bottom-1 rounded px-2 py-0.5 pointer-events-none overflow-hidden animate-pulse" style={{ left: `${left}%`, width: `${w}%`, background: "rgba(43,108,255,0.08)", border: `2px dashed ${C.primary}` }}>
                      <div className="text-[11px] font-semibold truncate" style={{ color: C.primary }}>{assigningRez.guestName}</div>
                      <div className="text-[10px] truncate hidden md:block" style={{ color: C.text2 }}>{assigningRez.partySize}P &middot; {assigningRez.duration}h</div>
                    </div>
                  );
                })()}

                {/* Drag target ghost block */}
                {calDragRezId && calDragTargetTableId === table.id && (() => {
                  const dragRez = reservations.find((r) => r.id === calDragRezId);
                  if (!dragRez || dragRez.tableId === table.id) return null;
                  const startH = getStartHour(dragRez);
                  const eH = getCurrentEndHour(dragRez);
                  if (eH < calStartHour || startH > endHour) return null;
                  const left = Math.max(0, toPercent(startH));
                  const right = Math.min(100, toPercent(eH));
                  const w = right - left;
                  const canDrop = isTableAvailableForRez(table.id, dragRez);
                  return (
                    <div className="absolute top-1 bottom-1 rounded px-2 py-0.5 pointer-events-none overflow-hidden animate-pulse z-20" style={{ left: `${left}%`, width: `${w}%`, background: canDrop ? "rgba(43,108,255,0.12)" : "rgba(239,68,68,0.1)", border: `2px dashed ${canDrop ? C.primary : "#EF4444"}` }}>
                      <div className="text-[11px] font-semibold truncate" style={{ color: canDrop ? C.primary : "#EF4444" }}>{dragRez.guestName}</div>
                      <div className="text-[10px] truncate hidden md:block" style={{ color: C.text2 }}>{dragRez.partySize}P &middot; {dragRez.duration}h</div>
                    </div>
                  );
                })()}

                {/* Current time red line */}
                {showNowLine && (
                  <div className="absolute top-0 bottom-0 pointer-events-none z-10" style={{ left: `${nowPercent}%` }}>
                    <div className="w-2 h-2 rounded-full -ml-[3px] -mt-[3px]" style={{ background: "#EF4444" }} />
                    <div className="absolute top-0 bottom-0" style={{ width: 2, background: "#EF4444", marginLeft: -1 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
