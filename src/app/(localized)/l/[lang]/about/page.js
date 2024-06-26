import AboutPageClient from './AboutPageClient';

export async function generateMetadata({ params: { lang } }) {
  return {
    title: 'Fizz.link - 모든 것을 하나의 링크로 만드세요',
    description: '여러분의 링크, 소셜 프로필, 창작물, 연락처 정보 등을 한 공간에서 공유하세요',
  };
}

async function fetchTranslations(lang) {
  const res = await fetch(`/api/translations/${lang}`);
  if (!res.ok) {
    throw new Error('Failed to fetch translations');
  }
  return res.json();
}

export default async function AboutPage({ params: { lang } }) {
  console.log('AboutPage function started with lang:', lang);
  try {
    const translations = await fetchTranslations(lang);
    console.log('Translations fetched:', translations);

    return <AboutPageClient lang={lang} translations={translations} />;
  } catch (error) {
    console.error('Error in AboutPage:', error);
    return <div>An error occurred</div>;
  }
}
