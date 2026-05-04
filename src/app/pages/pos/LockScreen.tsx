import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Lock, LogOut } from "lucide-react";

export default function LockScreen() {
 const navigate = useNavigate();
 const location = useLocation();
 const state = location.state as { name?: string; username?: string } | null;
 const name = state?.name || "Admin";
 const username = state?.username || "admin";

 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

 const initials = name
 .split(" ")
 .map((w) => w[0])
 .join("")
 .toUpperCase()
 .slice(0, 2);

 const handleUnlock = (e: React.FormEvent) => {
 e.preventDefault();
 setError("");
 if (password.length < 6) {
 setError("Please enter your password (min 6 characters).");
 return;
 }
 setLoading(true);
 setTimeout(() => {
 setLoading(false);
 navigate("/pos", { replace: true });
 }, 600);
 };

 return (
 <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center p-4">
 <div className="w-full max-w-xs flex flex-col items-center">
 {/* Lock icon */}
 <div className="w-16 h-16 rounded-full bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-6">
 <Lock className="w-7 h-7 text-blue-400" />
 </div>

 {/* Avatar */}
 <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-[1.125rem] mb-3">
 {initials}
 </div>

 {/* Name & username */}
 <h1 className="text-[1.125rem] text-gray-100 tracking-tight">{name}</h1>
 <p className="text-[0.8125rem] text-gray-500 mt-0.5 mb-8">@{username}</p>

 {/* PIN form */}
 <form onSubmit={handleUnlock} className="w-full space-y-5">
 <div>
 <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">Password</label>
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="Enter your password"
 autoComplete="current-password"
 className="w-full px-3.5 py-2.5 rounded-lg border border-gray-700 bg-[#1a1d25] text-gray-100 text-[0.875rem] placeholder:text-gray-600 outline-none focus:border-blue-500 transition-colors"
 />
 </div>

 {error && (
 <div className="px-3 py-2 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400 text-[0.75rem] text-center">
 {error}
 </div>
 )}

 <button
 type="submit"
 disabled={loading}
 className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] text-white cursor-pointer transition-colors ${
 loading ? "bg-blue-700 opacity-70" : "bg-blue-600 hover:bg-blue-700"
 }`}
 >
 {loading ? (
 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
 ) : (
 <Lock className="w-4 h-4" />
 )}
 {loading ? "Unlocking..." : "Unlock"}
 </button>
 </form>

 {/* Switch account */}
 <button
 onClick={() => navigate("/signin", { replace: true })}
 className="mt-6 flex items-center gap-2 text-[0.8125rem] text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
 >
 <LogOut className="w-4 h-4" /> Switch Account
 </button>
 </div>
 </div>
 );
}
