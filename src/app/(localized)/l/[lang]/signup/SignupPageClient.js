'use client';

import { useEffect, useState } from 'react';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import SignupWithGoogle from "@/components/buttons/SignupWithGoogle";
import SignupWithKakao from "@/components/buttons/SignupWithKakao";
import UsernameForm from "@/components/forms/UsernameForm";

export default function SignupPageClient({ session, searchParams, translations }) {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    console.log('SignupPageClient mounted with translations:', translations);

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
      console.log('createAccount:', t('createAccount'));
      console.log('createAccountDescription:', t('createAccountDescription'));
    }
  }, [i18nInitialized, t]);

  if (!i18nInitialized) return null; // Optionally render a loading state

  if (session) {
    console.log('User is logged in, rendering UsernameForm');
    const desiredUsername = searchParams.desiredUsername || "";
    return <UsernameForm desiredUsername={desiredUsername} />;
  }

  console.log('User is not logged in, rendering signup buttons');
  return (
    <div>
      <div className="p-4 max-w-xs mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">{t('createAccount')}</h1>
        <p className="text-center mb-6 text-gray-500">
          {t('createAccountDescription')}
        </p>
        <SignupWithKakao />
        <div className="mt-4">
          <SignupWithGoogle />
        </div>
      </div>
    </div>
  );
}
