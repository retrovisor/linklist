import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nextI18NextConfig from '../next-i18next.config';

console.log('Initializing i18n with config:', nextI18NextConfig);

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
  }).then(() => {
    console.log('i18n initialized');
  }).catch(err => {
    console.error('Error initializing i18n:', err);
  });

export default i18n;
