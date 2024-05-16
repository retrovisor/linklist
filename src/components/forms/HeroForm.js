/* use client */
import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function HeroForm({user}) {
  const router = useRouter();
  useEffect(() => {
    if (
      'localStorage' in window &&
      window.localStorage.getItem('desiredUsername')
    ) {
      const username = window.localStorage.getItem('desiredUsername');
      window.localStorage.removeItem('desiredUsername');
      router.push('/login?desiredUsername=' + encodeURIComponent(username));
    }
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const form = ev.target;
    const input = form.querySelector('input');
    const username = input.value;
    if (username.length > 0) {
      window.localStorage.setItem('desiredUsername', username);
      router.push('/login');  // Redirect to login page instead of directly signing in
    }
  }

  return (
    <form onSubmit={handleSubmit} className="inline-flex items-center shadow-lg bg-white shadow-gray-500/20">
      <span className="bg-white py-4 pl-4">linklist.to/</span>
      <input
        type="text"
        className=""
        style={{backgroundColor: 'white', marginBottom: 0, paddingLeft: 0}}
        placeholder="username"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-4 px-6 whitespace-nowrap">
        Join for Free
      </button>
    </form>
  );
}
