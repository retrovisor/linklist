import { getTranslations } from 'next-intl/server';
import AboutPageClient from './AboutPageClient';

export default async function AboutPage({ params: { lang } }) {
  const t = await getTranslations('about');

  return (
    <AboutPageClient 
      translations={{
        title: t('title'),
        welcome: t('welcome'),
        description1: t('description1'),
        description2: t('description2'),
        description3: t('description3'),
        description4: t('description4'),
      }}
    />
  );
}
