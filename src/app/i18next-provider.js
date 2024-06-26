// src/app/i18next-provider.js
'use client';

import { appWithTranslation } from 'next-i18next';
import '../i18n'; // Import the i18n configuration

function I18nextProvider({ children }) {
  return <>{children}</>;
}

export default appWithTranslation(I18nextProvider);
