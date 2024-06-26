import AboutPageClient from './AboutPageClient';
import { headers } from 'next/headers';

export async function generateMetadata({ params: { lang } }) {
  return {
    title: 'Fizz.link - 모든 것을 하나의 링크로 만드세요',
    description: '여러분의 링크, 소셜 프로필, 창작물, 연락처 정보 등을 한 공간에서 공유하세요',
  };
}

async function fetchTranslations(lang, file) {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = headers().get('host');
  const url = `${protocol}://${host}/api/translations/${lang}?file=${file}`;
  console.log('Fetching translations from:', url);

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response from translations API:', errorText);
      throw new Error('Failed to fetch translations');
    }
    const json = await res.json();
    console.log('Fetched translations:', json);
    return json;
  } catch (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }
}

export default async function AboutPage({ params: { lang } }) {
  console.log('AboutPage function started with lang:', lang);
  try {
    const translations = await fetchTranslations(lang, 'about');
    return <AboutPageClient lang={lang} translations={translations} />;
  } catch (error) {
    console.error('Error in AboutPage:', error);
    return <div>An error occurred</div>;
  }
}
