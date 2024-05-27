// app/(website)/login/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";
import LoginWithKakao from "@/components/buttons/LoginWithKakao";
import LoginWithFacebook from "@/components/buttons/LoginWithFacebook";
import UsernameForm from "@/components/forms/UsernameForm";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (session) {
    const desiredUsername = searchParams.desiredUsername || "";
    redirect(`/account?desiredUsername=${desiredUsername}`);
  }

  const desiredUsername = searchParams.desiredUsername || "";

  return (
    <div>
      {desiredUsername ? (
        <UsernameForm desiredUsername={desiredUsername} />
      ) : (
        <div className="p-4 max-w-xs mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Sign In</h1>
          <p className="text-center mb-6 text-gray-500">
            Sign in to your account using one of the methods below
          </p>
          <LoginWithKakao />
          <div className="mt-4">
            <LoginWithGoogle />
          </div>
          <div className="mt-4">
            <LoginWithFacebook />
          </div>
        </div>
      )}
    </div>
  );
}
