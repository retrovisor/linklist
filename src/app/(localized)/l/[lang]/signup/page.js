import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignupWithGoogle from "@/components/buttons/SignupWithGoogle";
import SignupWithKakao from "@/components/buttons/SignupWithKakao";
import UsernameForm from "@/components/forms/UsernameForm";
import { redirect } from "next/navigation";
import { connectToMongoDB } from "@/libs/mongoClient";
import { useTranslations } from 'next-intl';

export default async function SignupPage({ params: { lang }, searchParams }) {
  const t = useTranslations('signup');
  
  console.log('Signup function started');
  try {
    // Ensure MongoDB connection
    await connectToMongoDB();
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    if (session) {
      console.log('User is logged in, rendering UsernameForm');
      const desiredUsername = searchParams.desiredUsername || "";
      return <UsernameForm desiredUsername={desiredUsername} />;
    }
    console.log('User is not logged in, rendering login buttons');
    return (
      <div>
        <div className="p-4 max-w-xs mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">{t('createAccount')}</h1>
          <p className="text-center mb-6 text-gray-500">
            {t('createAccountDescription')}
          </p>
          <SignupWithKakao />
          <div className="mt-4">
            <SignupWithGoogle />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in SignupPage:', error);
    if (error.code === 'ERR_JWE_DECRYPTION_FAILED') {
      console.error('JWT decryption failed. This might be due to an invalid or mismatched NEXTAUTH_SECRET.');
    }
    return <div>{t('errorOccurred')}</div>;
  }
}
