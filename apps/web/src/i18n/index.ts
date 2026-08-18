import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { he } from "./locales/he";

export const RTL_LANGUAGES = new Set(["he"]);
const STORAGE_KEY = "rsflow-language";

function getStoredLanguage(): string {
  if (typeof window === "undefined") return "he";
  return window.localStorage.getItem(STORAGE_KEY) ?? "he";
}

function applyDirection(language: string) {
  const dir = RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = language;
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
  },
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

applyDirection(i18n.language);

i18n.on("languageChanged", (language) => {
  window.localStorage.setItem(STORAGE_KEY, language);
  applyDirection(language);
});

export default i18n;
