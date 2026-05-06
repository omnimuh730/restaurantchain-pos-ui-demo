import { createContext, useContext, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { formatDomesticWon, formatForeignUsd } from "../../../../i18n/formatMoney";

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
  if (currency === "domestic") return formatDomesticWon(value as number);
  return formatForeignUsd(value as number);
}

export function AnalyticsCurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<MoneyCurrency>("domestic");
  const fmt = (value: number | undefined | null) => formatFor(currency, value);
  const pick = (amt: MoneyAmount) =>
    currency === "domestic" ? formatFor("domestic", amt.krw) : formatFor("foreign", amt.usd);
  const symbol = currency === "domestic" ? "원" : "$";
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
      currency: "domestic",
      setCurrency: () => {},
      symbol: "원",
      isDomestic: true,
      fmt: (value) => formatFor("domestic", value),
      pick: (amt) => formatFor("domestic", amt.krw),
    };
  }
  return v;
}

export function CurrencyToggle({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useAnalyticsCurrency();
  const { t } = useTranslation("orders");
  return (
    <div className={`inline-flex items-center rounded-md p-0.5 bg-slate-200 dark:bg-slate-800 ${className}`}>
      {([
        { id: "foreign" as MoneyCurrency, label: t("ui.currencyToggleForeign") },
        { id: "domestic" as MoneyCurrency, label: t("ui.currencyToggleDomestic") },
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
