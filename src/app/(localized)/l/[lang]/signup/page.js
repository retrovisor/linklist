import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToMongoDB } from "@/libs/mongoClient";
import SignupPageClient from './SignupPageClient';

export default async function SignupPage({ params: { lang }, searchParams }) {
  console.log('Signup function started');
  
  try {
    // Ensure MongoDB connection
    await connectToMongoDB();
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    return (
      <SignupPageClient 
        session={session} 
        searchParams={searchParams}
        lang={lang}
      />
    );
  } catch (error) {
    console.error('Error in SignupPage:', error);
    if (error.code === 'ERR_JWE_DECRYPTION_FAILED') {
      console.error('JWT decryption failed. This might be due to an invalid or mismatched NEXTAUTH_SECRET.');
    }
    return <div>An error occurred</div>;
  }
}
