import { useThemeClasses } from "../theme-context";
import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Crown, CreditCard, Check, Zap, ArrowRight } from "lucide-react";
export function SlideToPay({
  amount, planName, onComplete, onCancel,
}: {
  amount: string;
  planName: string;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const tc = useThemeClasses();
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideX, setSlideX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const thumbW = 56;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (completed || processing) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [completed, processing]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current || completed) return;
    const rect = trackRef.current.getBoundingClientRect();
    const maxX = rect.width - thumbW - 8;
    const x = Math.max(0, Math.min(e.clientX - rect.left - thumbW / 2 - 4, maxX));
    setSlideX(x);
  }, [isDragging, completed]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging || !trackRef.current || completed) return;
    setIsDragging(false);
    const rect = trackRef.current.getBoundingClientRect();
    const maxX = rect.width - thumbW - 8;
    if (slideX > maxX * 0.85) {
      setSlideX(maxX); setCompleted(true); setProcessing(true);
      setTimeout(() => { setProcessing(false); onComplete(); }, 1800);
    } else {
      setSlideX(0);
    }
  }, [isDragging, slideX, completed, onComplete]);

  const trackWidth = trackRef.current ? trackRef.current.getBoundingClientRect().width - thumbW - 8 : 1;
  const progress = trackWidth > 0 ? slideX / trackWidth : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="space-y-6">
      <div className={`${tc.card} rounded-lg p-5`}>
        <div className="text-center space-y-3 py-4">
          <div className={`w-16 h-16 rounded-lg ${tc.iconBg} flex items-center justify-center mx-auto`}>
            {planName === "Pro" ? <Sparkles className="w-8 h-8" /> : <Crown className="w-8 h-8" />}
          </div>
          <div><h3 className={`text-[1.125rem] ${tc.heading}`}>{planName} Plan</h3><p className={`text-[0.75rem] ${tc.subtext}`}>Monthly subscription</p></div>
          <div className="text-[2.5rem] text-blue-400">{amount}</div>
          <p className={`text-[0.6875rem] ${tc.muted}`}>Billed monthly. Cancel anytime.</p>
        </div>
      </div>
      <div className={`${tc.card} rounded-lg p-4`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 bg-blue-600 rounded-md flex items-center justify-center"><CreditCard className="w-4 h-4 text-white" /></div>
          <div className="flex-1"><p className={`text-[0.8125rem] ${tc.isDark ? "text-gray-200" : "text-gray-700"}`}>Visa .... 4242</p><p className={`text-[0.6875rem] ${tc.muted}`}>Expires 12/26</p></div>
          <Check className="w-4 h-4 text-blue-400" />
        </div>
      </div>
      <div ref={trackRef} className="relative h-16 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-600/5 border border-blue-600/20 overflow-hidden select-none touch-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {!completed && !processing && <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/10 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {processing ? (
              <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[0.875rem] text-blue-400 flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Zap className="w-4 h-4" /></motion.div>Processing...
              </motion.span>
            ) : completed ? (
              <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-[0.875rem] text-blue-400 flex items-center gap-2"><Check className="w-5 h-5" /> Payment Complete!</motion.span>
            ) : (
              <motion.span key="slide" className="text-[0.875rem] text-blue-400/60" style={{ opacity: 1 - progress * 2 }}>Slide to pay {amount}</motion.span>
            )}
          </AnimatePresence>
        </div>
        {!completed && !processing && (
          <motion.div className="absolute top-1 left-1 w-14 h-14 rounded-lg bg-blue-600 text-white flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-lg" style={{ x: slideX }} animate={!isDragging ? { x: slideX } : undefined} transition={{ type: "spring", damping: 20, stiffness: 300 }} onPointerDown={handlePointerDown}>
            <ArrowRight className="w-6 h-6" />
          </motion.div>
        )}
        {completed && <motion.div className="absolute inset-0 bg-blue-600/15" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0 }} transition={{ duration: 0.5 }} />}
      </div>
      <button onClick={onCancel} className={`w-full py-2 text-[0.75rem] ${tc.muted} hover:${tc.isDark ? "text-gray-300" : "text-gray-600"} cursor-pointer transition-colors`}>Cancel</button>
    </motion.div>
  );
}