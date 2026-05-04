import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import menuItemsEn from "../locales/menuItems.en.json";
import menuItemsKo from "../locales/menuItems.ko.json";

const merge = (ui: Record<string, unknown>, menu: Record<string, string>) => ({
  ...ui,
  menuItems: menu,
});

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: merge(en, menuItemsEn as Record<string, string>) },
    ko: { translation: merge(ko, menuItemsKo as Record<string, string>) },
  },
  lng: "ko",
  fallbackLng: "ko",
  supportedLngs: ["ko", "en"],
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
