// Comment out the problematic import for now
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function GET(request, { params }) {
  const { lang } = params;
  console.log(`API route called for lang: ${lang}`);
  try {
    // Static translations for testing
    const translations = {
      title: lang === 'kr' ? "소개" : "About Us",
      welcome: lang === 'kr' ? "우리 웹사이트에 오신 것을 환영합니다" : "Welcome to our website",
      description1: lang === 'kr' ? "이것은 첫 번째 설명입니다." : "This is the first description.",
      description2: lang === 'kr' ? "이것은 두 번째 설명입니다." : "This is the second description.",
      description3: lang === 'kr' ? "이것은 세 번째 설명입니다." : "This is the third description.",
      description4: lang === 'kr' ? "이것은 네 번째 설명입니다." : "This is the fourth description."
    };
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
