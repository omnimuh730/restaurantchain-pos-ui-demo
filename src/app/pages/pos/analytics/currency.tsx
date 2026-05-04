import { createContext, useContext, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type MoneyCurrency = "foreign" | "domestic";

export interface MoneyAmount {
  usd?: number;
  krw?: number;
}

interface CurrencyCtx {
  currency: MoneyCurrency;
  setCurrency: (c: MoneyCurrency) => void;
  /** Format a native amount stored in the active currency's own unit. */
  fmt: (value: number | undefined | null) => string;
  /** Pick between separately tracked USD and KRW values — no conversion. */
  pick: (amt: MoneyAmount) => string;
  symbol: string;
  isDomestic: boolean;
}

const Ctx = createContext<CurrencyCtx | null>(null);

function formatFor(currency: MoneyCurrency, value: number | undefined | null): string {
  if (value == null || isNaN(value as number)) return "—";
  if (currency === "domestic") return `₩${Math.round(value as number).toLocaleString()}`;
  return `$${(value as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function AnalyticsCurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<MoneyCurrency>("foreign");
  const fmt = (value: number | undefined | null) => formatFor(currency, value);
  const pick = (amt: MoneyAmount) =>
    currency === "domestic" ? formatFor("domestic", amt.krw) : formatFor("foreign", amt.usd);
  const symbol = currency === "domestic" ? "₩" : "$";
  return (
    <Ctx.Provider
      value={{ currency, setCurrency, fmt, pick, symbol, isDomestic: currency === "domestic" }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAnalyticsCurrency(): CurrencyCtx {
  const v = useContext(Ctx);
  if (!v) {
    return {
      currency: "foreign",
      setCurrency: () => {},
      symbol: "$",
      isDomestic: false,
      fmt: (value) => formatFor("foreign", value),
      pick: (amt) => formatFor("foreign", amt.usd),
    };
  }
  return v;
}

export function CurrencyToggle({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const { currency, setCurrency } = useAnalyticsCurrency();
  return (
    <div className={`inline-flex items-center rounded-md p-0.5 bg-slate-200 dark:bg-slate-800 ${className}`}>
      {([
        { id: "foreign" as MoneyCurrency, label: t("analytics.currencyToggle.foreign") },
        { id: "domestic" as MoneyCurrency, label: t("analytics.currencyToggle.domestic") },
      ]).map((o) => {
        const active = currency === o.id;
        return (
          <button
            key={o.id}
            onClick={() => setCurrency(o.id)}
            className={`px-2.5 py-1 rounded-lg text-[0.75rem] cursor-pointer transition-colors ${
              active
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
