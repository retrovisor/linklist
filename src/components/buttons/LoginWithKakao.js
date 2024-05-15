'use client';
import { signIn } from "next-auth/react";
import Image from "next/image";
import kakaoLogo from "@/public/kakao.png"; // Ensure you have the Kakao logo in your public folder

export default function LoginWithKakao() {
  return (
    <button
      onClick={() => signIn('kakao')}
      className="bg-yellow-400 shadow text-center w-full py-4 flex gap-3 items-center justify-center">
      <Image src={kakaoLogo} alt="Kakao" width={24} height={24} className="h-6" />
      <span>Sign In with Kakao</span>
    </button>
  );
}
