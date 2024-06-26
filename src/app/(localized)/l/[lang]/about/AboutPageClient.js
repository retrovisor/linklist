'use client';
import { useEffect } from 'react';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

export default function AboutPageClient({ lang, translations }) {
  useEffect(() => {
    console.log('AboutPageClient mounted with lang:', lang);
    console.log('Received translations:', translations);

    i18n.use(initReactI18next).init({
      resources: {
        [lang]: {
          about: translations.about,
        },
      },
      lng: lang,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }, [lang, translations]);

  const { t } = useTranslation('about');

  useEffect(() => {
    console.log('t function loaded, checking translation keys:');
    console.log('title:', t('title'));
    console.log('welcome:', t('welcome'));
    console.log('description1:', t('description1'));
    console.log('description2:', t('description2'));
    console.log('description3:', t('description3'));
    console.log('description4:', t('description4'));
  }, [t]);

  return (
    <div className="bg-white text-white min-h-screen">
      <div className="h-36 colorido bg-cover bg-center">
        <h1 className="text-5xl font-bold text-center text-white pt-12">{t('title')}</h1>
      </div>
      <div className="max-w-xl mx-auto text-center my-4 text-black px-4 text-left">
        <p className="p-4 text-left">{t('welcome')}</p>
        <p className="p-4 text-left">{t('description1')}</p>
        <p className="p-4 text-left">{t('description2')}</p>
        <p className="p-4 text-left">{t('description3')}</p>
        <p className="p-4 text-left">{t('description4')}</p>
      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {/* Content for the grid */}
      </div>
    </div>
  );
}
``
