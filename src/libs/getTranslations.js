import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getTranslations(locale, namespaces) {
  return await serverSideTranslations(locale, namespaces);
}
