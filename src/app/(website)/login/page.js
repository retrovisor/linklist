'use client';

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";
import LoginWithKakao from "@/components/buttons/LoginWithKakao";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const username = localStorage.getItem('desiredUsername');
      const redirectUrl = username ? `/account?desiredUsername=${username}` : '/account';
      router.push(redirectUrl);
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // You can replace this with a spinner or loading animation
  }

  return (
    <div>
      <div className="p-4 max-w-xs mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Sign In
        </h1>
        <p className="text-center mb-6 text-gray-500">
          Sign in to your account using one of the methods below
        </p>
        <LoginWithKakao />
        <div className="mt-4">
          <LoginWithGoogle />
        </div>
      </div>
    </div>
  );
}
