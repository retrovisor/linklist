import AboutPageClient from './AboutPageClient';
import { getTranslations } from '../../../libs/getTranslations';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'kr' }];
}

export default async function AboutPage({ params: { lang } }) {
  console.log('AboutPage function started with lang:', lang);
  try {
    const translations = await getTranslations(lang, ['about']);
    console.log('Translations fetched:', translations);

    return <AboutPageClient lang={lang} translations={translations} />;
  } catch (error) {
    console.error('Error in AboutPage:', error);
    return <div>An error occurred</div>;
  }
}
