import AboutPageClient from './AboutPageClient';

export default async function AboutPage({ params: { lang } }) {
  console.log('AboutPage function started');
  try {
    // Any server-side logic can go here if needed
    
    return <AboutPageClient lang={lang} />;
  } catch (error) {
    console.error('Error in AboutPage:', error);
    return <div>An error occurred</div>;
  }
}
