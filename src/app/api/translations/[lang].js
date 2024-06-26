import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function GET(req, { params }) {
  const { lang } = params;
  try {
    const translations = await serverSideTranslations(lang, ['about']);
    return new Response(JSON.stringify(translations), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch translations2' }), { status: 500 });
  }
}
