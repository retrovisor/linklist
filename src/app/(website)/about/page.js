import { getDictionary } from '@/libs/getDictionary';

export default async function AboutPage({ params }) {
  console.log('AboutPage function called with params:', params);

  const lang = params?.lang || 'en';
  console.log('Language:', lang);

  let dict;
  try {
    dict = await getDictionary(lang);
    console.log('Dictionary loaded successfully:', dict);
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return <div>Error loading page content</div>;
  }

  if (!dict || !dict.about) {
    console.error('Dictionary or about section is undefined:', dict);
    return <div>Page content unavailable</div>;
  }

  console.log('Rendering AboutPage component');

  return (
    <div>
      <h1>{dict.about.title}</h1>
      {dict.about.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
