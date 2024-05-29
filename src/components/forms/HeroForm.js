'use client';

import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HeroForm({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (
      'localStorage' in window
      && window.localStorage.getItem('desiredUsername')
    ) {
      const username = window.localStorage.getItem('desiredUsername');
      window.localStorage.removeItem('desiredUsername');
      redirect('/account?desiredUsername=' + username);
    }
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const form = ev.target;
    const input = form.querySelector('input');
    const username = input.value;
    if (username.length > 0) {
      if (user) {
        router.push('/account?desiredUsername=' + username);
      } else {
        window.localStorage.setItem('desiredUsername', username);
        await signIn('google');
      }
    }
  }

    return (
    <div className="w-full max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:space-x-4 space-y-4 sm:space-y-0"
      >
        <input
          type="text"
          className="bg-white border rounded-md flex-1 py-2 px-4 sm:py-4 sm:px-6"
          placeholder="Enter username"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 sm:py-4 sm:px-6 whitespace-nowrap rounded-md"
        >
          Join for Free
        </button>
      </form>
    </div>
  );
}

