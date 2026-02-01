import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // Load translations from public/locales
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next)
  .init({
    fallbackLng: "pt",
    debug: import.meta.env.DEV, // Enable debug only in dev
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
