import { useState, useEffect, useRef } from "react";
import { useThemeClasses, useTheme, ROLE_NAV_ACCESS } from "../theme-context";
import { PAYMENT_CARDS as INITIAL_CARDS } from "./data";
import { InlineModal, InlineToggle } from "./ui-helpers";
import { useNavBadges } from "../NavBadgeContext";
import { Shield, Eye, EyeOff, CreditCard, Check, X, QrCode, ScanLine, Camera, Loader2, Bell, LayoutGrid, ClipboardList, ChefHat } from "lucide-react";

export function SecurityPaymentsSettings({ passwordOnly = false }: { passwordOnly?: boolean }) {
  const tc = useThemeClasses();
  const { role } = useTheme();
  const { prefs, togglePref } = useNavBadges();
  const canFloor = ROLE_NAV_ACCESS[role].includes("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [selectedCard, setSelectedCard] = useState("1");
  const [cards, setCards] = useState(INITIAL_CARDS);

  // Add new card modal
  const [showAddCard, setShowAddCard] = useState(false);
  const [addCardMode, setAddCardMode] = useState<"type" | "qr">("type");
  const [newCardNumber, setNewCardNumber] = useState("");

  // QR scanning states
  const [qrScanning, setQrScanning] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [qrProgress, setQrProgress] = useState(0);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUpdatePassword = () => {
    if (password.length > 0 && password === confirmPassword) {
      setPasswordUpdated(true);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordUpdated(false), 3000);
    }
  };

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleAddCard = () => {
    const digits = newCardNumber.replace(/\D/g, "");
    if (digits.length < 4) return;
    const newCard = {
      id: String(Date.now()),
      brand: "credit card",
      last4: digits.slice(-4),
      expiry: "12/28",
      holderName: "New Card",
    };
    setCards((prev) => [...prev, newCard]);
    setShowAddCard(false);
    setNewCardNumber("");
    setAddCardMode("type");
    setQrScanning(false);
    setQrScanned(false);
    setQrProgress(0);
  };

  const startQrScan = () => {
    setQrScanning(true);
    setQrScanned(false);
    setQrProgress(0);

    // Simulate scanning progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setQrProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setQrScanning(false);
        setQrScanned(true);
        // Generate a random card number
        const randomDigits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
        setNewCardNumber(formatCardNumber(randomDigits));
      }
    }, 60);

    scanTimerRef.current = interval as any;
  };

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, []);

  const resetQrState = () => {
    setQrScanning(false);
    setQrScanned(false);
    setQrProgress(0);
    if (scanTimerRef.current) clearInterval(scanTimerRef.current);
  };

  return (
    <div className="space-y-4">
      {/* Password */}
      <div className={`${tc.card} rounded-lg`}>
        <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
          <h3 className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}><Shield className="w-4 h-4 text-blue-400" /> Password Settings</h3>
          <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>Update your manager PIN or account password</p>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>New Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setPasswordUpdated(false); }} placeholder="Enter new password" className={`${tc.input} pr-10`} />
              <button onClick={() => setShowPw(!showPw)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${tc.muted} cursor-pointer`}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>Confirm Password</label>
            <div className="relative">
              <input type={showCpw ? "text" : "password"} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordUpdated(false); }} placeholder="Confirm new password" className={`${tc.input} pr-10 ${confirmPassword.length > 0 && confirmPassword !== password ? "border-red-500 focus:border-red-500" : ""}`} />
              <button onClick={() => setShowCpw(!showCpw)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${tc.muted} cursor-pointer`}>
                {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && confirmPassword !== password && (
              <p className="text-[0.6875rem] text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpdatePassword}
              disabled={!password || password !== confirmPassword}
              className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${
                !password || password !== confirmPassword
                  ? `${tc.isDark ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"} cursor-not-allowed`
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Update Password
            </button>
            {passwordUpdated && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] ${
                tc.isDark ? "bg-blue-900/20 text-blue-400 border border-blue-800/30" : "bg-blue-50 text-blue-600 border border-blue-200"
              }`}>
                <Check className="w-3.5 h-3.5" />
                Password updated successfully
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={`${tc.card} rounded-lg`}>
        <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
          <h3 className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}><Bell className="w-4 h-4 text-blue-400" /> Notifications</h3>
          <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>Toggle toast alerts for incoming activity</p>
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          {canFloor && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tc.isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                  <LayoutGrid className="w-4 h-4 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[0.8125rem] ${tc.heading}`}>Floor Plan</p>
                  <p className={`text-[0.6875rem] ${tc.subtext}`}>New reservation requests</p>
                </div>
              </div>
              <InlineToggle checked={prefs.floor} onChange={() => togglePref("floor")} />
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tc.isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                <ChefHat className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className={`text-[0.8125rem] ${tc.heading}`}>Kitchen</p>
                <p className={`text-[0.6875rem] ${tc.subtext}`}>New chef tickets created</p>
              </div>
            </div>
            <InlineToggle checked={prefs.kitchen} onChange={() => togglePref("kitchen")} />
          </div>
        </div>
      </div>

      {/* Saved Cards */}
      {!passwordOnly && <div className={`${tc.card} rounded-lg`}>
        <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
          <h3 className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}><CreditCard className="w-4 h-4 text-blue-400" /> Saved Payment Methods</h3>
          <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>Manage your saved cards for billing</p>
        </div>
        <div className="p-4 sm:p-5 space-y-2">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                selectedCard === card.id
                  ? `border-blue-500 ${tc.isDark ? "bg-blue-900/10" : "bg-blue-50"}`
                  : `${tc.cardBorder} ${tc.hover}`
              }`}
            >
              <div className="w-10 h-7 rounded-md flex items-center justify-center bg-blue-600">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[0.8125rem] ${tc.isDark ? "text-gray-200" : "text-gray-700"}`}>Credit Card .... {card.last4}</p>
                <p className={`text-[0.6875rem] ${tc.muted}`}>{card.holderName} - Exp {card.expiry}</p>
              </div>
              {card.isDefault && <span className="text-[0.625rem] px-2 py-0.5 rounded-lg bg-blue-600/20 text-blue-400">Default</span>}
              {selectedCard === card.id && <Check className="w-4 h-4 text-blue-400" />}
            </div>
          ))}
          <button
            onClick={() => { setShowAddCard(true); setAddCardMode("type"); setNewCardNumber(""); resetQrState(); }}
            className={`w-full py-2.5 rounded-lg border-2 border-dashed text-[0.75rem] transition-colors cursor-pointer ${
              tc.isDark ? "border-gray-600 text-gray-500 hover:border-blue-500/30 hover:text-gray-300" : "border-gray-300 text-gray-400 hover:border-blue-400/30 hover:text-gray-600"
            }`}
          >
            + Add New Card
          </button>
        </div>
      </div>

      }

      {/* Add New Card Modal */}
      {!passwordOnly &&
      <InlineModal open={showAddCard} onClose={() => { setShowAddCard(false); resetQrState(); }} size="sm">
        <div className={`p-5 border-b ${tc.cardBorder}`}>
          <h3 className={`text-[1rem] ${tc.heading} flex items-center gap-2`}>
            <CreditCard className="w-5 h-5 text-blue-400" /> Add New Card
          </h3>
        </div>
        <div className="p-5 space-y-4">
          {/* Mode tabs */}
          <div className={`flex rounded-lg overflow-hidden border ${tc.cardBorder}`}>
            <button
              onClick={() => { setAddCardMode("type"); resetQrState(); setNewCardNumber(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[0.75rem] cursor-pointer transition-colors ${
                addCardMode === "type"
                  ? "bg-blue-600 text-white"
                  : `${tc.isDark ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Type Card Number
            </button>
            <button
              onClick={() => { setAddCardMode("qr"); setNewCardNumber(""); resetQrState(); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[0.75rem] cursor-pointer transition-colors ${
                addCardMode === "qr"
                  ? "bg-blue-600 text-white"
                  : `${tc.isDark ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> Scan QR Code
            </button>
          </div>

          {addCardMode === "type" ? (
            <div>
              <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>Card Number</label>
              <input
                value={newCardNumber}
                onChange={(e) => setNewCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className={`${tc.input} font-mono tracking-wider`}
              />
              <p className={`text-[0.6875rem] ${tc.muted} mt-1.5`}>Enter your 16-digit card number</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* QR Scanner viewport */}
              <div className={`relative rounded-lg border-2 overflow-hidden aspect-square max-h-[220px] mx-auto ${
                qrScanning ? "border-blue-500" : qrScanned ? "border-blue-400" : tc.isDark ? "border-gray-600" : "border-gray-300"
              } ${tc.isDark ? "bg-gray-900" : "bg-gray-950"}`}>
                {/* Camera simulation */}
                {qrScanning && (
                  <>
                    {/* Dark bg with viewfinder */}
                    <div className="absolute inset-0 bg-black/40" />
                    {/* Scanning corners */}
                    <div className="absolute inset-6">
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-blue-400" />
                      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-blue-400" />
                      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blue-400" />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-blue-400" />
                    </div>
                    {/* Scanning line animation */}
                    <div
                      className="absolute left-6 right-6 h-0.5 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      style={{
                        top: `${24 + (qrProgress / 100) * 52}%`,
                        transition: "top 0.06s linear",
                      }}
                    />
                    {/* Progress text */}
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <span className="text-[0.6875rem] text-blue-400 bg-black/60 px-2 py-0.5 rounded">
                        Scanning... {qrProgress}%
                      </span>
                    </div>
                  </>
                )}

                {!qrScanning && !qrScanned && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${tc.isDark ? "bg-blue-900/40" : "bg-blue-900/20"}`}>
                      <Camera className="w-7 h-7 text-blue-400" />
                    </div>
                    <p className="text-[0.75rem] text-gray-400 text-center px-4">Position QR code within the scanner frame</p>
                  </div>
                )}

                {qrScanned && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-[0.75rem] text-blue-400">Card scanned successfully!</p>
                  </div>
                )}
              </div>

              {/* Scanned result */}
              {qrScanned && newCardNumber && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${tc.isDark ? "bg-blue-900/15 border border-blue-800/30" : "bg-blue-50 border border-blue-200"}`}>
                  <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className={`text-[0.8125rem] font-mono tracking-wider ${tc.isDark ? "text-blue-300" : "text-blue-700"}`}>{newCardNumber}</span>
                </div>
              )}

              {/* Scan button */}
              {!qrScanning && !qrScanned && (
                <button
                  onClick={startQrScan}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-[0.75rem] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
                >
                  <ScanLine className="w-4 h-4" /> Start Scanning
                </button>
              )}

              {qrScanning && (
                <button
                  onClick={resetQrState}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}
                >
                  Cancel Scan
                </button>
              )}

              {qrScanned && (
                <button
                  onClick={() => { resetQrState(); setNewCardNumber(""); }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}
                >
                  Scan Again
                </button>
              )}
            </div>
          )}
        </div>
        <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
          <button onClick={() => { setShowAddCard(false); resetQrState(); }} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>Cancel</button>
          <button
            onClick={handleAddCard}
            disabled={newCardNumber.replace(/\D/g, "").length < 13}
            className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${
              newCardNumber.replace(/\D/g, "").length < 13
                ? `${tc.isDark ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"} cursor-not-allowed`
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Add Card
          </button>
        </div>
      </InlineModal>}
    </div>
  );
}
