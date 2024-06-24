import { getDictionary } from '@/libs/getDictionary';

export default async function AboutPage({ searchParams }) {
  const lang = searchParams?.lang || 'en';
  console.log('Language:', lang);

  let dict;
  try {
    dict = await getDictionary(lang);
    console.log('Dictionary loaded successfully:', dict);
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return (
      <div className="bg-white text-black min-h-screen p-4">
        <h1 className="text-2xl font-bold">Error Loading Page</h1>
        <p>An error occurred while loading the page content. Please try again later.</p>
        <pre className="mt-4 p-2 bg-gray-100 rounded">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  if (!dict || !dict.about) {
    console.error('Dictionary or about section is undefined:', dict);
    return (
      <div className="bg-white text-black min-h-screen p-4">
        <h1 className="text-2xl font-bold">Page Content Unavailable</h1>
        <p>We&apos;re sorry, but the page content could not be loaded at this time.</p>
      </div>
    );
  }

  console.log('Rendering AboutPage component');
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
      <div className="mt-8 p-4 bg-gray-100 rounded max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-black mb-2">Debug Information:</h2>
        <pre className="text-xs text-black whitespace-pre-wrap">
          {JSON.stringify({ lang, dict: dict.about }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
