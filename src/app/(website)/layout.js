// src/app/(website)/layout.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDictionary } from '@/libs/getDictionary';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lato } from 'next/font/google';
import '../globals.css';
import TrackPageView from "@/components/Fathom";
import React from 'react';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'kr' }];
}

export async function generateMetadata({ params: { lang } }) {
  const dict = await getDictionary(lang);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

async function RootLayout({ children, params: { lang } }) {
  const dict = await getDictionary(lang);
  const session = await getServerSession(authOptions);

  return (
    <html lang={lang}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <TrackPageView />
        <div className="flex-grow">
          <Header dict={dict} lang={lang} session={session} />
          <div className="mx-auto">
            {React.cloneElement(children, { lang })}
          </div>
        </div>
        <Footer dict={dict} lang={lang} />
      </body>
    </html>
  );
}

export default RootLayout;
