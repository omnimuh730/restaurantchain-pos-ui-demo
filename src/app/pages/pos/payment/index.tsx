import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "motion/react";
import { ArrowLeft, Banknote, Check, CreditCard, Receipt, Split, X, AlertCircle } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import cashImage from "../../../../imports/cash-payment.svg";

interface PaymentState {
  totalUsd?: number;
  totalKrw?: number;
  checkNumber?: string;
  tableLabel?: string;
  returnTo?: string;
}

interface PaymentPageProps {
  embedded?: boolean;
  totalUsd?: number;
  totalKrw?: number;
  checkNumber?: string;
  tableLabel?: string;
  onClose?: () => void;
}

type Method = "cash" | "credit" | "mix";

function AmountPair({ krw, usd }: { krw: number; usd: number }) {
  const showKrw = krw > 0;
  const showUsd = usd > 0;
  if (!showKrw && !showUsd) return <span className="text-red-600">$0.00</span>;
  return (
    <>
      {showKrw && <span className="text-blue-600">₩{Math.round(krw).toLocaleString()}</span>}
      {showKrw && showUsd && " + "}
      {showUsd && <span className="text-red-600">${usd.toFixed(2)}</span>}
    </>
  );
}

export default function PaymentPage(props: PaymentPageProps = {}) {
  const tc = useThemeClasses();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: PaymentState | null };

  const totalUsd = props.totalUsd ?? state?.totalUsd ?? 0;
  const totalKrw = props.totalKrw ?? state?.totalKrw ?? 0;
  const checkNumber = props.checkNumber ?? state?.checkNumber ?? "—";
  const tableLabel = props.tableLabel ?? state?.tableLabel ?? "—";
  const returnTo = state?.returnTo ?? "/pos";
  const embedded = props.embedded ?? false;
  const closeOrBack = () => {
    if (embedded && props.onClose) props.onClose();
    else navigate(-1);
  };
  const finishNav = () => {
    if (embedded && props.onClose) props.onClose();
    else navigate(returnTo);
  };

  const hasKrw = totalKrw > 0;
  const hasUsd = totalUsd > 0;

  const [method, setMethod] = useState<Method>("cash");
  const [done, setDone] = useState(false);
  const [creditView, setCreditView] = useState<0 | 1>(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardPassword, setCardPassword] = useState("");
  const [processingStep, setProcessingStep] = useState<number | null>(null);

  const processingSteps = [
    "Verifying card number…",
    "Verifying password…",
    "Checking available balance…",
    "Authorizing payment…",
    "Payment approved",
  ];

  const VALID_CARD = "1111111111111111";
  const VALID_PWD = "12345678";
  const BALANCE_LIMIT_KRW = 1_000_000;
  const BALANCE_LIMIT_USD = 1_000;

  const failure = useMemo(() => {
    if (processingStep === null) return null;
    if (cardNumber !== VALID_CARD) return { idx: 0, msg: "Card number not recognized. Please check the card number and try again." };
    if (cardPassword !== VALID_PWD) return { idx: 1, msg: "Incorrect password. Please try again." };
    if (totalKrw > BALANCE_LIMIT_KRW || totalUsd > BALANCE_LIMIT_USD) return { idx: 2, msg: "Insufficient balance on this card." };
    return null;
  }, [processingStep, cardNumber, cardPassword, totalKrw, totalUsd]);

  useEffect(() => {
    if (processingStep === null) return;
    if (failure && processingStep === failure.idx) return;
    if (processingStep >= processingSteps.length - 1) {
      const t = setTimeout(() => {
        setProcessingStep(null);
        setDone(true);
      }, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProcessingStep((s) => (s ?? 0) + 1), 800);
    return () => clearTimeout(t);
  }, [processingStep, failure]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -40) setCreditView(1);
    else if (dx > 40) setCreditView(0);
    setTouchStartX(null);
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    setTouchStartX(e.clientX);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || touchStartX == null) return;
    const dx = e.clientX - touchStartX;
    if (dx < -40) setCreditView(1);
    else if (dx > 40) setCreditView(0);
    setTouchStartX(null);
  };
  const maskCard = (digits: string) => {
    const d = digits.slice(0, 16);
    const stars = "*".repeat(d.length);
    return stars.replace(/(.{4})(?=.)/g, "$1-");
  };
  const maskPassword = (digits: string) => "*".repeat(digits.length);

  // Cash inputs (used for "cash" and the cash-portion of "mix")
  const [cashKrw, setCashKrw] = useState("");
  const [cashUsd, setCashUsd] = useState("");
  // Credit inputs (mix): if user edits credit, we derive cash; if edits cash, we derive credit
  const [creditKrw, setCreditKrw] = useState("");
  const [creditUsd, setCreditUsd] = useState("");
  const [lastEdited, setLastEdited] = useState<Record<"krw" | "usd", "cash" | "credit">>({
    krw: "cash",
    usd: "cash",
  });

  const cashKrwNum = parseFloat(cashKrw) || 0;
  const cashUsdNum = parseFloat(cashUsd) || 0;
  const creditKrwNum = parseFloat(creditKrw) || 0;
  const creditUsdNum = parseFloat(creditUsd) || 0;

  // For mix mode, keep cash+credit = total per currency based on last edited side.
  useEffect(() => {
    if (method !== "mix") return;
    if (lastEdited.krw === "cash") {
      const rest = Math.max(0, totalKrw - cashKrwNum);
      setCreditKrw(rest ? String(Math.round(rest)) : "");
    } else {
      const rest = Math.max(0, totalKrw - creditKrwNum);
      setCashKrw(rest ? String(Math.round(rest)) : "");
    }
  }, [cashKrw, creditKrw, lastEdited.krw, method, totalKrw]);

  useEffect(() => {
    if (method !== "mix") return;
    if (lastEdited.usd === "cash") {
      const rest = Math.max(0, totalUsd - cashUsdNum);
      setCreditUsd(rest ? rest.toFixed(2) : "");
    } else {
      const rest = Math.max(0, totalUsd - creditUsdNum);
      setCashUsd(rest ? rest.toFixed(2) : "");
    }
  }, [cashUsd, creditUsd, lastEdited.usd, method, totalUsd]);

  // Coverage
  const krwCashCover = cashKrwNum >= totalKrw - 0.5;
  const usdCashCover = cashUsdNum >= totalUsd - 0.005;
  const cashCovered = (!hasKrw || krwCashCover) && (!hasUsd || usdCashCover);

  const mixKrwOk = !hasKrw || Math.abs(cashKrwNum + creditKrwNum - totalKrw) < 1;
  const mixUsdOk = !hasUsd || Math.abs(cashUsdNum + creditUsdNum - totalUsd) < 0.01;
  const mixCovered = mixKrwOk && mixUsdOk && (creditKrwNum > 0 || creditUsdNum > 0 || cashKrwNum > 0 || cashUsdNum > 0);

  const krwChange = Math.max(0, cashKrwNum - (method === "mix" ? (totalKrw - creditKrwNum) : totalKrw));
  const usdChange = Math.max(0, cashUsdNum - (method === "mix" ? (totalUsd - creditUsdNum) : totalUsd));

  // QR payload: credit portion for mix, full total for credit
  const qrPayload = useMemo(() => {
    const krwCredit = method === "credit" ? totalKrw : method === "mix" ? creditKrwNum : 0;
    const usdCredit = method === "credit" ? totalUsd : method === "mix" ? creditUsdNum : 0;
    return JSON.stringify({
      kind: "pos-payment",
      check: checkNumber,
      table: tableLabel,
      method,
      krw: krwCredit,
      usd: usdCredit,
      ts: Date.now(),
    });
  }, [method, creditKrwNum, creditUsdNum, totalKrw, totalUsd, checkNumber, tableLabel]);

  const canConfirm =
    method === "cash" ? true :
    method === "credit" ? true :
    mixCovered;

  const confirm = () => {
    if (!canConfirm) return;
    setDone(true);
  };

  const finish = () => finishNav();

  const methodBtn = (m: Method, label: string, Icon: typeof Banknote) => {
    const active = method === m;
    return (
      <button
        key={m}
        onClick={() => setMethod(m)}
        className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-colors cursor-pointer ${
          active
            ? tc.isDark
              ? "border-blue-500 bg-blue-500/10 text-blue-400"
              : "border-blue-500 bg-blue-50 "
            : tc.isDark
              ? "border-slate-700 text-slate-400 hover:border-slate-600"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-[0.8125rem]">{label}</span>
      </button>
    );
  };

  const amountInput = (
    value: string,
    onChange: (v: string) => void,
    label: string,
    symbol: "₩" | "$",
    step: number,
    placeholder: string,
  ) => (
    <div>
      <div className="relative">
        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[0.875rem] ${symbol === "₩" ? "text-blue-600" : "text-red-600"}`}>{symbol}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="number"
          step={step}
          placeholder={placeholder}
          className={`${tc.input} pl-7 ${symbol === "₩" ? "!text-blue-600" : "!text-red-600"}`}
        />
      </div>
    </div>
  );

  return (
    <div className={`h-full overflow-y-auto ${tc.page}`}>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24 sm:pb-24 md:pb-6 min-h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={closeOrBack}
            className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
              tc.isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
            }`}
            aria-label="Back"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className={`text-[1.125rem] ${tc.heading}`}>Payment</h1>
            <p className={`text-[0.75rem] ${tc.subtext}`}>{tableLabel} · {checkNumber}</p>
          </div>
          
        </div>

        {/* Amount summary */}
        <div className="mb-6">
          <p className="text-[1.5rem] font-bold">
            {hasKrw && <span className="text-blue-600">₩{Math.round(totalKrw).toLocaleString()}</span>}
            {hasKrw && hasUsd && <span className={tc.subtext}> + </span>}
            {hasUsd && <span className="text-red-600">${totalUsd.toFixed(2)}</span>}
          </p>
        </div>

        {!done && (
          <>
            {/* Method selector */}
            <div className="flex gap-2 mb-6">
              {methodBtn("cash", "Cash", Banknote)}
              {methodBtn("credit", "Credit", CreditCard)}
              {methodBtn("mix", "Mix", Split)}
            </div>

            {/* Method content */}
            {method === "cash" && (
              <div className="flex-1 flex flex-col items-center justify-center mb-6">
                <img src={cashImage} alt="Cash payment" className="w-58 h-58 object-contain [filter:drop-shadow(0_0_0.4px_#2563eb)_drop-shadow(0_0_0.4px_#2563eb)]" />
              </div>
            )}

            {method === "credit" && (
              <div
                className="flex-1 flex flex-col items-center justify-center mb-6 overflow-hidden select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                <div className="w-full overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${creditView * 100}%)` }}
                  >
                    <div className="w-full shrink-0 flex justify-center">
                      <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <QRCodeSVG value={qrPayload} size={224} level="M" />
                      </div>
                    </div>
                    <div className="w-full shrink-0 flex justify-center px-4">
                      <div className={`w-full max-w-xs rounded-xl p-5 border ${tc.isDark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"} space-y-4`}>
                        <div>
                          <label className={`block mb-1.5 ${tc.subtle}`}>Card Number</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            value={maskCard(cardNumber)}
                            onChange={(e) => {
                              const newDigits = e.target.value.replace(/[^0-9]/g, "");
                              if (newDigits.length > 0) {
                                setCardNumber((prev) => (prev + newDigits).slice(0, 16));
                              } else {
                                const prevMaskedLen = maskCard(cardNumber).length;
                                const removed = Math.max(1, prevMaskedLen - e.target.value.length);
                                setCardNumber((prev) => prev.slice(0, Math.max(0, prev.length - removed)));
                              }
                            }}
                            placeholder="****-****-****-****"
                            className={`${tc.input} tracking-widest`}
                          />
                        </div>
                        <div>
                          <label className={`block mb-1.5 ${tc.subtle}`}>Password</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            value={maskPassword(cardPassword)}
                            onChange={(e) => {
                              const newDigits = e.target.value.replace(/[^0-9]/g, "");
                              if (newDigits.length > 0) {
                                setCardPassword((prev) => prev + newDigits);
                              } else {
                                const removed = Math.max(1, cardPassword.length - e.target.value.length);
                                setCardPassword((prev) => prev.slice(0, Math.max(0, prev.length - removed)));
                              }
                            }}
                            placeholder="********"
                            className={`${tc.input} tracking-widest`}
                          />
                        </div>
                        <button
                          type="button"
                          disabled={cardNumber.length < 16 || cardPassword.length < 1}
                          onClick={() => setProcessingStep(0)}
                          className="w-full py-2.5 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                        >
                          Proceed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCreditView(0)}
                      className={`w-2 h-2 rounded-full transition-colors ${creditView === 0 ? "bg-blue-600" : tc.isDark ? "bg-slate-600" : "bg-slate-300"}`}
                      aria-label="QR view"
                    />
                    <button
                      type="button"
                      onClick={() => setCreditView(1)}
                      className={`w-2 h-2 rounded-full transition-colors ${creditView === 1 ? "bg-blue-600" : tc.isDark ? "bg-slate-600" : "bg-slate-300"}`}
                      aria-label="Manual entry view"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 select-none">
                    {creditView === 1 && (
                      <motion.span
                        className="tracking-tighter"
                        animate={{ x: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        aria-hidden
                      >
                        {"<<"}
                      </motion.span>
                    )}
                    <span className="text-[0.8125rem]">
                      {creditView === 0 ? "Swipe to card payment" : "Swipe back to QR"}
                    </span>
                    {creditView === 0 && (
                      <motion.span
                        className="tracking-tighter"
                        animate={{ x: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        aria-hidden
                      >
                        {">>"}
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {method === "mix" && (
              <div className="flex-1 flex flex-col">
                <div className={`grid grid-cols-2 gap-0 rounded-xl border ${tc.isDark ? "border-slate-700" : "border-slate-200"} overflow-hidden mb-4`}>
                  {/* Cash column */}
                  <div className={`p-4 border-r ${tc.isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <p className={`text-[0.875rem] ${tc.heading} mb-3 text-[16px] flex items-center justify-center gap-1.5`}>
                      <Banknote className="w-4 h-4" /> Cash
                    </p>
                    <div className="space-y-3">
                      {hasKrw && (
                        <div onFocus={() => setLastEdited((s) => ({ ...s, krw: "cash" }))}>
                          {amountInput(cashKrw, (v) => { setLastEdited((s) => ({ ...s, krw: "cash" })); setCashKrw(v); }, "Domestic", "₩", 100, "0")}
                        </div>
                      )}
                      {hasUsd && (
                        <div onFocus={() => setLastEdited((s) => ({ ...s, usd: "cash" }))}>
                          {amountInput(cashUsd, (v) => { setLastEdited((s) => ({ ...s, usd: "cash" })); setCashUsd(v); }, "Foreign", "$", 0.01, "0.00")}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Credit column */}
                  <div className="p-4">
                    <p className={`text-[0.875rem] ${tc.heading} mb-3 text-[16px] flex items-center justify-center gap-1.5`}>
                      <CreditCard className="w-4 h-4" /> Credit
                    </p>
                    <div className="space-y-3">
                      {hasKrw && (
                        <div onFocus={() => setLastEdited((s) => ({ ...s, krw: "credit" }))}>
                          {amountInput(creditKrw, (v) => { setLastEdited((s) => ({ ...s, krw: "credit" })); setCreditKrw(v); }, "Domestic", "₩", 100, "0")}
                        </div>
                      )}
                      {hasUsd && (
                        <div onFocus={() => setLastEdited((s) => ({ ...s, usd: "credit" }))}>
                          {amountInput(creditUsd, (v) => { setLastEdited((s) => ({ ...s, usd: "credit" })); setCreditUsd(v); }, "Foreign", "$", 0.01, "0.00")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {!mixKrwOk && (
                  <p className="text-[0.75rem] text-red-500 mb-2">
                    Cash + credit must equal <span className="text-blue-600">₩{Math.round(totalKrw).toLocaleString()}</span>
                  </p>
                )}
                {!mixUsdOk && (
                  <p className="text-[0.75rem] text-red-500 mb-2">
                    Cash + credit must equal <span className="text-red-600">${totalUsd.toFixed(2)}</span>
                  </p>
                )}

                {(creditKrwNum > 0 || creditUsdNum > 0) && (
                  <div className="flex-1 flex flex-col items-center justify-center mb-6">
                    
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                      <QRCodeSVG value={qrPayload} size={180} level="M" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm */}
            <button
              onClick={confirm}
              disabled={!canConfirm}
              className={`mt-auto w-full py-3 rounded-xl text-[0.875rem] cursor-pointer transition-colors shadow-lg ${
                canConfirm
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : tc.isDark
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Confirm Payment
            </button>
          </>
        )}

        {done && (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3 shadow-lg">
              <Check className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <h2 className={`text-[1.125rem] ${tc.heading}`}>Payment complete</h2>
            <p className={`text-[0.8125rem] ${tc.subtext} mt-1`}>
              {method === "cash" && <>Cash <AmountPair krw={cashKrwNum} usd={cashUsdNum} /></>}
              {method === "credit" && <>Credit <AmountPair krw={totalKrw} usd={totalUsd} /></>}
              {method === "mix" && (
                <>
                  Cash <AmountPair krw={cashKrwNum} usd={cashUsdNum} />
                  {" · "}
                  Credit <AmountPair krw={creditKrwNum} usd={creditUsdNum} />
                </>
              )}
            </p>
            <button
              onClick={finish}
              className="mt-5 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.875rem] cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Done
            </button>
          </div>
        )}
      </div>
      {processingStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-sm mx-4 rounded-2xl p-6 ${tc.isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"} shadow-xl`}>
            <div className="flex items-center gap-3 mb-4">
              {failure && processingStep === failure.idx ? (
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </div>
              ) : processingStep < processingSteps.length - 1 ? (
                <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <h3 className={tc.heading}>{failure && processingStep === failure.idx ? "Payment Failed" : "Card Payment"}</h3>
            </div>
            <ul className="space-y-2">
              {processingSteps.map((label, i) => {
                const isFailed = failure && i === failure.idx && processingStep === failure.idx;
                const status = isFailed ? "failed" : i < processingStep ? "done" : i === processingStep ? "active" : "pending";
                return (
                  <li key={label} className="flex items-center gap-2">
                    {status === "done" && <Check className="w-4 h-4 text-blue-600" />}
                    {status === "active" && <span className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />}
                    {status === "failed" && <X className="w-4 h-4 text-red-600" />}
                    {status === "pending" && <span className={`w-3 h-3 rounded-full ${tc.isDark ? "bg-slate-600" : "bg-slate-300"}`} />}
                    <span className={`text-[0.875rem] ${status === "failed" ? "text-red-600" : status === "pending" ? tc.subtle : tc.heading}`}>{label}</span>
                  </li>
                );
              })}
            </ul>
            {failure && processingStep === failure.idx && (
              <div className={`mt-4 flex items-start gap-2 p-3 rounded-lg ${tc.isDark ? "bg-red-950/40 border border-red-900" : "bg-red-50 border border-red-200"}`}>
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <p className="text-[0.8125rem] text-red-600">{failure.msg}</p>
              </div>
            )}
            {failure && processingStep === failure.idx && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setProcessingStep(null)}
                  className={`px-4 py-2 rounded-lg ${tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"} transition-colors`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
