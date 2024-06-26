'use client';

import SignupWithGoogle from "@/components/buttons/SignupWithGoogle";
import SignupWithKakao from "@/components/buttons/SignupWithKakao";
import UsernameForm from "@/components/forms/UsernameForm";
import { useTranslation } from 'next-i18next';

export default function SignupPageClient({ session, searchParams, lang }) {
  const { t } = useTranslation('signup');

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
        <SignupWithKakao />
        <div className="mt-4">
          <SignupWithGoogle />
        </div>
      </div>
    </div>
  );
}
