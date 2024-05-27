'use client';

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginWithGoogle() {
  const router = useRouter();

  const handleLogin = () => {
    const desiredUsername = window.localStorage.getItem('desiredUsername');
    signIn('google', {
      callbackUrl: desiredUsername ? `/account?desiredUsername=${desiredUsername}` : '/account',
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-white shadow text-center w-full py-4 flex gap-3 items-center justify-center"
    >
      <FontAwesomeIcon icon={faGoogle} className="h-6" />
      <span>Sign In with Google</span>
    </button>
  );
}
