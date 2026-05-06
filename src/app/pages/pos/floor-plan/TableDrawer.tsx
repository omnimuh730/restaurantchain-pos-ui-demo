import { useState, useEffect } from "react";
import { MoreVertical, X, Clock, Users, QrCode } from "lucide-react";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { useColors } from "./useColors";
import type { Table } from "./types";
import { OrderItemsTable } from "../components/OrderItemsTable";
import { formatTableLabel } from "./floorI18n";
import { formatDomesticWon } from "../../../../i18n/formatMoney";

export function TableDrawer({ table, onClose, isMobile }: { table: Table | null; onClose: () => void; isMobile: boolean }) {
  const { t } = useTranslation("floor");
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
          <h2 className="text-lg font-bold" style={{ color: C.text1 }}>{formatTableLabel(sel.label, t)}</h2>
          <div className="flex items-center gap-2 mt-1 text-sm flex-wrap" style={{ color: C.text2 }}>
            <span className="flex items-center gap-1"><Users size={13} /> {t("drawer.seatCount", { n: sel.seats })}</span>
            <span>|</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {t("drawer.minutes", { n: 26 })}</span>
            {sel.status === "occupied" && (<><span>|</span><span style={{ color: C.occupied.text }}>{t("drawer.occupied")}</span></>)}
            {sel.status === "reserved" && (<><span>|</span><span style={{ color: C.reserved.text }}>{t("drawer.reserved")}</span></>)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="cursor-pointer" style={{ color: C.text3 }} aria-label={t("drawer.moreOptionsAria")}><MoreVertical size={18} /></button>
          <button type="button" onClick={onClose} className="cursor-pointer" style={{ color: C.text3 }} aria-label={t("drawer.closeAria")}><X size={18} /></button>
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
            <span style={{ color: C.text3 }}>{t("drawer.noActiveOrders")}</span>
          </div>
        )}
        {sel.status === "reserved" && (
          <div className="p-5">
            <div className="space-y-2">
              <div className="flex justify-between"><span style={{ color: C.text2 }}>{t("drawer.guest")}</span><span style={{ color: C.text1 }}>{sel.guestName}</span></div>
              <div className="flex justify-between"><span style={{ color: C.text2 }}>{t("drawer.time")}</span><span style={{ color: C.text1 }}>{sel.reservationTime}</span></div>
              <div className="flex justify-between"><span style={{ color: C.text2 }}>{t("drawer.partySize")}</span><span style={{ color: C.text1 }}>{t("drawer.partyShort", { n: sel.seats })}</span></div>
            </div>
            <div className="mt-4 pt-4 flex flex-col items-center" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-1.5 mb-2">
                <QrCode size={13} style={{ color: C.primary }} />
                <span className="text-[11px] uppercase tracking-wider" style={{ color: C.text3 }}>{t("drawer.reservationQr")}</span>
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
                {t("drawer.qrScanHint")}
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
            <span style={{ color: C.text2 }}>{t("drawer.orderTotal", { count: sel.orderItems?.filter(it => it.qty > 0).reduce((a, b) => a + b.qty, 0) ?? 0 })}</span>
            <span style={{ color: C.text1 }}>{formatDomesticWon(sel.revenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold" style={{ color: C.text1 }}>{t("drawer.paymentTotal")}</span>
            <span className="font-bold text-lg" style={{ color: C.text1 }}>{formatDomesticWon(sel.revenue)}</span>
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
              {t("drawer.payment")}
            </button>
          </div>
        </div>
      )}
      {sel.status === "available" && (
        <div className="p-5 flex-shrink-0">
          <button type="button" className="w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: C.primary, color: "#fff" }}>{t("drawer.seatGuest")}</button>
        </div>
      )}
      {sel.status === "reserved" && (
        <div className="p-5 flex-shrink-0">
          <div className="flex gap-2">
            <button type="button" className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: C.primary, color: "#fff" }}>{t("drawer.checkIn")}</button>
            <button type="button" className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: C.raised, color: C.text1, border: `1px solid ${C.border}` }}>{t("drawer.cancel")}</button>
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