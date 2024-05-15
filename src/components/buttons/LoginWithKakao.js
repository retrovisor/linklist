'use client';
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKakao } from "@fortawesome/free-brands-svg-icons"; // Assuming you have a Kakao icon in your library

export default function LoginWithKakao() {
  return (
    <button
      onClick={() => signIn('kakao')}
      className="bg-yellow-400 shadow text-center w-full py-4 flex gap-3 items-center justify-center">
      <FontAwesomeIcon icon={faKakao} className="h-6" />
      <span>Sign In with Kakao</span>
    </button>
  );
}
