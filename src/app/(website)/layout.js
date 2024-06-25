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
import { getSearchParams } from '@/libs/getSearchParams';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const searchParams = getSearchParams(children.props.childProp.segment);
  const lang = searchParams?.lang || 'en';
  const dict = await getDictionary(lang);

  console.log('RootLayout searchParams:', searchParams);
  console.log('RootLayout lang:', lang);
  console.log('RootLayout dict:', dict);

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
