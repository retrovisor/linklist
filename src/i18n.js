// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { nextI18NextConfig } from '../next-i18next.config';

i18n
  .use(initReactI18next)
  .init({
    ...nextI18NextConfig.i18n,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
