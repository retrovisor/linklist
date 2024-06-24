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
  const dict = await getDictionary(lang);

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
