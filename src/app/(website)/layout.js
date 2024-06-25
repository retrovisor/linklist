// layout.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDictionary } from '@/libs/getDictionary';
import Header from "@/components/Header";
 import { Lato } from 'next/font/google';
import '../globals.css';
import TrackPageView from "@/components/Fathom";
import React from 'react';
import { useSearchParams } from 'next/navigation';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export default async function RootLayout({ children }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const session = await getServerSession(authOptions);

  console.log('RootLayout searchParams:', searchParams);
  console.log('RootLayout lang:', lang);

  let dict;
  try {
    dict = await getDictionary(lang);
    console.log('RootLayout dict:', dict);
  } catch (error) {
    console.error('Error loading dictionary:', error);
    // Handle the error appropriately
  }

  return (
    <html lang={lang}>
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <TrackPageView />
        <div className="flex-grow">
          <Header dict={dict} session={session} />
          <div className="mx-auto">
            {React.cloneElement(children, { lang })}
          </div>
        </div>
       </body>
    </html>
  );
}
