import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import '../../../globals.css';
import TrackPageView from "@/components/Fathom";
import { dir } from 'i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export async function generateMetadata({ params: { lang } }) {
  const { t } = await serverSideTranslations(lang, ['common']);
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default async function LocalizedLayout({ children, params: { lang } }) {
  const { t } = await serverSideTranslations(lang, ['common']);

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
