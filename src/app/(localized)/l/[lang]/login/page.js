import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/libs/mongoClient";
import LoginPageClient from './LoginPageClient';

export default async function LoginPage({ searchParams }) {
  console.log('LoginPage function started');
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    return <LoginPageClient session={session} searchParams={searchParams} />;
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
