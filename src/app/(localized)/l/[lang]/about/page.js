import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AboutPageClient from './AboutPageClient';

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['about'])),
    },
  };
}

export default async function AboutPage({ params: { lang } }) {
  console.log('AboutPage function started');
  try {
    const translations = await serverSideTranslations(lang, ['about']);
    
    return <AboutPageClient lang={lang} translations={translations} />;
  } catch (error) {
    console.error('Error in AboutPage:', error);
    return <div>An error occurred</div>;
  }
}
