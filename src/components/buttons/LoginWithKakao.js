'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";
import kakaoLogo from '/public/kakao.png';
import { useRouter } from "next/navigation";

export default function LoginWithKakao() {
  const router = useRouter();

  const handleLogin = () => {
    const desiredUsername = window.localStorage.getItem('desiredUsername');
    signIn('kakao', {
      callbackUrl: desiredUsername ? `/account?desiredUsername=${desiredUsername}` : '/account',
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-yellow-400 shadow text-center w-full py-4 flex gap-3 items-center justify-center"
    >
      <Image src={kakaoLogo} alt="Kakao" width={24} height={24} className="h-6" />
      <span>Sign In with Kakao</span>
    </button>
  );
}
