import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import { dir } from 'i18next';
import '../globals.css';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export async function generateStaticParams() {
  return ['en', 'ko'].map(locale => ({ locale }));
}

export const metadata = {
  title: 'Fizz.link - Your one link for everything',
  description: 'Share your links, social profiles, contact info and more on one page',
};

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <Header locale={locale} />
        <div className="flex-grow">
          <div className="mx-auto">
            {children}
          </div>
        </div>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
