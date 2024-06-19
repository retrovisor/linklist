'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";
import kakaoLogo from '/public/kakao.png';
import * as FathomClient from 'fathom-client';

 
export default function SignupWithKakao() {
  const handleClick = () => {
    console.log('Clicked on SignupWithKakao button');
    FathomClient.trackEvent('Signup With Kakao');

    signIn('kakao');
  };
  
  return (
    <button
      onClick={handleClick}
      className="bg-yellow-400 shadow text-center w-full py-4 flex gap-3 items-center justify-center"
    >
      <Image src={kakaoLogo} alt="Kakao" width={24} height={24} className="h-6" />
      <span>카카오톡으로 로그인</span>
    </button>
  );
}
