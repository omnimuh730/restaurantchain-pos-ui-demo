import { useState } from "react";
import {
 Store,
 Clock,
 Phone,
 Timer,
} from "lucide-react";

type DepositCurrency = "foreign" | "domestic";
import { useThemeClasses } from "../theme-context";
import { InlineToggle } from "./ui-helpers";

const RESTAURANT_NAME = "Glass Onion";
const RESTAURANT_DESCRIPTION =
 "Modern Asian fusion restaurant with a curated cocktail bar, serving contemporary dishes inspired by flavors across East and Southeast Asia.";
const THUMBNAIL_URL =
 "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80";

export function GeneralSettings() {
 const tc = useThemeClasses();
 const [mainPhone, setMainPhone] = useState("(555) 000-1234");
 const [altPhone, setAltPhone] = useState("(555) 000-5678");
 const [deposit, setDeposit] = useState("500");
 const [depositCurrency, setDepositCurrency] = useState<DepositCurrency>("foreign");
 const [gracePeriod, setGracePeriod] = useState("20");
 const [hours, setHours] = useState([
 {
 day: "Monday",
 open: "10:00",
 close: "22:00",
 closed: false,
 },
 {
 day: "Tuesday",
 open: "10:00",
 close: "22:00",
 closed: false,
 },
 {
 day: "Wednesday",
 open: "10:00",
 close: "22:00",
 closed: false,
 },
 {
 day: "Thursday",
 open: "10:00",
 close: "23:00",
 closed: false,
 },
 {
 day: "Friday",
 open: "10:00",
 close: "23:00",
 closed: false,
 },
 {
 day: "Saturday",
 open: "11:00",
 close: "23:00",
 closed: false,
 },
 {
 day: "Sunday",
 open: "11:00",
 close: "21:00",
 closed: false,
 },
 ]);

 const updateHour = (
 idx: number,
 field: "open" | "close",
 value: string,
 ) => {
 setHours((prev) =>
 prev.map((h, i) =>
 i === idx ? { ...h, [field]: value } : h,
 ),
 );
 };
 const toggleClosed = (idx: number) => {
 setHours((prev) =>
 prev.map((h, i) =>
 i === idx ? { ...h, closed: !h.closed } : h,
 ),
 );
 };

 const timeInputCls = `px-2.5 py-1.5 rounded-lg border text-[0.8125rem] outline-none focus:border-blue-500 ${
 tc.isDark
 ? "border-gray-700 bg-[#3a3f4d] text-gray-100"
 : "border-gray-300 bg-white text-gray-900"
 }`;
 const timeInputStyle: React.CSSProperties = tc.isDark
 ? { colorScheme: "dark" }
 : {};

 return (
 <div className="space-y-4">
 <div className={`${tc.card} rounded-lg`}>
 <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
 <div className="flex items-center justify-between gap-2">
 <div className="min-w-0">
 <h3 className={`text-[0.9375rem] ${tc.heading}`}>
 Restaurant Info
 </h3>
 <p
 className={`text-[0.75rem] ${tc.subtext} mt-0.5`}
 >
 Basic information about your restaurant
 </p>
 </div>
 <span
 className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.6875rem] shrink-0 ${tc.badge}`}
 >
 <Store className="w-3 h-3" /> Free Tier
 </span>
 </div>
 </div>
 <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 sm:gap-6">
 <div className="space-y-4 min-w-0">
 <div>
 <label
 className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
 >
 Restaurant Name
 </label>
 <p className={`text-[0.875rem] ${tc.heading}`}>
 {RESTAURANT_NAME}
 </p>
 </div>
 <div>
 <label
 className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
 >
 Description
 </label>
 <p
 className={`text-[0.8125rem] ${tc.subtext} leading-relaxed`}
 >
 {RESTAURANT_DESCRIPTION}
 </p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label
 className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
 >
 Deposit Money
 </label>
 <div className="flex items-center gap-2">
 <div className="relative flex-1">
 <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[0.9375rem] ${tc.muted} w-4 text-center`}>
 {depositCurrency === "domestic" ? "₩" : "$"}
 </span>
 <input
 type="number"
 min="0"
 step="1"
 value={deposit}
 onChange={(e) => setDeposit(e.target.value)}
 className={`${tc.input} pl-10`}
 />
 </div>
 <div className={`inline-flex items-center rounded-md p-0.5 shrink-0 ${tc.isDark ? "bg-slate-800" : "bg-slate-100"}`}>
 {([
 { id: "foreign" as DepositCurrency, label: "$" },
 { id: "domestic" as DepositCurrency, label: "₩" },
 ]).map((o) => {
 const active = depositCurrency === o.id;
 return (
 <button
 key={o.id}
 type="button"
 onClick={() => setDepositCurrency(o.id)}
 className={`px-2.5 py-1 rounded text-[0.8125rem] cursor-pointer transition-colors ${
 active ? "bg-blue-600 text-white" : tc.subtext
 }`}
 >
 {o.label}
 </button>
 );
 })}
 </div>
 </div>
 <p
 className={`text-[0.6875rem] ${tc.muted} mt-1`}
 >
 Starting cash in drawer at the beginning of
 each shift
 </p>
 </div>
 <div>
 <label
 className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
 >
 Grace Period
 </label>
 <div className="relative">
 <Timer
 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.muted}`}
 />
 <input
 type="number"
 min="0"
 step="1"
 value={gracePeriod}
 onChange={(e) =>
 setGracePeriod(e.target.value)
 }
 className={`${tc.input} pl-10 pr-12`}
 />
 <span
 className={`absolute right-3 top-1/2 -translate-y-1/2 text-[0.75rem] ${tc.muted}`}
 >
 min
 </span>
 </div>
 <p
 className={`text-[0.6875rem] ${tc.muted} mt-1`}
 >
 Wait time before a reservation is marked as
 no-show
 </p>
 </div>
 </div>
 </div>
 <div className="flex flex-col min-h-0">
 <label
 className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
 >
 Thumbnail Image
 </label>
 <div
 className={`rounded-lg overflow-hidden border ${tc.cardBorder} w-full flex-1 min-h-[160px]`}
 >
 <img
 src={THUMBNAIL_URL}
 alt={RESTAURANT_NAME}
 className="w-full h-full object-cover"
 />
 </div>
 </div>
 </div>
 </div>

 <div className={`${tc.card} rounded-lg`}>
 <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
 <h3
 className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}
 >
 <Clock className="w-4 h-4 text-blue-400" /> Opening
 Hours
 </h3>
 <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>
 Set your operating hours for each day
 </p>
 </div>
 <div className="p-3 sm:p-5 space-y-2">
 {hours.map((h, idx) => (
 <div
 key={h.day}
 className={`flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-colors ${
 h.closed
 ? tc.isDark
 ? "bg-gray-800/50 opacity-60"
 : "bg-gray-100/50 opacity-60"
 : tc.hover
 }`}
 >
 <span
 className={`text-[0.75rem] sm:text-[0.8125rem] ${tc.subtext} w-8 sm:w-24 shrink-0`}
 >
 {h.day.slice(0, 3)}
 <span className="hidden sm:inline">
 {h.day.slice(3)}
 </span>
 </span>
 <InlineToggle
 checked={!h.closed}
 onChange={() => toggleClosed(idx)}
 size="sm"
 />
 {!h.closed ? (
 <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
 <input
 type="time"
 value={h.open}
 onChange={(e) =>
 updateHour(idx, "open", e.target.value)
 }
 className={`${timeInputCls} flex-1 min-w-0 text-[0.75rem] sm:text-[0.8125rem]`}
 style={timeInputStyle}
 />
 <span
 className={`text-[0.6875rem] sm:text-[0.75rem] ${tc.muted} shrink-0`}
 >
 to
 </span>
 <input
 type="time"
 value={h.close}
 onChange={(e) =>
 updateHour(idx, "close", e.target.value)
 }
 className={`${timeInputCls} flex-1 min-w-0 text-[0.75rem] sm:text-[0.8125rem]`}
 style={timeInputStyle}
 />
 </div>
 ) : (
 <span
 className={`text-[0.75rem] ${tc.muted} italic`}
 >
 Closed
 </span>
 )}
 </div>
 ))}
 </div>
 </div>

 <div className={`${tc.card} rounded-lg`}>
 <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
 <h3
 className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}
 >
 <Phone className="w-4 h-4 text-blue-400" /> Phone
 Numbers
 </h3>
 </div>
 <div className="p-4 sm:p-5 space-y-4">
 <div>
 <label
 className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
 >
 Main Phone
 </label>
 <div className="relative">
 <Phone
 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.muted}`}
 />
 <input
 value={mainPhone}
 onChange={(e) => setMainPhone(e.target.value)}
 className={`${tc.input} pl-10`}
 />
 </div>
 </div>
 <div>
 <label
 className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
 >
 Alternative Phone
 </label>
 <div className="relative">
 <Phone
 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.muted}`}
 />
 <input
 value={altPhone}
 onChange={(e) => setAltPhone(e.target.value)}
 className={`${tc.input} pl-10`}
 />
 </div>
 <p className={`text-[0.6875rem] ${tc.muted} mt-1`}>
 Optional secondary contact number
 </p>
 </div>
 </div>
 </div>
 </div>
 );
}