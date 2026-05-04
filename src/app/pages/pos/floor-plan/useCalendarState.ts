import { useState, useRef, useEffect, useCallback } from "react";
import type { Floor, Reservation } from "./types";
import { TODAY } from "./data";
import { useIsMobile } from "./useColors";
import {
  estimateDuration, EXTENSION_INCREMENT_HOURS,
  getCurrentEndHour, getStartHour, findNextReservationOnTable,
} from "./reservationLogic";

export interface CalendarNotification {
  id: string;
  kind: "overrun" | "conflict";
  message: string;
  rezId: string;
}

export function useCalendarState(
  floors: Floor[],
  reservations: Reservation[],
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>,
) {
  const isMobile = useIsMobile();
  const [calPanelOpen, setCalPanelOpen] = useState(false);
  const [calSearch, setCalSearch] = useState("");
  const [calCollapsed, setCalCollapsed] = useState<Record<string, boolean>>({});
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [calSelectedDate, setCalSelectedDate] = useState(TODAY);
  const [calStartHour, setCalStartHour] = useState(16);
  const [calWindowHours, setCalWindowHours] = useState(8);
  const [calDragActive, setCalDragActive] = useState(false);
  const calDragRef = useRef({ startX: 0, startHour: 0 });
  const calTimelineRef = useRef<HTMLDivElement>(null);
  const calTableListRef = useRef<HTMLDivElement>(null);
  const calRowsRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(new Date());
  const [assignFlash, setAssignFlash] = useState<string | null>(null);
  const [pendingAssignTableId, setPendingAssignTableId] = useState<string | null>(null);
  const [calDatePickerOpen, setCalDatePickerOpen] = useState(false);
  const [calPickerBase, setCalPickerBase] = useState(TODAY);
  const [calDragRezId, setCalDragRezId] = useState<string | null>(null);
  const [calDragTargetTableId, setCalDragTargetTableId] = useState<string | null>(null);
  const calDragRezRef = useRef<{ rezId: string; startY: number; rowTop: number; tableIds: string[] } | null>(null);
  const calRowHeight = isMobile ? 54 : 62;
  const [notifications, setNotifications] = useState<CalendarNotification[]>([]);
  const notifiedOverrunRef = useRef<Set<string>>(new Set());
  const notifiedConflictRef = useRef<Set<string>>(new Set());

  const pushNotification = useCallback((n: CalendarNotification) => {
    setNotifications((prev) => [...prev, n]);
  }, []);
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markSeated = useCallback((rezId: string) => {
    setReservations((prev) => prev.map((r) => r.id === rezId
      ? { ...r, status: "SEATED" as const, type: "confirmed" as const, extensionCount: r.extensionCount ?? 0 }
      : r));
  }, [setReservations]);

  const markPaid = useCallback((rezId: string) => {
    setReservations((prev) => prev.map((r) => r.id === rezId
      ? { ...r, status: "COMPLETED" as const, paid: true }
      : r));
  }, [setReservations]);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(iv);
  }, []);

  // Auto-extension: every 60s, check SEATED+unpaid reservations past current end and extend by 30min.
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      if (n.toISOString().split("T")[0] !== TODAY) return;
      const nowH = n.getHours() + n.getMinutes() / 60;
      setReservations((prev) => {
        let changed = false;
        const next = prev.map((r) => {
          if (r.day !== TODAY) return r;
          if (r.status !== "SEATED") return r;
          if (r.paid) return r;
          const curEnd = getCurrentEndHour(r);
          if (nowH < curEnd) return r;
          changed = true;
          const newExt = (r.extensionCount ?? 0) + 1;
          const updated = { ...r, extensionCount: newExt };
          if (newExt === 1 && !notifiedOverrunRef.current.has(r.id)) {
            notifiedOverrunRef.current.add(r.id);
            pushNotification({
              id: `overrun-${r.id}-${Date.now()}`,
              kind: "overrun",
              rezId: r.id,
              message: `Table running over — ${r.guestName} still seated`,
            });
          }
          if (newExt === 2 && !notifiedConflictRef.current.has(r.id)) {
            const nextRez = findNextReservationOnTable(updated, prev);
            if (nextRez) {
              notifiedConflictRef.current.add(r.id);
              pushNotification({
                id: `conflict-${r.id}-${Date.now()}`,
                kind: "conflict",
                rezId: r.id,
                message: `⚠ Table conflict — ${nextRez.guestName} reserved at ${nextRez.startTime}`,
              });
            }
          }
          return updated;
        });
        return changed ? next : prev;
      });
    };
    tick();
    const iv = setInterval(tick, 60000);
    return () => clearInterval(iv);
  }, [setReservations, pushNotification]);

  const toggleCalSection = (key: string) => setCalCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  const clampStart = useCallback((s: number, wh?: number) => Math.max(0, Math.min(s, 24 - (wh ?? calWindowHours))), [calWindowHours]);

  const shiftDate = (d: string, offset: number) => {
    const dt = new Date(d + "T00:00:00");
    dt.setDate(dt.getDate() + offset);
    return dt.toISOString().split("T")[0];
  };

  const confirmAssign = () => {
    if (!assigningId || !pendingAssignTableId) return;
    setReservations((prev) => prev.map((r) => r.id === assigningId ? { ...r, tableId: pendingAssignTableId } : r));
    setAssignFlash(pendingAssignTableId);
    setTimeout(() => setAssignFlash(null), 800);
    setAssigningId(null); setPendingAssignTableId(null);
  };
  const cancelAssign = () => { setAssigningId(null); setPendingAssignTableId(null); };
  const selectTableForAssign = (tableId: string) => setPendingAssignTableId(tableId);

  const navigateToRez = useCallback((rez: Reservation) => {
    setCalSelectedDate(rez.day);
    const sh = parseInt(rez.startTime.split(":")[0]);
    const sm = parseInt(rez.startTime.split(":")[1]);
    setCalStartHour(clampStart(sh + sm / 60 - calWindowHours / 3));
  }, [clampStart, calWindowHours]);

  const approveAndAssign = (rezId: string) => {
    const rez = reservations.find((r) => r.id === rezId);
    setReservations((prev) => prev.map((r) => r.id === rezId
      ? { ...r, type: "confirmed" as const, status: "CONFIRMED" as const, duration: estimateDuration(r.partySize) }
      : r));
    if (rez && !rez.tableId) {
      setAssigningId(rezId); setPendingAssignTableId(null);
      navigateToRez(rez);
      if (isMobile) setCalPanelOpen(false);
    }
  };
  const startAssigning = (rezId: string) => {
    if (assigningId === rezId) { cancelAssign(); return; }
    const rez = reservations.find((r) => r.id === rezId);
    if (rez) navigateToRez(rez);
    setAssigningId(rezId); setPendingAssignTableId(null);
    if (isMobile) setCalPanelOpen(false);
  };

  const isTableAvailableForRez = useCallback((tableId: string, rez: Reservation) => {
    const allTables = floors.flatMap((f) => f.tables);
    const table = allTables.find((t) => t.id === tableId);
    if (table && table.seats < rez.partySize) return false;
    const rezStart = getStartHour(rez);
    const rezEnd = rezStart + estimateDuration(rez.partySize);
    const conflicting = reservations.filter((r) => r.tableId === tableId && r.id !== rez.id && r.day === rez.day && r.status !== "COMPLETED");
    for (const c of conflicting) {
      const cs = getStartHour(c);
      const ce = cs + estimateDuration(c.partySize);
      if (rezStart < ce && rezEnd > cs) return false;
    }
    return true;
  }, [reservations, floors]);

  // Timeline drag to pan
  const handleCalDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    setCalDragActive(true);
    calDragRef.current = { startX: e.clientX, startHour: calStartHour };
    e.preventDefault();
  };

  useEffect(() => {
    if (!calDragActive) return;
    const move = (e: MouseEvent) => {
      const el = calTimelineRef.current;
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      const dx = e.clientX - calDragRef.current.startX;
      const hoursDelta = -(dx / w) * calWindowHours;
      setCalStartHour(clampStart(calDragRef.current.startHour + hoursDelta));
    };
    const up = () => setCalDragActive(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [calDragActive, calWindowHours, clampStart]);

  // Wheel to zoom
  const handleCalWheel = useCallback((e: WheelEvent) => {
    e.preventDefault(); e.stopPropagation();
    const delta = e.deltaY > 0 ? 1 : -1;
    setCalWindowHours((prevW) => {
      const next = Math.min(24, Math.max(4, prevW + delta));
      setCalStartHour((prevS) => {
        const center = prevS + prevW / 2;
        return Math.max(0, Math.min(center - next / 2, 24 - next));
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const el = calTimelineRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleCalWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleCalWheel);
  }, [handleCalWheel]);

  // Sync vertical scroll
  const syncingScroll = useRef(false);
  const handleTableListScroll = useCallback(() => {
    if (syncingScroll.current) return;
    syncingScroll.current = true;
    if (calTableListRef.current && calRowsRef.current) calRowsRef.current.scrollTop = calTableListRef.current.scrollTop;
    syncingScroll.current = false;
  }, []);
  const handleTimelineScroll = useCallback(() => {
    if (syncingScroll.current) return;
    syncingScroll.current = true;
    if (calTableListRef.current && calRowsRef.current) calTableListRef.current.scrollTop = calRowsRef.current.scrollTop;
    syncingScroll.current = false;
  }, []);

  const calZoomIn = () => { const next = Math.max(4, calWindowHours - 2); const center = calStartHour + calWindowHours / 2; setCalStartHour(clampStart(center - next / 2, next)); setCalWindowHours(next); };
  const calZoomOut = () => { const next = Math.min(24, calWindowHours + 2); const center = calStartHour + calWindowHours / 2; setCalStartHour(clampStart(center - next / 2, next)); setCalWindowHours(next); };
  const calGoToNow = () => { const h = now.getHours() + now.getMinutes() / 60; setCalSelectedDate(TODAY); setCalStartHour(clampStart(h - calWindowHours / 3)); };

  // Reservation drag & drop between tables
  const handleCalRezDragStart = (e: React.MouseEvent, rezId: string) => {
    if (assigningId) return;
    e.preventDefault(); e.stopPropagation();
    const allTables = floors.flatMap((f) => f.tables);
    const tableIds = allTables.map((t) => t.id);
    const rowsEl = calRowsRef.current;
    const rowTop = rowsEl ? rowsEl.getBoundingClientRect().top - rowsEl.scrollTop : 0;
    calDragRezRef.current = { rezId, startY: e.clientY, rowTop, tableIds };
    setCalDragRezId(rezId); setCalDragTargetTableId(null);
  };

  useEffect(() => {
    if (!calDragRezId) return;
    const move = (e: MouseEvent) => {
      const ref = calDragRezRef.current;
      if (!ref) return;
      const rowsEl = calRowsRef.current;
      if (!rowsEl) return;
      const rect = rowsEl.getBoundingClientRect();
      const scrollTop = rowsEl.scrollTop;
      const relY = e.clientY - rect.top + scrollTop;
      const rowIdx = Math.floor(relY / calRowHeight);
      const targetId = rowIdx >= 0 && rowIdx < ref.tableIds.length ? ref.tableIds[rowIdx] : null;
      setCalDragTargetTableId(targetId);
    };
    const up = () => {
      const ref = calDragRezRef.current;
      if (ref && calDragTargetTableId) {
        const rez = reservations.find((r) => r.id === ref.rezId);
        if (rez && calDragTargetTableId !== rez.tableId) {
          if (isTableAvailableForRez(calDragTargetTableId, rez)) {
            setReservations((prev) => prev.map((r) => r.id === ref.rezId ? { ...r, tableId: calDragTargetTableId! } : r));
            setAssignFlash(calDragTargetTableId);
            setTimeout(() => setAssignFlash(null), 800);
          }
        }
      }
      setCalDragRezId(null); setCalDragTargetTableId(null); calDragRezRef.current = null;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [calDragRezId, calDragTargetTableId, reservations, isTableAvailableForRez, calRowHeight]);

  const getCalTimeLabels = useCallback(() => {
    const labels: { label: string; hour: number }[] = [];
    const step = calWindowHours <= 6 ? 1 : calWindowHours <= 12 ? 2 : 3;
    let h = Math.ceil(calStartHour / step) * step;
    while (h <= calStartHour + calWindowHours) {
      const display = h >= 24 ? `${h - 24}:00` : `${h}:00`;
      labels.push({ label: display, hour: h }); h += step;
    }
    return labels;
  }, [calStartHour, calWindowHours]);

  const allTables = floors.flatMap((f) => f.tables);
  const dayReservations = reservations.filter((r) => r.day === calSelectedDate);
  const allRequests = reservations.filter((r) => r.type === "request");
  const assigningRez = assigningId ? reservations.find((r) => r.id === assigningId) ?? null : null;
  const isToday = calSelectedDate === TODAY;
  const nowHour = now.getHours() + now.getMinutes() / 60;
  const endHour = calStartHour + calWindowHours;
  const showNowLine = isToday && nowHour >= calStartHour && nowHour <= endHour;
  const nowPercent = ((nowHour - calStartHour) / calWindowHours) * 100;
  const rezCountForDate = (d: string) => reservations.filter((r) => r.day === d).length;

  return {
    isMobile, calPanelOpen, setCalPanelOpen, calSearch, setCalSearch,
    calCollapsed, toggleCalSection, assigningId, calSelectedDate, setCalSelectedDate,
    calStartHour, calWindowHours, calDragActive, calTimelineRef, calTableListRef, calRowsRef,
    now, assignFlash, pendingAssignTableId, setPendingAssignTableId,
    calDatePickerOpen, setCalDatePickerOpen, calPickerBase, setCalPickerBase,
    calDragRezId, calDragTargetTableId, confirmAssign, cancelAssign,
    selectTableForAssign, navigateToRez, approveAndAssign, startAssigning,
    isTableAvailableForRez, handleCalDragStart, handleCalRezDragStart,
    handleTableListScroll, handleTimelineScroll, calZoomIn, calZoomOut, calGoToNow,
    getCalTimeLabels, allTables, dayReservations, allRequests,
    assigningRez, isToday, showNowLine, nowPercent, rezCountForDate, shiftDate,
    notifications, dismissNotification, markSeated, markPaid,
  };
}
