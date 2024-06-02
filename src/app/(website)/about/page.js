// src/app/(website)/about/page.js
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ko' },
  ];
}

export default function AboutPage({ locale }) {
  const effectiveLocale = locale || 'en';

  let translations = {};
  try {
    translations = require(`../../../../translations/${effectiveLocale}.json`);
  } catch (error) {
    translations = require(`../../../../translations/en.json`);
  }

  return (
    <div className="bg-white text-white min-h-screen">
      <div className="h-36 colorido bg-cover bg-center">
        <h1 className="text-5xl font-bold text-center text-white pt-12">
          {translations.aboutUsTitle}
        </h1>
      </div>
      <div className="max-w-xl mx-auto text-center my-4 text-black px-4 text-left">
        <p className="p-4 text-left">{translations.paragraph1}</p>
        <p className="p-4 text-left">{translations.paragraph2}</p>
        <p className="p-4 text-left">{translations.paragraph3}</p>
        <p className="p-4 text-left">{translations.paragraph4}</p>
      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {/* Content for the grid */}
      </div>
    </div>
  );
}
