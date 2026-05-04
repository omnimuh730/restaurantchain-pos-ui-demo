import { useState, useEffect } from "react";
import { MoreVertical, X, Clock, Users, QrCode } from "lucide-react";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { useColors } from "./useColors";
import type { Table } from "./types";
import { OrderItemsTable } from "../components/OrderItemsTable";

export function TableDrawer({ table, onClose, isMobile }: { table: Table | null; onClose: () => void; isMobile: boolean }) {
  const C = useColors();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (table) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [table]);

  if (!mounted) return null;

  const sel = table;

  const drawerContent = sel && (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="p-5 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold" style={{ color: C.text1 }}>{sel.label}</h2>
          <div className="flex items-center gap-2 mt-1 text-sm flex-wrap" style={{ color: C.text2 }}>
            <span className="flex items-center gap-1"><Users size={13} /> {sel.seats} seats</span>
            <span>|</span>
            <span className="flex items-center gap-1"><Clock size={13} /> 26 min</span>
            {sel.status === "occupied" && (<><span>|</span><span style={{ color: C.occupied.text }}>Occupied</span></>)}
            {sel.status === "reserved" && (<><span>|</span><span style={{ color: C.reserved.text }}>Reserved</span></>)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="cursor-pointer" style={{ color: C.text3 }}><MoreVertical size={18} /></button>
          <button onClick={onClose} className="cursor-pointer" style={{ color: C.text3 }}><X size={18} /></button>
        </div>
      </div>

      <div style={{ height: 1, background: C.border }} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {sel.status === "occupied" && sel.orderItems && (
          <OrderItemsTable
            items={sel.orderItems.filter((it) => it.qty > 0).map((it) => ({ name: it.name, qty: it.qty, price: it.price, currency: "domestic" }))}
          />
        )}
        {sel.status === "available" && (
          <div className="p-5 flex items-center justify-center" style={{ minHeight: 120 }}>
            <span style={{ color: C.text3 }}>No active orders</span>
          </div>
        )}
        {sel.status === "reserved" && (
          <div className="p-5">
            <div className="space-y-2">
              <div className="flex justify-between"><span style={{ color: C.text2 }}>Guest</span><span style={{ color: C.text1 }}>{sel.guestName}</span></div>
              <div className="flex justify-between"><span style={{ color: C.text2 }}>Time</span><span style={{ color: C.text1 }}>{sel.reservationTime}</span></div>
              <div className="flex justify-between"><span style={{ color: C.text2 }}>Party size</span><span style={{ color: C.text1 }}>{sel.seats}P</span></div>
            </div>
            <div className="mt-4 pt-4 flex flex-col items-center" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-1.5 mb-2">
                <QrCode size={13} style={{ color: C.primary }} />
                <span className="text-[11px] uppercase tracking-wider" style={{ color: C.text3 }}>Reservation QR</span>
              </div>
              <div className="rounded-xl p-3 bg-white shadow-sm">
                <QRCodeSVG
                  value={JSON.stringify({
                    type: "glassonion.reservation",
                    table: sel.label,
                    guest: sel.guestName,
                    party: sel.seats,
                    time: sel.reservationTime,
                  })}
                  size={156}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[11px] mt-2 text-center" style={{ color: C.text3 }}>
                Scan to view reservation or check in.
              </p>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: C.border }} />

      {/* Footer */}
      {sel.status === "occupied" && sel.revenue && (
        <div className="p-5 flex-shrink-0">
          <div className="flex justify-between mb-1">
            <span style={{ color: C.text2 }}>Order total ({sel.orderItems?.filter(it => it.qty > 0).reduce((a, b) => a + b.qty, 0)} items)</span>
            <span style={{ color: C.text1 }}>{"\u20A9"}{sel.revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold" style={{ color: C.text1 }}>Payment total</span>
            <span className="font-bold text-lg" style={{ color: C.text1 }}>{"\u20A9"}{sel.revenue.toLocaleString()}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                onClose();
                navigate("/pos/payment", {
                  state: {
                    totalUsd: 0,
                    totalKrw: sel.revenue ?? 0,
                    checkNumber: `T-${sel.id}`,
                    tableLabel: sel.label,
                    returnTo: "/pos",
                  },
                });
              }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
              style={{ background: C.primary, color: "#fff" }}
            >
              Payment
            </button>
          </div>
        </div>
      )}
      {sel.status === "available" && (
        <div className="p-5 flex-shrink-0">
          <button className="w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: C.primary, color: "#fff" }}>Seat Guest</button>
        </div>
      )}
      {sel.status === "reserved" && (
        <div className="p-5 flex-shrink-0">
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: C.primary, color: "#fff" }}>Check In</button>
            <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: C.raised, color: C.text1, border: `1px solid ${C.border}` }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    // Bottom sheet
    return (
      <div className="fixed inset-0 z-50" style={{ pointerEvents: visible ? "auto" : "none" }}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: "rgba(0,0,0,0.5)", opacity: visible ? 1 : 0 }}
          onClick={onClose}
        />
        {/* Sheet */}
        <div
          className="absolute left-0 right-0 bottom-0 rounded-t-2xl overflow-hidden transition-transform duration-300 ease-out flex flex-col"
          style={{
            background: C.card,
            maxHeight: "75vh",
            transform: visible ? "translateY(0)" : "translateY(100%)",
          }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ background: C.text3 }} />
          </div>
          {drawerContent}
        </div>
      </div>
    );
  }

  // Right drawer
  return (
    <div className="fixed inset-0 z-50" style={{ pointerEvents: visible ? "auto" : "none" }}>
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.4)", opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="absolute top-0 right-0 bottom-0 w-80 border-l overflow-hidden transition-transform duration-300 ease-out flex flex-col"
        style={{
          background: C.card,
          borderColor: C.border,
          transform: visible ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {drawerContent}
      </div>
    </div>
  );
}