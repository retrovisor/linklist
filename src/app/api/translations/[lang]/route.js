'use client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function GET(request, { params }) {
  const { lang } = params;
  console.log(`API route called for lang: ${lang}`);
  try {
    const translations = await serverSideTranslations(lang, ['about']);
    console.log('Translations in API route:', translations);
    return new Response(JSON.stringify(translations), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching translations in API route:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch translations' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
