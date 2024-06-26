'use client';

import { useEffect, useState } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import HeroForm from "@/components/forms/HeroForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function HomeContent({ session, translations }) {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    console.log('HomeContent mounted with translations:', translations);

    i18n.use(initReactI18next).init({
      resources: {
        [translations.lang]: {
          translation: translations,
        },
      },
      lng: translations.lang,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    }).then(() => {
      setI18nInitialized(true);  // Update state to trigger re-render
    });
  }, [translations]);

  const { t } = useTranslation();

  useEffect(() => {
    if (i18nInitialized) {
      console.log('t function loaded, checking translation keys:');
      console.log('heading1:', t('heading1'));
      console.log('heading2:', t('heading2'));
      console.log('subheading:', t('subheading'));
      console.log('freeMessage:', t('freeMessage'));
    }
  }, [i18nInitialized, t]);

  if (!i18nInitialized) return null; // Optionally render a loading state

  return (
    <main>
      <div className="w-layout-hflex flex-block text-center pt-8">
        <div>
          <div className="testimonial1-item">
            <div className="testimonial1-logo-wrap flex items-center">
              {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  color="#feae32"
                  className="star-rating w-6 h-6 mr-1"
                />
              ))}
            </div>
          </div>
          <div className="text-center mt-1">&ldquo;{t('testimonial')}&rdquo;</div>
        </div>
      </div>
      <section className="pt-8 pb-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-5xl font-bold">
            {t('heading1')} <br /> <span className="italic">{t('heading2')}</span>
          </h1>
          <h2 className="text-gray-500 text-base mt-6">
            {t('subheading')}
          </h2>
          <div className="font-bold mt-4 text-xl">{t('freeMessage')}</div>
        </div>
        <div className="w-full flex justify-center mt-8 px-8">
          <HeroForm user={session?.user} />
        </div>
      </section>
      <section className="py-16 bg-slate-200 px-6">
        <div className="max-w-md mb-8 mx-auto text-center">
          <img className="hero-links" src="/hero-links.png" alt={t('heroLinksAlt')} />
        </div>
      </section>
      <section className="pt-16 pb-12 fundo-home px-6">
        <div className="max-w-md mb-8 mx-auto text-center">
          <h1 className="text-5xl font-bold">
            {t('designHeading')}
          </h1>
          <h2 className="text-gray-500 text-base my-6">
            {t('designSubheading')}
          </h2>
          <img className="hero-links" src="/templates.png" alt={t('templatesAlt')} />
        </div>
      </section>
      <section className="py-16 fundo-home px-6 colorido">
        <div className="max-w-md mb-8 mx-auto text-center">
          <h1 className="text-5xl font-bold text-white">
            {t('usersHeading')}
          </h1>
          <h2 className="text-gray-500 text-base mt-6 text-white">
            {t('usersSubheading')}
          </h2>
          <div className="font-bold mt-4 text-xl text-white">{t('freeMessage')}</div>
        </div>
        <div className="w-full flex justify-center mt-8 px-8">
          <HeroForm user={session?.user} />
        </div>
      </section>
    </main>
  );
}
