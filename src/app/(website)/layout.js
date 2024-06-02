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

export default async function RootLayout({ children, params: { locale } }) {
  let translations = {};
  try {
    translations = await import(`../../../translations/${locale}.json`);
  } catch (error) {
    translations = await import(`../../../translations/en.json`);
  }

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
