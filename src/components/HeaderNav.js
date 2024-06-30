// components/HeaderNav.js
'use client';

import { useTranslation } from 'react-i18next';
import Link from "next/link";
import LogoutButton from "@/components/buttons/LogoutButton";
import { useParams } from 'next/navigation';

export default function HeaderNav({ session }) {
  const { t } = useTranslation('common');
  const { lang } = useParams();

  return (
    <nav className="flex items-center text-sm text-slate-500">
      {session ? (
        <>
          <Link href={`/${lang}/account`} className="btn-link2 mr-2">
            {t('header.myPage')}
          </Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href={`/${lang}/login`} className="btn-link2">{t('header.login')}</Link>
          <Link href={`/${lang}/signup`} className="btn-link">{t('header.signup')}</Link>
        </>
      )}
    </nav>
  );
}
