import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import koCommon from "./locales/ko/common.json";
import enCommon from "./locales/en/common.json";
import koPos from "./locales/ko/pos.json";
import enPos from "./locales/en/pos.json";
import koOrdersItems from "./locales/ko/orders.json";
import enOrdersItems from "./locales/en/orders.json";
import koOrdersUi from "./locales/ko/ordersUi.json";
import enOrdersUi from "./locales/en/ordersUi.json";
import koKitchen from "./locales/ko/kitchen.json";
import enKitchen from "./locales/en/kitchen.json";
import koAnalytics from "./locales/ko/analytics.json";
import enAnalytics from "./locales/en/analytics.json";
import koPayment from "./locales/ko/payment.json";
import enPayment from "./locales/en/payment.json";
import koFloor from "./locales/ko/floor.json";
import enFloor from "./locales/en/floor.json";
import koSettings from "./locales/ko/settings.json";
import enSettings from "./locales/en/settings.json";

const empty = {};

/** Persisted UI language for POS (settings + app-wide copy). */
export const POS_UI_LANGUAGE_KEY = "pos-ui-language";

function readStoredLanguage(): "ko" | "en" | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const v = window.localStorage.getItem(POS_UI_LANGUAGE_KEY);
    if (v === "ko" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return undefined;
}

void i18n
  .use(initReactI18next)
  .init({
  lng: readStoredLanguage() ?? "ko",
  fallbackLng: "ko",
  supportedLngs: ["ko", "en"],
  interpolation: { escapeValue: false },
  defaultNS: "common",
  ns: ["common", "pos", "orders", "kitchen", "analytics", "settings", "floor", "auth", "payment"],
  resources: {
    ko: {
      common: koCommon,
      pos: koPos,
      orders: { ...koOrdersUi, ...koOrdersItems },
      kitchen: koKitchen,
      analytics: koAnalytics,
      settings: koSettings,
      floor: koFloor,
      auth: empty,
      payment: koPayment,
    },
    en: {
      common: enCommon,
      pos: enPos,
      orders: { ...enOrdersUi, ...enOrdersItems },
      kitchen: enKitchen,
      analytics: enAnalytics,
      settings: enSettings,
      floor: enFloor,
      auth: empty,
      payment: enPayment,
    },
  },
  })
  .then(() => {
    i18n.on("languageChanged", (lng) => {
      if (typeof window === "undefined") return;
      if (lng !== "ko" && lng !== "en") return;
      try {
        window.localStorage.setItem(POS_UI_LANGUAGE_KEY, lng);
      } catch {
        /* ignore */
      }
    });
  });

export default i18n;
