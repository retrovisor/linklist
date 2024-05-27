'use client';

import { useSession } from "next-auth/react";
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";
import LoginWithKakao from "@/components/buttons/LoginWithKakao";
import LoginWithFacebook from "@/components/buttons/LoginWithFacebook";
import UsernameForm from "@/components/forms/UsernameForm";

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="p-4 max-w-xs mx-auto">
        {status === "authenticated" ? (
          <UsernameForm desiredUsername="" />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
