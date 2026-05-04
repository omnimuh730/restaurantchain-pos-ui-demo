import { useState, useEffect } from "react";
import { X, Clock, Users, Calendar, MapPin, QrCode, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useColors, useIsMobile } from "./useColors";
import type { Reservation, Table } from "./types";
import {
  estimateDuration, getStartHour, getCurrentEndHour, getBlockVisualState,
} from "./reservationLogic";

interface ReservationQRDrawerProps {
  reservation: Reservation | null;
  table: Table | null;
  onClose: () => void;
  nowHour?: number;
  isToday?: boolean;
}

export function ReservationQRDrawer({ reservation, table, onClose, nowHour = 0, isToday = false }: ReservationQRDrawerProps) {
  const C = useColors();
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reservation) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [reservation]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  if (!mounted || !reservation) return null;

  const startH = getStartHour(reservation);
  const endH = getCurrentEndHour(reservation);
  const fmtH = (h: number) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };
  const visState = isToday ? getBlockVisualState(reservation, nowHour, isToday) : "ON_TIME";
  const statusLabel =
    reservation.status === "COMPLETED" || reservation.paid ? "Paid" :
    reservation.status === "NO_SHOW" ? "No-show" :
    reservation.status === "SEATED" ? "Seated" :
    reservation.type === "request" ? "Requested" : "Confirmed";
  const statusColor =
    reservation.status === "COMPLETED" || reservation.paid ? C.primary :
    reservation.status === "NO_SHOW" ? "#94A3B8" :
    visState === "OVERRUN_HARD" ? "#EF4444" :
    visState === "OVERRUN_SOFT" ? "#F59E0B" :
    reservation.type === "request" ? C.reserved.border : C.occupied.border;

  // QR payload: deep-link style URL the guest can scan to view their reservation/check-in.
  const qrPayload = JSON.stringify({
    type: "glassonion.reservation",
    id: reservation.id,
    table: table?.label ?? reservation.tableId,
    guest: reservation.guestName,
    party: reservation.partySize,
    day: reservation.day,
    start: reservation.startTime,
  });

  const copy = async () => {
    try { await navigator.clipboard.writeText(qrPayload); setCopied(true); } catch {}
  };

  const body = (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="p-5 flex items-start justify-between flex-shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <QrCode size={16} style={{ color: C.primary }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: C.text3 }}>Reservation QR</span>
          </div>
          <h2 className="text-lg font-bold truncate" style={{ color: C.text1 }}>{reservation.guestName}</h2>
          <div className="flex items-center gap-2 mt-1 text-sm flex-wrap" style={{ color: C.text2 }}>
            <span className="flex items-center gap-1"><Users size={13} />{reservation.partySize}P</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={13} />{fmtH(startH)}–{fmtH(endH)}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "rgba(43,108,255,0.1)", color: statusColor, border: `1px solid ${statusColor}33` }}>
              {statusLabel}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="cursor-pointer flex-shrink-0" style={{ color: C.text3 }} aria-label="Close"><X size={18} /></button>
      </div>

      <div style={{ height: 1, background: C.border }} />

      {/* QR */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col items-center">
          <div className="rounded-xl p-4 bg-white shadow-sm">
            <QRCodeSVG value={qrPayload} size={196} level="M" includeMargin={false} />
          </div>
          <p className="text-[11px] mt-3 text-center" style={{ color: C.text3 }}>
            Scan to view reservation, check in, or pay.
          </p>
          <button
            onClick={copy}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: C.raised, color: C.text2, border: `1px solid ${C.border}` }}
          >
            {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy link payload</>}
          </button>
        </div>

        {/* Details */}
        <div className="mt-5 space-y-2">
          <Row label="Reservation ID" value={reservation.id} C={C} />
          <Row label="Guest" value={reservation.guestName} C={C} />
          <Row label="Party size" value={`${reservation.partySize} guests`} C={C} icon={Users} />
          <Row label="Date" value={reservation.day} C={C} icon={Calendar} />
          <Row label="Time" value={`${fmtH(startH)} – ${fmtH(endH)}`} C={C} icon={Clock} />
          <Row label="Estimated duration" value={`${estimateDuration(reservation.partySize)}h`} C={C} />
          <Row label="Table" value={table?.label ?? reservation.tableId ?? "Unassigned"} C={C} icon={MapPin} />
          {(reservation.extensionCount ?? 0) > 0 && (
            <Row label="Extensions" value={`${reservation.extensionCount} × 30 min`} C={C} />
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[60]" style={{ pointerEvents: visible ? "auto" : "none" }}>
        <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "rgba(0,0,0,0.5)", opacity: visible ? 1 : 0 }} onClick={onClose} />
        <div
          className="absolute left-0 right-0 bottom-0 rounded-t-2xl overflow-hidden transition-transform duration-300 ease-out flex flex-col"
          style={{ background: C.card, maxHeight: "85vh", transform: visible ? "translateY(0)" : "translateY(100%)" }}
        >
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ background: C.text3 }} />
          </div>
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60]" style={{ pointerEvents: visible ? "auto" : "none" }}>
      <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "rgba(0,0,0,0.4)", opacity: visible ? 1 : 0 }} onClick={onClose} />
      <div
        className="absolute top-0 right-0 bottom-0 w-[360px] border-l overflow-hidden transition-transform duration-300 ease-out flex flex-col"
        style={{ background: C.card, borderColor: C.border, transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        {body}
      </div>
    </div>
  );
}

function Row({ label, value, C, icon: Icon }: { label: string; value: string; C: ReturnType<typeof useColors>; icon?: typeof Clock }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[12px] flex items-center gap-1.5" style={{ color: C.text2 }}>
        {Icon && <Icon size={12} style={{ color: C.text3 }} />}{label}
      </span>
      <span className="text-[13px] truncate" style={{ color: C.text1 }}>{value}</span>
    </div>
  );
}
