'use client';

import { useEffect } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";
import LoginWithKakao from "@/components/buttons/LoginWithKakao";
import LoginWithFacebook from "@/components/buttons/LoginWithFacebook";
import UsernameForm from "@/components/forms/UsernameForm";

export default function LoginPageClient({ session, searchParams, translations }) {
  useEffect(() => {
    console.log('LoginPageClient mounted with translations:', translations);

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
    });
  }, [translations]);

  const { t } = useTranslation();

  useEffect(() => {
    console.log('t function loaded, checking translation keys:');
    console.log('createAccount:', t('createAccount'));
    console.log('createAccountDescription:', t('createAccountDescription'));
  }, [t]);

  if (session) {
    console.log('User is logged in, rendering UsernameForm');
    const desiredUsername = searchParams.desiredUsername || "";
    return <UsernameForm desiredUsername={desiredUsername} />;
  }

  console.log('User is not logged in, rendering login buttons');
  return (
    <div>
      <div className="p-4 max-w-xs mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">{t('createAccount')}</h1>
        <p className="text-center mb-6 text-gray-500">
          {t('createAccountDescription')}
        </p>
        <LoginWithKakao />
        <div className="mt-4">
          <LoginWithGoogle />
        </div>
        <div className="mt-4">
          <LoginWithFacebook />
        </div>
      </div>
    </div>
  );
}
