import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { LayoutGrid, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) {
      setError(t("auth.signIn.errorUserRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.signIn.errorPassword"));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username === "demo" && password === "000000") {
        setError(t("auth.signIn.errorInvalid"));
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/pos");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4">
            <LayoutGrid className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-[1.25rem] text-gray-100 tracking-tight">{t("auth.signIn.welcome")}</h1>
          <p className="text-[0.8125rem] text-gray-500 mt-1">{t("auth.signIn.subtitle")}</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signIn.username")}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("auth.signIn.usernamePlaceholder")}
              autoComplete="username"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-700 bg-[#1a1d25] text-gray-100 text-[0.875rem] placeholder:text-gray-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signIn.password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.signIn.passwordPlaceholder")}
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-700 bg-[#1a1d25] text-gray-100 text-[0.875rem] placeholder:text-gray-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400 text-[0.75rem]">
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
              <LogIn className="w-4 h-4" />
            )}
            {loading ? t("auth.signIn.signingIn") : t("auth.signIn.submit")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[0.8125rem] text-gray-500">
            {t("auth.signIn.noAccount")}{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t("auth.signIn.signUpLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
