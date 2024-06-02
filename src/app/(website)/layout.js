// src/app/(website)/layout.js
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import '../globals.css';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl'; 

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Fizz.link - Your one link for everything',
  description: 'Share your links, social profiles, contact info and more on one page',
};

export default function RootLayout({ children }) {
  const router = useRouter();
  const { locale } = router;

  const messages = {
    en: {
      aboutUsTitle: 'About Us',
      paragraph1: 'This is the first paragraph.',
      paragraph2: 'This is the second paragraph.',
      paragraph3: 'This is the third paragraph.',
      paragraph4: 'This is the fourth paragraph.',
    },
    ko: {
      aboutUsTitle: '회사 소개',
      paragraph1: '첫 번째 단락입니다.',
      paragraph2: '두 번째 단락입니다.',
      paragraph3: '세 번째 단락입니다.',
      paragraph4: '네 번째 단락입니다.',
    },
  };

  return (
    <html lang={locale}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div className="flex-grow">
            <Header />
            <div className="mx-auto">
              {children}
            </div>
          </div>
          <Footer />
        </IntlProvider>
      </body>
    </html>
  );
}
