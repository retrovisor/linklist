'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n'; // Adjust the path as necessary
import { useEffect } from 'react';

export default function ClientI18nextProvider({ children, lang }) {
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
