import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import '../globals.css';
import TrackPageView from "@/components/Fathom";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export async function generateMetadata({ params: { lang } }) {
  const { t } = await serverSideTranslations(lang, ['common']);
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function RootLayout({ children, params: { lang } }) {
  const { t } = await serverSideTranslations(lang, ['common']);

  return (
    <html lang={lang}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <TrackPageView />
        <div className="flex-grow">
          <Header t={t} />
          <div className="mx-auto">
            {children}
          </div>
        </div>
        <Footer t={t} />
      </body>
    </html>
  );
}

export async function getStaticProps({ params: { lang } }) {
  return {
    props: {
      ...(await serverSideTranslations(lang, ['common'])),
    },
  };
}
