import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/libs/mongoClient";
import LoginPageClient from './LoginPageClient';
import { headers } from 'next/headers';

async function fetchTranslations(lang, file) {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = headers().get('host');
  const url = `${protocol}://${host}/api/translations/${lang}?file=${file}`;
  console.log('Fetching translations from:', url);

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response from translations API:', errorText);
      throw new Error('Failed to fetch translations');
    }
    const json = await res.json();
    console.log('Fetched translations:', json);
    return json;
  } catch (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }
}

export default async function LoginPage({ params: { lang }, searchParams }) {
  console.log('LoginPage function started');
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    const translations = await fetchTranslations(lang, 'login');
    
    return <LoginPageClient session={session} searchParams={searchParams} translations={{ lang, ...translations }} />;
  } catch (error) {
    console.error('Error in LoginPage:', error);
    if (error.name === 'MongoNetworkTimeoutError') {
      // Retry logic...
      const maxRetries = 3;
      let retryCount = 0;
      while (retryCount < maxRetries) {
        try {
          await clientPromise;
          console.log('MongoDB connection established after retry');
          break;
        } catch (retryError) {
          console.error('Error connecting to MongoDB (retry attempt):', retryError);
          retryCount++;
          if (retryCount === maxRetries) {
            console.error('Max retries reached. MongoDB connection failed.');
            return <div>Service Unavailable</div>;
          }
          // Wait for a certain duration before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } else {
      return <div>An error occurred</div>;
    }
  }
}
