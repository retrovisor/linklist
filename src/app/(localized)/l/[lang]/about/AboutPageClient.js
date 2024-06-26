'use client';

import { useTranslation } from 'next-i18next';

export default function AboutPageClient({ lang }) {
  const { t } = useTranslation('about');

  return (
    <div className="bg-white text-white min-h-screen">
      <div className="h-36 colorido bg-cover bg-center">
        <h1 className="text-5xl font-bold text-center text-white pt-12">{t('title')}</h1>
      </div>
      <div className="max-w-xl mx-auto text-center my-4 text-black px-4 text-left">
        <p className="p-4 text-left">{t('welcome')}</p>
        <p className="p-4 text-left">{t('description1')}</p>
        <p className="p-4 text-left">{t('description2')}</p>
        <p className="p-4 text-left">{t('description3')}</p>
        <p className="p-4 text-left">{t('description4')}</p>
      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {/* Content for the grid */}
      </div>
    </div>
  );
}
