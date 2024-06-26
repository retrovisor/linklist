import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AboutPageClient from './AboutPageClient';

export async function getStaticProps({ params: { lang } }) {
  return {
    props: {
      ...(await serverSideTranslations(lang, ['about'])),
    },
  };
}

export default function AboutPage({ params: { lang } }) {
  return <AboutPageClient lang={lang} />;
}
