// app/(localized)/layout.js
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import '../../../globals.css';
import TrackPageView from "@/components/Fathom";
import { useTranslation } from 'next-i18next';
import { dir } from 'i18next';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Fizz.link - 모든 것을 하나의 링크로 만드세요',
  description: '여러분의 링크, 소셜 프로필, 창작물, 연락처 정보 등을 한 공간에서 공유하세요',
};

export default function LocalizedLayout({ children, params: { lang } }) {
  const { t } = useTranslation('common');

  return (
    <html lang={lang} dir={dir(lang)}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <TrackPageView />
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
