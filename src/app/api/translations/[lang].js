import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default async function handler(req, res) {
  const { lang } = req.query;
  try {
    const translations = await serverSideTranslations(lang, ['about']);
    res.status(200).json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
}
