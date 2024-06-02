import { useTranslation } from 'next-i18next';

export default async function AboutPage({ params: { locale } }) {
  const { t } = await useTranslation('common', locale);

  return (
    <div className="bg-white text-white min-h-screen">
      <div className="h-36 colorido bg-cover bg-center">
        <h1 className="text-5xl font-bold text-center text-white pt-12">
          {t('aboutUsTitle')}
        </h1>
      </div>
      <div className="max-w-xl mx-auto text-center my-4 text-black px-4 text-left">
        <p className="p-4 text-left">{t('paragraph1')}</p>
        <p className="p-4 text-left">{t('paragraph2')}</p>
        <p className="p-4 text-left">{t('paragraph3')}</p>
        <p className="p-4 text-left">{t('paragraph4')}</p>
      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {/* Content for the grid */}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ko' }];
}
