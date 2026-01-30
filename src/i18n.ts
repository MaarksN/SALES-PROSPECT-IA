
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Loads translations from /public/locales
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'pt',
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
