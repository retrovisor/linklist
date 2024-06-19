// app/(website)/login/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignupWithGoogle from "@/components/buttons/SignupWithGoogle";
import SignupWithKakao from "@/components/buttons/SignupWithKakao";
import UsernameForm from "@/components/forms/UsernameForm";
import { redirect } from "next/navigation";
import clientPromise from "@/libs/mongoClient";

export default async function LoginPage({ searchParams }) {
  console.log('Signup function started');

  try {
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
          <h1 className="text-4xl font-bold text-center mb-2">계정 만들기</h1>
          <p className="text-center mb-6 text-gray-500">
            아래 방법을 사용하여 무료로 Fizz.link 계정을 생성하세요
          </p>
          <SignupWithKakao />
          <div className="mt-4">
            <SignupWithGoogle />
          </div>
          
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in LoginPage:', error);

    if (error.name === 'MongoNetworkTimeoutError') {
      // Retry the operation
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
            return <div>서비스를 사용할 수 없습니다. 나중에 다시 시도해 주세요.</div>;
          }

          // Wait for a certain duration before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } else {
      // Handle other errors
      return <div>오류가 발생했습니다. 나중에 다시 시도해 주세요.</div>;
    }
  }
}
