import { Lato } from 'next/font/google';
import '../../globals.css';
import '@/styles/global.css';
import { Page } from "@/models/Page";
import mongoose from "mongoose";

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export async function generateMetadata({ params }) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const uri = params.uri;
    const page = await Page.findOne({ uri });
    if (!page) {
      return {
        title: '페이지를 찾을 수 없음 | Fizz.link',
      };
    }
    const ogImageUrl = page.ogImageUrl; // Retrieve the pre-generated OG image URL from the page's document
    return {
      title: `${page.displayName} (@${page.uri}) | Fizz.link`,
      openGraph: {
        title: `${page.displayName} (@${page.uri}) | Fizz.link`,
        description: page.bio,
        url: `https://fizz.link/${page.uri}`,
        type: 'website',
        images: [
          {
            url: ogImageUrl, // Use the pre-generated OG image URL
            width: 1200,
            height: 630,
            alt: 'Generated OG image',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: page.displayName,
        description: page.bio,
        site: '@FizzLink',
        creator: '@FizzLink',
        images: [ogImageUrl], // Use the pre-generated OG image URL
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | Fizz.link',
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="kr">
      <body className={lato.className}>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
