'use client';

import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginWithFacebook() {
  const router = useRouter();

  const handleLogin = () => {
    const desiredUsername = window.localStorage.getItem('desiredUsername');
    signIn('facebook', {
      callbackUrl: desiredUsername ? `/account?desiredUsername=${desiredUsername}` : '/account',
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 text-white shadow text-center w-full py-4 flex gap-3 items-center justify-center"
    >
      <FontAwesomeIcon icon={faFacebook} className="h-6" />
      <span>페이스북으로 로그인</span>
    </button>
  );
}
