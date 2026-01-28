
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationPT from './locales/pt.json';
import translationEN from './locales/en.json';

const resources = {
  en: {
    translation: translationEN
  },
  pt: {
    translation: translationPT
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt", // Default language
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
