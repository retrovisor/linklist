// layout.js
import { getDictionary } from '@/libs/getDictionary';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import '../globals.css';
import TrackPageView from "@/components/Fathom";

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export async function generateMetadata({ searchParams }) {
  const lang = searchParams?.lang || 'en';
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export default async function RootLayout({ children, searchParams }) {
  const lang = searchParams?.lang || 'en';
  console.log('RootLayout lang:', lang);

  let dict;
  try {
    dict = await getDictionary(lang);
    console.log('RootLayout dict:', dict);
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

  if (!dict) {
    console.error('Dictionary is undefined:', dict);
    return (
      <div className="bg-white text-black min-h-screen p-4">
        <h1 className="text-2xl font-bold">Page Content Unavailable</h1>
        <p>We&apos;re sorry, but the page content could not be loaded at this time.</p>
      </div>
    );
  }

  return (
    <html lang={lang}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <TrackPageView />
        <div className="flex-grow">
          <Header dict={dict} lang={lang} />
          <div className="mx-auto">
            {children}
          </div>
        </div>
        <Footer dict={dict} lang={lang} />
      </body>
    </html>
  );
}
