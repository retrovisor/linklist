import Header from "@/components/Header";
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
        title: 'Page Not Found | Fizz.link',
      };
    }

    return {
      title: `${page.displayName} (@${page.uri}) | Fizz.link`,
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
    <html lang="en">
      <body className={lato.className}>
        <main>
     
          {children}
        </main>
      </body>
    </html>
  );
}
