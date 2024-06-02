// src/app/(website)/about/page.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AboutPage() {
  const router = useRouter();
  const { locale } = router;

  const translations = {
    en: {
      aboutUsTitle: 'About Us',
      paragraph1: 'This is the first paragraph.',
      paragraph2: 'This is the second paragraph.',
      paragraph3: 'This is the third paragraph.',
      paragraph4: 'This is the fourth paragraph.',
    },
    ko: {
      aboutUsTitle: '회사 소개',
      paragraph1: '첫 번째 단락입니다.',
      paragraph2: '두 번째 단락입니다.',
      paragraph3: '세 번째 단락입니다.',
      paragraph4: '네 번째 단락입니다.',
    },
  };

  const t = (key) => translations[locale]?.[key] || '';

  return (
    <div className="bg-white text-white min-h-screen">
      <div className="h-36 colorido bg-cover bg-center">
        <h1 className="text-5xl font-bold text-center text-white pt-12">{t('aboutUsTitle')}</h1>
      </div>
      <div className="max-w-xl mx-auto text-center my-4 text-black px-4 text-left">
        <p className="p-4 text-left">{t('paragraph1')}</p>
        <p cl
