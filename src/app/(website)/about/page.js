import { getDictionary } from '@/libs/getDictionary';

export default async function AboutPage({ params: { lang } }) {
    const dict = await getDictionary(lang || 'en');

  return (
    <div className="bg-white text-white min-h-screen">
      <div className="h-36 colorido bg-cover bg-center">
        <h1 className="text-5xl font-bold text-center text-white pt-12">{dict.about.title}</h1>
      </div>
      <div className="max-w-xl mx-auto text-center my-4 text-black px-4 text-left">
        {dict.about.content.map((paragraph, index) => (
          <p key={index} className="p-4 text-left">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
