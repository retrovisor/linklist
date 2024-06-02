// src/app/(website)/layout.js
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import '../globals.css';
import { useTranslation } from 'next-i18next';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Fizz.link - Your one link for everything',
  description: 'Share your links, social profiles, contact info and more on one page',
};

export default function RootLayout({ children, params: { locale } }) {
  const { i18n } = useTranslation();

  return (
    <html lang={locale}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <div className="flex-grow">
          <Header />
          <div className="mx-auto">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ko' }]; // Add other locales if needed
}
