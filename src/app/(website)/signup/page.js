// app/(website)/login/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";
import LoginWithKakao from "@/components/buttons/LoginWithKakao";
import LoginWithFacebook from "@/components/buttons/LoginWithFacebook";
import UsernameForm from "@/components/forms/UsernameForm";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }) {
  console.log('LoginPage function started');

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
          <LoginWithKakao />
          <div className="mt-4">
            <LoginWithGoogle />
          </div>
          <div className="mt-4">
            <LoginWithFacebook />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in LoginPage:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
