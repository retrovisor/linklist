// src/app/(website)/layout.js
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import '../globals.css';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Fizz.link - Your one link for everything',
  description: 'Share your links, social profiles, contact info and more on one page',
};

export default function RootLayout({ children, params }) {
  const locale = params.locale || 'en';

  let translations = {};
  try {
    translations = require(`../../../translations/${locale}.json`);
  } catch (error) {
    translations = require(`../../../translations/en.json`);
  }

  return (
    <html lang={locale}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <Header />
        <div className="flex-grow">
          <div className="mx-auto">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
