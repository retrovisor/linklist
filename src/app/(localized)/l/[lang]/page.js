import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeContent from './HomeContent';
import { headers } from 'next/headers';

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

export default async function Home({ params: { lang } }) {
  console.log('Home function started');
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    const translations = await fetchTranslations(lang, 'home');

    return <HomeContent session={session} translations={{ lang, ...translations }} />;
  } catch (error) {
    console.error('Error in Home:', error);
    return <div>An error occurred</div>;
  }
}
