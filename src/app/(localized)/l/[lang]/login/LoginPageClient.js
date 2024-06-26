'use client';

import { useTranslation } from 'next-i18next';
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";
import LoginWithKakao from "@/components/buttons/LoginWithKakao";
import LoginWithFacebook from "@/components/buttons/LoginWithFacebook";
import UsernameForm from "@/components/forms/UsernameForm";

export default function LoginPageClient({ session, searchParams }) {
  const { t } = useTranslation('login');

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
