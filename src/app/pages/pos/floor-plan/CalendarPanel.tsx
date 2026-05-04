import { Search, Clock, Users, Check, UserPlus, Crosshair, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useColors } from "./useColors";
import type { Reservation, Floor } from "./types";
import { TODAY } from "./data";
import { estimateDuration, getStartHour, getCurrentEndHour } from "./reservationLogic";

interface CalendarPanelProps {
  reservations: Reservation[];
  calSearch: string;
  setCalSearch: (v: string) => void;
  calCollapsed: Record<string, boolean>;
  toggleCalSection: (key: string) => void;
  assigningId: string | null;
  pendingAssignTableId: string | null;
  calSelectedDate: string;
  floors: Floor[];
  approveAndAssign: (rezId: string) => void;
  startAssigning: (rezId: string) => void;
  cancelAssign: () => void;
  confirmAssign: () => void;
  setPendingAssignTableId: (id: string | null) => void;
  navigateToRez: (rez: Reservation) => void;
  getTypeDot: (type: Reservation["type"]) => string;
}

export function CalendarPanel(props: CalendarPanelProps) {
  const {
    reservations, calSearch, setCalSearch, calCollapsed, toggleCalSection,
    assigningId, pendingAssignTableId, calSelectedDate, floors,
    approveAndAssign, startAssigning, cancelAssign, confirmAssign,
    setPendingAssignTableId, navigateToRez, getTypeDot,
  } = props;
  const C = useColors();

  const allRequests = reservations.filter((r) => r.type === "request");
  const allConfirmed = reservations.filter((r) => r.type === "confirmed");
  const filtered = (arr: Reservation[]) =>
    calSearch ? arr.filter((r) => r.guestName.toLowerCase().includes(calSearch.toLowerCase())) : arr;

  const shortDate = (d: string) => {
    if (d === TODAY) return "Today";
    const dt = new Date(d + "T00:00:00");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[dt.getMonth()]} ${dt.getDate()}`;
  };

  const renderReservationCard = (r: Reservation) => {
    const dotColor = getTypeDot(r.type);
    const allTablesFlat = floors.flatMap((f) => f.tables);
    const assignedTable = r.tableId ? allTablesFlat.find((t) => t.id === r.tableId) : null;
    const isBeingAssigned = assigningId === r.id;
    const hasPending = isBeingAssigned && pendingAssignTableId;
    const pendingTable = hasPending ? allTablesFlat.find((t) => t.id === pendingAssignTableId) : null;

    // Conflict: another reservation on the same table has extended into this one's start.
    const rStart = getStartHour(r);
    const hasConflict = !!r.tableId && reservations.some((o) =>
      o.id !== r.id && o.tableId === r.tableId && o.day === r.day &&
      o.status === "SEATED" && !o.paid && (o.extensionCount ?? 0) >= 2 &&
      getCurrentEndHour(o) > rStart && getStartHour(o) < rStart
    );

    return (
      <div
        key={r.id}
        className="rounded-lg p-3 mb-2 transition-all"
        style={{
          background: hasConflict ? "rgba(239,68,68,0.08)" : isBeingAssigned ? "rgba(43,108,255,0.1)" : C.raised,
          border: `1px solid ${hasConflict ? "#EF4444" : isBeingAssigned ? C.primary : C.border}`,
          boxShadow: isBeingAssigned ? "0 0 0 1px rgba(43,108,255,0.3)" : "none",
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
            {hasConflict && <AlertTriangle size={12} style={{ color: "#EF4444" }} />}
            <span className="font-semibold text-sm truncate" style={{ color: C.text1 }}>{r.guestName}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {r.type === "request" && !isBeingAssigned && (() => {
              const blocked = !!assigningId && assigningId !== r.id;
              return (
                <button
                  onClick={() => !blocked && approveAndAssign(r.id)}
                  disabled={blocked}
                  title={blocked ? "Finish the current assignment first" : "Approve request"}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${blocked ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
                  style={{
                    background: blocked ? "rgba(148,163,184,0.12)" : "rgba(43,108,255,0.15)",
                    color: blocked ? C.text3 : C.occupied.border,
                    opacity: blocked ? 0.55 : 1,
                  }}
                >
                  <Check size={12} /> Approve
                </button>
              );
            })()}
            {r.type === "confirmed" && !r.tableId && !isBeingAssigned && (() => {
              const blocked = !!assigningId && assigningId !== r.id;
              return (
                <button
                  onClick={() => !blocked && startAssigning(r.id)}
                  disabled={blocked}
                  title={blocked ? "Finish the current assignment first" : "Assign a table"}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${blocked ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: blocked ? C.text3 : C.text2,
                    opacity: blocked ? 0.55 : 1,
                  }}
                >
                  <UserPlus size={12} /> Assign
                </button>
              );
            })()}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-xs flex-wrap" style={{ color: C.text2 }}>
          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: r.day === calSelectedDate ? "rgba(239,68,68,0.1)" : C.raised, color: r.day === calSelectedDate ? "#EF4444" : C.text3 }}>{shortDate(r.day)}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{r.startTime}</span>
          <span className="flex items-center gap-1"><Users size={11} />{r.partySize}P</span>
          <span style={{ color: C.text3 }}>{estimateDuration(r.partySize)}h</span>
          {assignedTable && (
            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: C.occupied.fill, color: C.occupied.text }}>{assignedTable.label}</span>
          )}
          {r.day !== calSelectedDate && !isBeingAssigned && (
            <button onClick={(e) => { e.stopPropagation(); navigateToRez(r); }} className="text-[10px] px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80" style={{ color: C.primary, background: "rgba(43,108,255,0.08)" }}>View</button>
          )}
        </div>
        {isBeingAssigned && !hasPending && (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] animate-pulse" style={{ color: C.primary }}>
              <Crosshair size={12} />
              <span>Select a table on the timeline &rarr;</span>
            </div>
            <button onClick={cancelAssign} className="text-[10px] px-2 py-0.5 rounded cursor-pointer" style={{ color: C.text3, background: "rgba(255,255,255,0.04)" }}>Cancel</button>
          </div>
        )}
        {isBeingAssigned && hasPending && pendingTable && (
          <div className="mt-2 flex items-center justify-between gap-2 p-2 rounded-lg" style={{ background: "rgba(43,108,255,0.06)", border: `1px dashed ${C.primary}` }}>
            <div className="text-xs" style={{ color: C.text1 }}>
              &rarr; <strong>{pendingTable.label}</strong> <span style={{ color: C.text2 }}>({pendingTable.seats} seats)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={confirmAssign} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer hover:opacity-90" style={{ background: C.primary, color: "#fff" }}>
                <Check size={12} /> Confirm
              </button>
              <button onClick={() => setPendingAssignTableId(null)} className="px-2 py-1 rounded text-xs cursor-pointer" style={{ color: C.text3 }}>Change</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (key: string, label: string, items: Reservation[], dotColor: string, badgeBg: string, badgeColor: string) => (
    <>
      <button onClick={() => toggleCalSection(key)} className="flex items-center justify-between w-full py-2 cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
          <span className="text-xs font-semibold" style={{ color: C.text2 }}>{label}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: badgeBg, color: badgeColor }}>{items.length}</span>
        </div>
        {calCollapsed[key] ? <ChevronDown size={14} style={{ color: C.text3 }} /> : <ChevronUp size={14} style={{ color: C.text3 }} />}
      </button>
      {!calCollapsed[key] && filtered(items).map(renderReservationCard)}
    </>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: C.raised, border: `1px solid ${C.border}` }}>
          <Search size={14} style={{ color: C.text3 }} />
          <input value={calSearch} onChange={(e) => setCalSearch(e.target.value)} placeholder="Search by name..." className="flex-1 bg-transparent text-sm outline-none" style={{ color: C.text1 }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {renderSection("request", "Requests", allRequests, C.reserved.border, C.reserved.fill, C.reserved.text)}
        {renderSection("confirmed", "Confirmed", allConfirmed, C.occupied.border, C.occupied.fill, C.occupied.text)}
      </div>
    </div>
  );
}
