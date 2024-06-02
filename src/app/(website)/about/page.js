

export default async function AboutPage({ params }) {
  const locale = params?.locale || 'en';
  console.log('AboutPage locale:', locale);
  let translations = {};
  try {
    const translationsModule = await import(`../../../../translations/${locale}.json`);
    translations = translationsModule.default;
    console.log('Loaded translations:', translations);
  } catch (error) {
    console.error('Error loading translations:', error);
    const translationsModule = await import(`../../../../translations/en.json`);
    translations = translationsModule.default;
    console.log('Fallback translations:', translations);
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
