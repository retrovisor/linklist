'use client';
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {signIn} from "next-auth/react";

export default function SignupWithGoogle() {
  const handleClick = () => {
    console.log('Clicked on SignupWithGoogle button');
    signIn('google');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white shadow text-center w-full py-4 flex gap-3 items-center justify-center">
      <FontAwesomeIcon icon={faGoogle} className="h-6" />
      <span>구글로 로그인</span>
    </button>
  );
}
