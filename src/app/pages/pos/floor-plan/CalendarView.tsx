import React from "react";
import {
  ChevronLeft, ChevronRight, CalendarDays, ZoomIn, ZoomOut, X,
  Crosshair, Check, Menu,
} from "lucide-react";
import { useColors } from "./useColors";
import { CalendarPanel } from "./CalendarPanel";
import { CalendarTimeline } from "./CalendarTimeline";
import { ReservationQRDrawer } from "./ReservationQRDrawer";
import { useCalendarState } from "./useCalendarState";
import type { Floor, Reservation } from "./types";
import { TODAY } from "./data";

interface CalendarViewProps {
  floors: Floor[];
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

const getBlockStyle = (type: Reservation["type"], C: ReturnType<typeof useColors>) => {
  switch (type) {
    case "confirmed": return { bg: C.occupied.fill, border: C.occupied.border, borderStyle: "solid" };
    case "request": return { bg: C.reserved.fill, border: C.reserved.border, borderStyle: "dashed" };
  }
};
const getTypeDot = (type: Reservation["type"], C: ReturnType<typeof useColors>) => {
  switch (type) {
    case "confirmed": return C.occupied.border;
    case "request": return C.reserved.border;
  }
};

const formatDateDisplay = (d: string) => {
  const dt = new Date(d + "T00:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[dt.getDay()]}, ${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
};

const calMonthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function buildCalendarMonth(baseDate: string) {
  const base = new Date(baseDate + "T00:00:00");
  const year = base.getFullYear(); const month = base.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) { week.push(d); if (week.length === 7) { weeks.push(week); week = []; } }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }
  return { year, month, weeks };
}

export function CalendarView({ floors, reservations, setReservations }: CalendarViewProps) {
  const C = useColors();
  const s = useCalendarState(floors, reservations, setReservations);
  const calMonth = buildCalendarMonth(s.calPickerBase);
  const [qrRezId, setQrRezId] = React.useState<string | null>(null);
  const qrRez = qrRezId ? reservations.find(r => r.id === qrRezId) ?? null : null;
  const qrTable = qrRez ? s.allTables.find(t => t.id === qrRez.tableId) ?? null : null;

  const panelProps = {
    reservations, calSearch: s.calSearch, setCalSearch: s.setCalSearch,
    calCollapsed: s.calCollapsed, toggleCalSection: s.toggleCalSection,
    assigningId: s.assigningId, pendingAssignTableId: s.pendingAssignTableId,
    calSelectedDate: s.calSelectedDate, floors,
    approveAndAssign: s.approveAndAssign, startAssigning: s.startAssigning,
    cancelAssign: s.cancelAssign, confirmAssign: s.confirmAssign,
    setPendingAssignTableId: s.setPendingAssignTableId,
    navigateToRez: s.navigateToRez,
    getTypeDot: (type: Reservation["type"]) => getTypeDot(type, C),
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: C.bg }}>
      {/* Date bar */}
      <div className="flex items-center justify-between flex-shrink-0 px-4 md:px-6 pt-3 pb-2 relative">
        <div className="flex items-center gap-2">
          {s.isMobile && (
            <button onClick={() => s.setCalPanelOpen(true)} className="p-1.5 rounded hover:opacity-80 cursor-pointer relative" style={{ color: C.text2 }}>
              <Menu size={18} />
              {s.allRequests.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: C.amber, color: "#fff" }}>{s.allRequests.length}</span>
              )}
            </button>
          )}
          <button onClick={() => s.setCalSelectedDate(s.shiftDate(s.calSelectedDate, -1))} className="p-1.5 rounded hover:opacity-80 cursor-pointer" style={{ color: C.text2 }}><ChevronLeft size={16} /></button>
          <button
            onClick={() => { s.setCalPickerBase(s.calSelectedDate); s.setCalDatePickerOpen(!s.calDatePickerOpen); }}
            className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:opacity-80"
            style={{ background: s.calDatePickerOpen ? C.raised : "transparent", border: s.calDatePickerOpen ? `1px solid ${C.border}` : "1px solid transparent" }}
          >
            <CalendarDays size={15} className="hidden md:block" style={{ color: C.text2 }} />
            <span className="text-sm font-semibold" style={{ color: C.text1 }}>
              {s.isMobile ? (() => { const dt = new Date(s.calSelectedDate + "T00:00:00"); return `${dt.getMonth()+1}/${dt.getDate()}`; })() : formatDateDisplay(s.calSelectedDate)}
            </span>
            {s.isToday && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>Today</span>}
            {!s.isMobile && s.rezCountForDate(s.calSelectedDate) > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: C.occupied.fill, color: C.occupied.text }}>{s.rezCountForDate(s.calSelectedDate)}</span>
            )}
          </button>
          <button onClick={() => s.setCalSelectedDate(s.shiftDate(s.calSelectedDate, 1))} className="p-1.5 rounded hover:opacity-80 cursor-pointer" style={{ color: C.text2 }}><ChevronRight size={16} /></button>
          {!s.isToday && !s.isMobile && (
            <button onClick={() => s.setCalSelectedDate(TODAY)} className="text-[10px] px-2 py-1 rounded cursor-pointer hover:opacity-80 ml-1" style={{ background: C.raised, color: C.text2, border: `1px solid ${C.border}` }}>Today</button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={s.calZoomIn} className="p-1.5 rounded hover:opacity-80 cursor-pointer" style={{ color: C.text2 }} title="Zoom in"><ZoomIn size={14} /></button>
          <button onClick={s.calGoToNow} className="px-2 py-1 rounded text-[10px] font-semibold hover:opacity-80 cursor-pointer" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>Now</button>
          <button onClick={s.calZoomOut} className="p-1.5 rounded hover:opacity-80 cursor-pointer" style={{ color: C.text2 }} title="Zoom out"><ZoomOut size={14} /></button>
          <span className="text-[10px] ml-1 tabular-nums hidden md:inline" style={{ color: C.text3 }}>{s.calWindowHours}h</span>
        </div>

        {/* Calendar date picker popup */}
        {s.calDatePickerOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => s.setCalDatePickerOpen(false)} />
            <div className="absolute left-4 md:left-6 top-full mt-1 z-50 rounded-xl p-4 shadow-2xl" style={{ background: C.card, border: `1px solid ${C.border}`, minWidth: 280 }}>
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => { const d = new Date(s.calPickerBase + "T00:00:00"); d.setMonth(d.getMonth() - 1); s.setCalPickerBase(d.toISOString().split("T")[0]); }} className="p-1 rounded cursor-pointer hover:opacity-80" style={{ color: C.text2 }}><ChevronLeft size={16} /></button>
                <span className="text-sm font-semibold" style={{ color: C.text1 }}>{calMonthNames[calMonth.month]} {calMonth.year}</span>
                <button onClick={() => { const d = new Date(s.calPickerBase + "T00:00:00"); d.setMonth(d.getMonth() + 1); s.setCalPickerBase(d.toISOString().split("T")[0]); }} className="p-1 rounded cursor-pointer hover:opacity-80" style={{ color: C.text2 }}><ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                  <div key={d} className="text-center text-[10px] py-1" style={{ color: C.text3 }}>{d}</div>
                ))}
              </div>
              {calMonth.weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-0.5">
                  {week.map((day, di) => {
                    if (!day) return <div key={di} />;
                    const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSel = dateStr === s.calSelectedDate;
                    const isTod = dateStr === TODAY;
                    const hasRez = reservations.some((r) => r.day === dateStr);
                    return (
                      <button key={di} onClick={() => { s.setCalSelectedDate(dateStr); s.setCalDatePickerOpen(false); }}
                        className="relative flex items-center justify-center py-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-all"
                        style={{ background: isSel ? C.primary : isTod ? "rgba(239,68,68,0.1)" : "transparent", color: isSel ? "#fff" : isTod ? "#EF4444" : C.text1, fontWeight: isSel || isTod ? 700 : 400 }}
                      >
                        {day}
                        {hasRez && !isSel && <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: C.primary }} />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-shrink-0 px-4 md:px-6 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-2.5 rounded-sm" style={{ background: C.occupied.fill, border: `1.5px solid ${C.occupied.border}` }} />
          <span className="text-[10px]" style={{ color: C.text3 }}>Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-2.5 rounded-sm" style={{ background: C.reserved.fill, border: `1.5px dashed ${C.reserved.border}` }} />
          <span className="text-[10px]" style={{ color: C.text3 }}>Request</span>
        </div>
      </div>

      {/* Notifications banner */}
      {s.notifications.length > 0 && (
        <div className="flex flex-col gap-1.5 mx-4 md:mx-6 mb-2 flex-shrink-0">
          {s.notifications.map((n) => (
            <div key={n.id} className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: n.kind === "conflict" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                border: `1px solid ${n.kind === "conflict" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
              }}>
              <span className="text-xs flex-1" style={{ color: C.text1 }}>{n.message}</span>
              <button onClick={() => s.dismissNotification(n.id)} className="p-1 rounded cursor-pointer hover:opacity-80" style={{ color: C.text3 }}><X size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Assign banner */}
      {s.assigningRez && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2 mx-4 md:mx-6 flex-shrink-0" style={{ background: "rgba(43,108,255,0.08)", border: `1px solid rgba(43,108,255,0.25)` }}>
          <Crosshair size={14} style={{ color: C.primary }} />
          <span className="text-xs flex-1" style={{ color: C.text1 }}>
            {s.pendingAssignTableId
              ? <>Confirm <strong>{s.assigningRez.guestName}</strong> &rarr; {s.allTables.find((t) => t.id === s.pendingAssignTableId)?.label}</>
              : <>Assign <strong>{s.assigningRez.guestName}</strong> ({s.assigningRez.partySize}P, {s.assigningRez.startTime}) &mdash; click a highlighted table row</>
            }
          </span>
          {s.pendingAssignTableId && (
            <button onClick={s.confirmAssign} className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer" data-no-drag style={{ background: C.primary, color: "#fff" }}>
              <Check size={12} /> Confirm
            </button>
          )}
          <button onClick={s.cancelAssign} className="p-1 rounded cursor-pointer hover:opacity-80" data-no-drag style={{ color: C.text3 }}><X size={14} /></button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <CalendarTimeline
          allTables={s.allTables} dayReservations={s.dayReservations} reservations={reservations}
          calStartHour={s.calStartHour} calWindowHours={s.calWindowHours}
          assigningId={s.assigningId} assigningRez={s.assigningRez}
          pendingAssignTableId={s.pendingAssignTableId} assignFlash={s.assignFlash}
          calDragRezId={s.calDragRezId} calDragTargetTableId={s.calDragTargetTableId}
          isTableAvailableForRez={s.isTableAvailableForRez}
          selectTableForAssign={s.selectTableForAssign}
          getBlockStyle={(type) => getBlockStyle(type, C)} getCalTimeLabels={s.getCalTimeLabels}
          showNowLine={s.showNowLine} nowPercent={s.nowPercent}
          handleCalDragStart={s.handleCalDragStart} calDragActive={s.calDragActive}
          handleCalRezDragStart={s.handleCalRezDragStart}
          calTimelineRef={s.calTimelineRef} calTableListRef={s.calTableListRef} calRowsRef={s.calRowsRef}
          handleTableListScroll={s.handleTableListScroll} handleTimelineScroll={s.handleTimelineScroll}
          nowHour={s.now.getHours() + s.now.getMinutes() / 60}
          isToday={s.isToday}
          markSeated={s.markSeated} markPaid={s.markPaid}
          onRezClick={setQrRezId}
        />
        {!s.isMobile && (
          <div className="w-72 flex-shrink-0 flex flex-col border-l overflow-hidden" style={{ borderColor: C.border, background: C.card }}>
            <CalendarPanel {...panelProps} />
          </div>
        )}
      </div>

      <ReservationQRDrawer
        reservation={qrRez}
        table={qrTable}
        onClose={() => setQrRezId(null)}
        nowHour={s.now.getHours() + s.now.getMinutes() / 60}
        isToday={s.isToday}
      />

      {/* Mobile drawer */}
      {s.isMobile && (
        <div className="fixed inset-0 z-50" style={{ pointerEvents: s.calPanelOpen ? "auto" : "none" }}>
          <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "rgba(0,0,0,0.5)", opacity: s.calPanelOpen ? 1 : 0 }} onClick={() => s.setCalPanelOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[85vw] max-w-[320px] flex flex-col overflow-hidden transition-transform duration-300 ease-out" style={{ background: C.card, borderRight: `1px solid ${C.border}`, transform: s.calPanelOpen ? "translateX(0)" : "translateX(-100%)" }}>
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="text-sm font-semibold" style={{ color: C.text1 }}>Reservations</span>
              <button onClick={() => s.setCalPanelOpen(false)} className="p-1 rounded cursor-pointer hover:opacity-80" style={{ color: C.text3 }}><X size={16} /></button>
            </div>
            <CalendarPanel {...panelProps} />
          </div>
        </div>
      )}
    </div>
  );
}
