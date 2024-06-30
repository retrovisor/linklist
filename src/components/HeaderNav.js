'use client';

import { useTranslation } from 'react-i18next';
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function HeaderNav({ session }) {
  const { t, i18n } = useTranslation('common');
  const { lang } = useParams();

  useEffect(() => {
    console.log('Current language:', lang);
    console.log('All translations:', i18n.getResourceBundle(lang, 'common'));
    console.log('Translation for login:', t('header.login'));
  }, [lang, t, i18n]);

 

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
