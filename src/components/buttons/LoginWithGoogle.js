'use client';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/router';

export default function LoginWithGoogle() {
  const router = useRouter();

  const handleLogin = async () => {
    const result = await signIn('google', { redirect: false });
    if (result?.ok) {
      router.push('/account'); // Redirect to /account on successful login
    } else {
      console.error(result?.error); // Handle login error
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-white shadow text-center w-full py-4 flex gap-3 items-center justify-center">
      <FontAwesomeIcon icon={faGoogle} className="h-6" />
      <span>Sign In with Google</span>
    </button>
  );
}
