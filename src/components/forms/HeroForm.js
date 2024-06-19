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
    const formData = new FormData(ev.target);
    const username = formData.get('username');

    console.log('Desired username (HeroForm):', username);

    if (username && username.length > 0) {
      try {
        const response = await fetch('@/app/api/username/logUsername', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error('Error logging username:', response.statusText);
        }
      } catch (error) {
        console.error('Error logging username:', error);
      }

      // Track Fathom event
      if (typeof window !== 'undefined' && window.fathom) {
        console.log('Tracking Fathom event');
        window.fathom.trackGoal('YOUR_FATHOM_EVENT_ID', 0);
      } else {
        console.error('Fathom not loaded');
      }

      if (user) {
        router.push('/account?desiredUsername=' + username);
      } else {
        window.localStorage.setItem('desiredUsername', username);
        router.push('/signup?desiredUsername=' + username);
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
          name="username"
          className="!bg-white border rounded-md flex-1 !py-4 !px-4 sm:py-4 sm:px-6 !w-auto !mb-0 !p-0"
          placeholder="사용자 이름 입력"
        />
        <button
          type="submit"
          className="btn-link3 text-white whitespace-nowrap !py-4 !px-4 sm:py-4 sm:px-6"
        >
          무료로 가입하기
        </button>
      </form>
    </div>
  );
}
