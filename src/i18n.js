import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import nextI18NextConfig from '../next-i18next.config';

console.log('Initializing i18n with config:', nextI18NextConfig);

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...nextI18NextConfig.i18n,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  }).then(() => {
    console.log('i18n initialized');
  }).catch(err => {
    console.error('Error initializing i18n:', err);
  });

export default i18n;
