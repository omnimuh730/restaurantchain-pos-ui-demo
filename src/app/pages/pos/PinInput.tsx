import { useRef, useCallback } from "react";

interface PinInputProps {
 value: string;
 onChange: (v: string) => void;
 length?: number;
 label?: string;
}

export function PinInput({ value, onChange, length = 6, label }: PinInputProps) {
 const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
 const digits = value.padEnd(length, "").split("").slice(0, length);

 const handleChange = useCallback(
 (index: number, char: string) => {
 if (!/^\d?$/.test(char)) return;
 const arr = digits.slice();
 arr[index] = char;
 const next = arr.join("").replace(/[^\d]/g, "");
 onChange(next);
 if (char && index < length - 1) {
 inputRefs.current[index + 1]?.focus();
 }
 },
 [digits, onChange, length]
 );

 const handleKeyDown = useCallback(
 (index: number, e: React.KeyboardEvent) => {
 if (e.key === "Backspace" && !digits[index] && index > 0) {
 inputRefs.current[index - 1]?.focus();
 const arr = digits.slice();
 arr[index - 1] = "";
 onChange(arr.join("").replace(/[^\d]/g, ""));
 }
 },
 [digits, onChange]
 );

 const handlePaste = useCallback(
 (e: React.ClipboardEvent) => {
 e.preventDefault();
 const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
 onChange(pasted);
 const focusIdx = Math.min(pasted.length, length - 1);
 inputRefs.current[focusIdx]?.focus();
 },
 [onChange, length]
 );

 return (
 <div>
 {label && <label className="text-[0.8125rem] text-gray-400 mb-2 block">{label}</label>}
 <div className="flex gap-2 justify-center">
 {Array.from({ length }).map((_, i) => (
 <input
 key={i}
 ref={(el) => { inputRefs.current[i] = el; }}
 type="password"
 inputMode="numeric"
 maxLength={1}
 value={digits[i] || ""}
 onChange={(e) => handleChange(i, e.target.value)}
 onKeyDown={(e) => handleKeyDown(i, e)}
 onPaste={i === 0 ? handlePaste : undefined}
 className="w-10 h-12 rounded-lg border border-gray-700 bg-[#1a1d25] text-gray-100 text-center text-[1.25rem] outline-none focus:border-blue-500 transition-colors"
 />
 ))}
 </div>
 </div>
 );
}
