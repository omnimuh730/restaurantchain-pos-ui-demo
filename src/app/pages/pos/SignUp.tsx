import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { LayoutGrid, Store, UserCheck, ArrowLeft, ArrowRight, Check, Clock, ChevronDown, Search } from "lucide-react";

type SignUpMode = "select" | "restaurant" | "staff";
type StaffStep = "selectRestaurant" | "waitingRestaurantApproval" | "details" | "waitingStaffApproval";
type RestaurantStep = "form" | "waitingApproval";

const RESTAURANTS = [
  { id: "r1", approved: true },
  { id: "r2", approved: true },
  { id: "r3", approved: true },
  { id: "r4", approved: false },
  { id: "r5", approved: true },
];

export default function SignUp() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<SignUpMode>("select");

  const [restaurantStep, setRestaurantStep] = useState<RestaurantStep>("form");
  const [restName, setRestName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [restUsername, setRestUsername] = useState("");
  const [restPassword, setRestPassword] = useState("");
  const [restConfirmPassword, setRestConfirmPassword] = useState("");
  const [restError, setRestError] = useState("");
  const [restLoading, setRestLoading] = useState(false);

  const [staffStep, setStaffStep] = useState<StaffStep>("selectRestaurant");
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffConfirmPassword, setStaffConfirmPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [restaurantDropdownOpen, setRestaurantDropdownOpen] = useState(false);

  const resetAll = () => {
    setMode("select");
    setRestaurantStep("form");
    setStaffStep("selectRestaurant");
    setRestName("");
    setAdminName("");
    setRestUsername("");
    setRestPassword("");
    setRestConfirmPassword("");
    setRestError("");
    setRestLoading(false);
    setSelectedRestaurant(null);
    setRestaurantSearch("");
    setStaffName("");
    setStaffUsername("");
    setStaffPassword("");
    setStaffConfirmPassword("");
    setStaffError("");
    setStaffLoading(false);
  };

  const handleRestaurantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRestError("");
    if (!restName.trim() || !adminName.trim() || !restUsername.trim()) {
      setRestError(t("auth.signUp.errorAllFields"));
      return;
    }
    if (restPassword.length < 6) {
      setRestError(t("auth.signUp.errorPasswordLen"));
      return;
    }
    if (restPassword !== restConfirmPassword) {
      setRestError(t("auth.signUp.errorPasswordMatch"));
      return;
    }
    setRestLoading(true);
    setTimeout(() => {
      setRestLoading(false);
      setRestaurantStep("waitingApproval");
    }, 1000);
  };

  const handleStaffRestaurantNext = () => {
    if (!selectedRestaurant) return;
    const rest = RESTAURANTS.find((r) => r.id === selectedRestaurant);
    if (!rest) return;
    if (!rest.approved) setStaffStep("waitingRestaurantApproval");
    else setStaffStep("details");
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError("");
    if (!staffName.trim() || !staffUsername.trim()) {
      setStaffError(t("auth.signUp.errorAllFields"));
      return;
    }
    if (staffPassword.length < 6) {
      setStaffError(t("auth.signUp.errorPasswordLen"));
      return;
    }
    if (staffPassword !== staffConfirmPassword) {
      setStaffError(t("auth.signUp.errorPasswordMatch"));
      return;
    }
    setStaffLoading(true);
    setTimeout(() => {
      setStaffLoading(false);
      setStaffStep("waitingStaffApproval");
    }, 1000);
  };

  const restaurantName = (id: string) => t(`auth.signUp.restaurants.${id}`);
  const filteredRestaurants = RESTAURANTS.filter((r) => restaurantName(r.id).toLowerCase().includes(restaurantSearch.toLowerCase()));
  const selectedRestObj = RESTAURANTS.find((r) => r.id === selectedRestaurant);

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg border border-gray-700 bg-[#1a1d25] text-gray-100 text-[0.875rem] placeholder:text-gray-600 outline-none focus:border-blue-500 transition-colors";
  const btnPrimary =
    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] text-white cursor-pointer transition-colors bg-blue-600 hover:bg-blue-700";
  const btnDisabled =
    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.875rem] text-gray-500 bg-gray-800 cursor-not-allowed";

  const ErrorBox = ({ msg }: { msg: string }) =>
    msg ? <div className="px-3 py-2 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400 text-[0.75rem]">{msg}</div> : null;

  const WaitingScreen = ({ title, subtitle, onBack }: { title: string; subtitle: string; onBack?: () => void }) => (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-amber-900/30 border border-amber-700/40 flex items-center justify-center mb-5">
        <Clock className="w-7 h-7 text-amber-400" />
      </div>
      <h2 className="text-[1.125rem] text-gray-100 mb-2">{title}</h2>
      <p className="text-[0.8125rem] text-gray-500 max-w-xs mb-6">{subtitle}</p>
      <div className="flex flex-col gap-2 w-full">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.8125rem] text-gray-300 border border-gray-700 hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("auth.signUp.goBack")}
          </button>
        )}
        <Link
          to="/signin"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.8125rem] text-blue-400 hover:text-blue-300 transition-colors"
        >
          {t("auth.signUp.backToSignIn")}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4">
            <LayoutGrid className="w-7 h-7 text-white" />
          </div>
          {mode === "select" && (
            <>
              <h1 className="text-[1.25rem] text-gray-100 tracking-tight">{t("auth.signUp.createTitle")}</h1>
              <p className="text-[0.8125rem] text-gray-500 mt-1">{t("auth.signUp.createSubtitle")}</p>
            </>
          )}
          {mode === "restaurant" && restaurantStep === "form" && (
            <>
              <h1 className="text-[1.25rem] text-gray-100 tracking-tight">{t("auth.signUp.restaurantFormTitle")}</h1>
              <p className="text-[0.8125rem] text-gray-500 mt-1">{t("auth.signUp.restaurantFormSubtitle")}</p>
            </>
          )}
          {mode === "staff" && staffStep === "selectRestaurant" && (
            <>
              <h1 className="text-[1.25rem] text-gray-100 tracking-tight">{t("auth.signUp.staffSelectTitle")}</h1>
              <p className="text-[0.8125rem] text-gray-500 mt-1">{t("auth.signUp.staffSelectSubtitle")}</p>
            </>
          )}
          {mode === "staff" && staffStep === "details" && (
            <>
              <h1 className="text-[1.25rem] text-gray-100 tracking-tight">{t("auth.signUp.staffDetailsTitle")}</h1>
              <p className="text-[0.8125rem] text-gray-500 mt-1">
                {t("auth.signUp.staffDetailsSubtitle", { name: selectedRestObj ? restaurantName(selectedRestObj.id) : "" })}
              </p>
            </>
          )}
        </div>

        {mode === "select" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setMode("restaurant")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-[#1a1d25] hover:border-blue-500/50 hover:bg-[#1e2130] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0 group-hover:bg-blue-600/30 transition-colors">
                <Store className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left flex-1">
                <p className="text-[0.875rem] text-gray-100">{t("auth.signUp.restaurantCardTitle")}</p>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">{t("auth.signUp.restaurantCardDesc")}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </button>
            <button
              type="button"
              onClick={() => setMode("staff")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-[#1a1d25] hover:border-blue-500/50 hover:bg-[#1e2130] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0 group-hover:bg-blue-600/30 transition-colors">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left flex-1">
                <p className="text-[0.875rem] text-gray-100">{t("auth.signUp.staffCardTitle")}</p>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">{t("auth.signUp.staffCardDesc")}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </button>
            <div className="mt-6 text-center">
              <p className="text-[0.8125rem] text-gray-500">
                {t("auth.signUp.haveAccount")}{" "}
                <Link to="/signin" className="text-blue-400 hover:text-blue-300 transition-colors">
                  {t("auth.signIn.signUpLink")}
                </Link>
              </p>
            </div>
          </div>
        )}

        {mode === "restaurant" && restaurantStep === "form" && (
          <form onSubmit={handleRestaurantSubmit} className="space-y-4">
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.restaurantName")}</label>
              <input type="text" value={restName} onChange={(e) => setRestName(e.target.value)} placeholder={t("auth.signUp.restaurantNamePh")} className={inputCls} />
            </div>
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.adminName")}</label>
              <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder={t("auth.signUp.fullNamePh")} className={inputCls} />
            </div>
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.username")}</label>
              <input
                type="text"
                value={restUsername}
                onChange={(e) => setRestUsername(e.target.value)}
                placeholder={t("auth.signUp.usernamePh")}
                autoComplete="username"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.password")}</label>
              <input
                type="password"
                value={restPassword}
                onChange={(e) => setRestPassword(e.target.value)}
                placeholder={t("auth.signUp.passwordPh")}
                autoComplete="new-password"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.confirmPassword")}</label>
              <input
                type="password"
                value={restConfirmPassword}
                onChange={(e) => setRestConfirmPassword(e.target.value)}
                placeholder={t("auth.signUp.confirmPasswordPh")}
                autoComplete="new-password"
                className={inputCls}
              />
            </div>
            <ErrorBox msg={restError} />
            <button type="submit" disabled={restLoading} className={restLoading ? btnDisabled : btnPrimary}>
              {restLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {restLoading ? t("auth.signUp.submitting") : t("auth.signUp.registerRestaurant")}
            </button>
            <button type="button" onClick={resetAll} className="w-full flex items-center justify-center gap-2 text-[0.8125rem] text-gray-500 hover:text-gray-300 cursor-pointer transition-colors mt-2">
              <ArrowLeft className="w-4 h-4" /> {t("auth.signUp.back")}
            </button>
          </form>
        )}

        {mode === "restaurant" && restaurantStep === "waitingApproval" && (
          <WaitingScreen title={t("auth.signUp.waitingRestaurantTitle")} subtitle={t("auth.signUp.waitingRestaurantSubtitle")} />
        )}

        {mode === "staff" && staffStep === "selectRestaurant" && (
          <div className="space-y-4">
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.selectRestaurant")}</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRestaurantDropdownOpen(!restaurantDropdownOpen)}
                  className={`${inputCls} flex items-center justify-between text-left cursor-pointer`}
                >
                  <span className={selectedRestObj ? "text-gray-100" : "text-gray-600"}>
                    {selectedRestObj ? restaurantName(selectedRestObj.id) : t("auth.signUp.chooseRestaurant")}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${restaurantDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {restaurantDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setRestaurantDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-gray-700 bg-[#2a2d35] shadow-xl overflow-hidden">
                      <div className="p-2 border-b border-gray-700">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                          <input
                            type="text"
                            value={restaurantSearch}
                            onChange={(e) => setRestaurantSearch(e.target.value)}
                            placeholder={t("auth.signUp.searchRestaurantsPh")}
                            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#1a1d25] border border-gray-700 text-gray-100 text-[0.8125rem] placeholder:text-gray-600 outline-none focus:border-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredRestaurants.length === 0 ? (
                          <div className="px-3 py-4 text-center text-[0.8125rem] text-gray-500">{t("auth.signUp.noRestaurants")}</div>
                        ) : (
                          filteredRestaurants.map((r) => (
                            <button
                              type="button"
                              key={r.id}
                              onClick={() => {
                                setSelectedRestaurant(r.id);
                                setRestaurantDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 text-[0.8125rem] flex items-center justify-between transition-colors cursor-pointer ${
                                selectedRestaurant === r.id ? "bg-blue-600 text-white" : "text-gray-200 hover:bg-gray-700"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Store className="w-4 h-4 shrink-0" />
                                <span>{restaurantName(r.id)}</span>
                              </div>
                              {r.approved && (
                                <span
                                  className={`text-[0.625rem] px-1.5 py-0.5 rounded ${
                                    selectedRestaurant === r.id ? "bg-blue-500 text-blue-100" : "bg-blue-900/40 text-blue-400"
                                  }`}
                                >
                                  {t("auth.signUp.approved")}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <button type="button" onClick={handleStaffRestaurantNext} disabled={!selectedRestaurant} className={!selectedRestaurant ? btnDisabled : btnPrimary}>
              <ArrowRight className="w-4 h-4" /> {t("auth.signUp.next")}
            </button>
            <button type="button" onClick={resetAll} className="w-full flex items-center justify-center gap-2 text-[0.8125rem] text-gray-500 hover:text-gray-300 cursor-pointer transition-colors mt-2">
              <ArrowLeft className="w-4 h-4" /> {t("auth.signUp.back")}
            </button>
          </div>
        )}

        {mode === "staff" && staffStep === "waitingRestaurantApproval" && (
          <WaitingScreen
            title={t("auth.signUp.restaurantNotApprovedTitle")}
            subtitle={t("auth.signUp.restaurantNotApprovedSubtitle", { name: selectedRestObj ? restaurantName(selectedRestObj.id) : "" })}
            onBack={() => setStaffStep("selectRestaurant")}
          />
        )}

        {mode === "staff" && staffStep === "details" && (
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-700/30 text-blue-400 text-[0.8125rem]">
              <Store className="w-4 h-4" />
              <span>{selectedRestObj ? restaurantName(selectedRestObj.id) : ""}</span>
              <button type="button" onClick={() => setStaffStep("selectRestaurant")} className="ml-auto text-[0.75rem] text-gray-500 hover:text-gray-300 cursor-pointer">
                {t("auth.signUp.change")}
              </button>
            </div>
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.staffFullName")}</label>
              <input type="text" value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder={t("auth.signUp.fullNamePh")} className={inputCls} />
            </div>
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.username")}</label>
              <input
                type="text"
                value={staffUsername}
                onChange={(e) => setStaffUsername(e.target.value)}
                placeholder={t("auth.signUp.usernamePh")}
                autoComplete="username"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.password")}</label>
              <input
                type="password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                placeholder={t("auth.signUp.passwordPh")}
                autoComplete="new-password"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-gray-400 mb-1.5 block">{t("auth.signUp.confirmPassword")}</label>
              <input
                type="password"
                value={staffConfirmPassword}
                onChange={(e) => setStaffConfirmPassword(e.target.value)}
                placeholder={t("auth.signUp.confirmPasswordPh")}
                autoComplete="new-password"
                className={inputCls}
              />
            </div>
            <ErrorBox msg={staffError} />
            <button type="submit" disabled={staffLoading} className={staffLoading ? btnDisabled : btnPrimary}>
              {staffLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {staffLoading ? t("auth.signUp.submitting") : t("auth.signUp.requestJoin")}
            </button>
            <button type="button" onClick={() => setStaffStep("selectRestaurant")} className="w-full flex items-center justify-center gap-2 text-[0.8125rem] text-gray-500 hover:text-gray-300 cursor-pointer transition-colors mt-2">
              <ArrowLeft className="w-4 h-4" /> {t("auth.signUp.back")}
            </button>
          </form>
        )}

        {mode === "staff" && staffStep === "waitingStaffApproval" && (
          <WaitingScreen
            title={t("auth.signUp.waitingStaffTitle")}
            subtitle={t("auth.signUp.waitingStaffSubtitle", { name: selectedRestObj ? restaurantName(selectedRestObj.id) : "" })}
          />
        )}
      </div>
    </div>
  );
}
