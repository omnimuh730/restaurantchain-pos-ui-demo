import { useState } from "react";
import { useThemeClasses } from "../theme-context";
import { Check, Sparkles, Crown, AlertTriangle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InlineModal } from "./ui-helpers";
import { PRO_FEATURES, ULTRA_FEATURES } from "./data";
import { SlideToPay } from "./SlideToPay";

export function UpgradePlans() {
  const tc = useThemeClasses();
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "ultra">("free");
  const [confirmModal, setConfirmModal] = useState<{ type: "subscribe" | "cancel"; plan: string } | null>(null);
  const [showPayment, setShowPayment] = useState<{ plan: string; amount: string } | null>(null);

  const handleChoose = (plan: string) => setConfirmModal({ type: "subscribe", plan });
  const handleCancel = () => setConfirmModal({ type: "cancel", plan: currentPlan });
  const confirmSubscribe = () => { const plan = confirmModal!.plan; setConfirmModal(null); setShowPayment({ plan, amount: plan === "pro" ? "$49" : "$99" }); };
  const confirmCancelSub = () => { setCurrentPlan("free"); setConfirmModal(null); };
  const onPaymentComplete = () => { setCurrentPlan(showPayment!.plan as "pro" | "ultra"); setShowPayment(null); };
  const planLabel = currentPlan === "pro" ? "Pro" : currentPlan === "ultra" ? "Ultra" : "Free";
  const planFeatures = currentPlan === "pro" ? PRO_FEATURES : currentPlan === "ultra" ? ULTRA_FEATURES : [];
  const planPrice = currentPlan === "pro" ? "$49" : currentPlan === "ultra" ? "$99" : "$0";

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {showPayment ? (
          <SlideToPay key="payment" amount={showPayment.amount} planName={showPayment.plan === "pro" ? "Pro" : "Ultra"} onComplete={onPaymentComplete} onCancel={() => setShowPayment(null)} />
        ) : (
          <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {currentPlan !== "free" && (
              <div className={`${tc.card} rounded-lg relative overflow-hidden ${tc.isDark ? "border-blue-500/30" : "border-blue-200"}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[100px]" />
                <div className={`p-5 border-b ${tc.cardBorder}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${currentPlan === "ultra" ? "bg-blue-600 text-white" : tc.iconBg}`}>
                      {currentPlan === "ultra" ? <Crown className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-[0.9375rem] ${tc.heading}`}>{planLabel} Plan</h3>
                        <span className={`px-2 py-0.5 rounded-lg text-[0.625rem] ${tc.isDark ? "bg-blue-900/30 text-blue-400 border border-blue-700/50" : "bg-blue-100 text-blue-700 border border-blue-200"}`}>Active</span>
                      </div>
                      <p className={`text-[0.75rem] ${tc.subtext}`}>{planPrice}/month - Next billing: May 17, 2026</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {planFeatures.slice(0, 4).map((f) => (
                      <div key={f} className={`flex items-center gap-2 text-[0.75rem] ${tc.subtext}`}><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />{f}</div>
                    ))}
                  </div>
                  <div className={`border-t ${tc.cardBorder} my-3`} />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-3">
                    {currentPlan === "pro" && <button onClick={() => handleChoose("ultra")} className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}><Crown className="w-4 h-4" /> Upgrade to Ultra</button>}
                    <button onClick={handleCancel} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg ${tc.dangerText} hover:bg-red-900/10 cursor-pointer transition-colors`}>Cancel Subscription</button>
                  </div>
                </div>
              </div>
            )}
            {currentPlan === "free" && (
              <div className="p-5">
                <h3 className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}><Sparkles className="w-4 h-4 text-blue-400" /> Upgrade Your Plan</h3>
                <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>Unlock premium features to grow your restaurant business</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Pro */}
              <div className={`${tc.card} rounded-lg p-5 relative overflow-hidden transition-all ${tc.hover} ${currentPlan === "pro" ? "ring-2 ring-blue-500/30 opacity-60" : ""}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-[80px]" />
                <div className="flex items-center gap-3 mb-4"><div className={`w-10 h-10 rounded-lg ${tc.iconBg} flex items-center justify-center`}><Sparkles className="w-5 h-5" /></div><div><h3 className={`text-[1rem] ${tc.heading}`}>Pro</h3><p className={`text-[0.75rem] ${tc.muted}`}>For growing restaurants</p></div></div>
                <div className="mb-4"><span className={`text-[2rem] ${tc.heading}`}>$49</span><span className={`text-[0.8125rem] ${tc.muted}`}>/month</span></div>
                <div className={`border-t ${tc.cardBorder} my-3`} />
                <ul className="space-y-2.5 mt-4">{PRO_FEATURES.map((f) => (<li key={f} className={`flex items-center gap-2 text-[0.8125rem] ${tc.subtext}`}><Check className="w-4 h-4 text-blue-400 shrink-0" />{f}</li>))}</ul>
                <button disabled={currentPlan === "pro"} onClick={() => handleChoose("pro")} className={`w-full mt-6 py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${currentPlan === "pro" ? `${tc.surface} ${tc.muted} cursor-not-allowed` : tc.btnSecondary}`}>
                  {currentPlan === "pro" ? "Current Plan" : "Choose Pro"}
                </button>
              </div>
              {/* Ultra */}
              <div className={`${tc.card} rounded-lg p-5 relative overflow-hidden transition-all ${tc.hover} ${currentPlan === "ultra" ? "ring-2 ring-blue-500/30 opacity-60" : ""}`}>
                <span className="absolute top-4 right-4 z-10 px-2 py-0.5 rounded-lg text-[0.625rem] bg-blue-600 text-white">Popular</span>
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-bl-[80px]" />
                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center"><Crown className="w-5 h-5" /></div><div><h3 className={`text-[1rem] ${tc.heading}`}>Ultra</h3><p className={`text-[0.75rem] ${tc.muted}`}>For enterprise restaurants</p></div></div>
                <div className="mb-4"><span className={`text-[2rem] ${tc.heading}`}>$99</span><span className={`text-[0.8125rem] ${tc.muted}`}>/month</span></div>
                <div className={`border-t ${tc.cardBorder} my-3`} />
                <ul className="space-y-2.5 mt-4">{ULTRA_FEATURES.map((f) => (<li key={f} className={`flex items-center gap-2 text-[0.8125rem] ${tc.subtext}`}><Check className="w-4 h-4 text-blue-400 shrink-0" />{f}</li>))}</ul>
                <button disabled={currentPlan === "ultra"} onClick={() => handleChoose("ultra")} className={`w-full mt-6 py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${currentPlan === "ultra" ? `${tc.surface} ${tc.muted} cursor-not-allowed` : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                  {currentPlan === "ultra" ? "Current Plan" : "Choose Ultra"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <InlineModal open={!!confirmModal} onClose={() => setConfirmModal(null)} size="sm">
        {confirmModal?.type === "subscribe" && (
          <>
            <div className={`p-5 border-b ${tc.cardBorder}`}>
              <div className="flex items-center gap-2">
                {confirmModal.plan === "ultra" ? <Crown className="w-5 h-5 text-blue-400" /> : <Sparkles className="w-5 h-5 text-blue-400" />}
                <h3 className={`text-[1rem] ${tc.heading}`}>Subscribe to {confirmModal.plan === "pro" ? "Pro" : "Ultra"}</h3>
              </div>
            </div>
            <div className="p-5">
              <p className={`text-[0.8125rem] ${tc.subtext}`}>You're about to subscribe to the <strong className={tc.heading}>{confirmModal.plan === "pro" ? "Pro" : "Ultra"}</strong> plan at <strong className={tc.heading}>{confirmModal.plan === "pro" ? "$49" : "$99"}/month</strong>. You can cancel anytime from your settings.</p>
            </div>
            <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
              <button onClick={() => setConfirmModal(null)} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>Cancel</button>
              <button onClick={confirmSubscribe} className="flex items-center gap-1.5 px-3.5 py-1.5 text-[0.75rem] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"><ArrowRight className="w-4 h-4" /> Proceed to Payment</button>
            </div>
          </>
        )}
        {confirmModal?.type === "cancel" && (
          <>
            <div className={`p-5 border-b ${tc.cardBorder}`}>
              <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" /><h3 className={`text-[1rem] ${tc.heading}`}>Cancel Subscription</h3></div>
            </div>
            <div className="p-5">
              <p className={`text-[0.8125rem] ${tc.subtext}`}>Are you sure you want to cancel your <strong className={tc.heading}>{planLabel}</strong> subscription? You'll lose access to premium features at the end of your billing cycle.</p>
              <div className={`mt-3 p-3 ${tc.dangerBg} border rounded-lg text-[0.75rem] ${tc.dangerText} flex items-start gap-2`}><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>This action cannot be undone. Your plan will revert to Free.</span></div>
            </div>
            <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
              <button onClick={() => setConfirmModal(null)} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>Keep Plan</button>
              <button onClick={confirmCancelSub} className="px-3.5 py-1.5 text-[0.75rem] rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors">Yes, Cancel Subscription</button>
            </div>
          </>
        )}
      </InlineModal>
    </div>
  );
}