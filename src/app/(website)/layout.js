// layout.js
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

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const dict = await getDictionary('en');

  return (
    <html lang="en">
      <body className={`${lato.className} min-h-screen fundo-home flex flex-col`}>
        <TrackPageView />
        <div className="flex-grow">
          <Header dict={dict} />
          <div className="mx-auto">
            {children}
          </div>
        </div>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
