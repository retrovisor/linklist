// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import ko from './translations/ko.json';

const resources = {
  en: { translation: en },
  ko: { translation: ko },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
