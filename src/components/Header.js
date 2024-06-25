import { authOptions } from "@/app/api/auth/[...nextauth]/route";
'use client';

import { useSearchParams } from 'next/navigation';
import LogoutButton from "@/components/buttons/LogoutButton";
import Link from "next/link";

export default function Header({ dict }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  console.log('Header lang:', lang);
  console.log('Header dict:', dict);

  const addLangToHref = (href) => {
    return `${href}${href.includes('?') ? '&' : '?'}lang=${lang}`;
  };

  return (
    <header className="py-4 sticky top-0 z-50 fundo-home">
      <div className="max-w-4xl flex justify-between mx-auto px-4 text-xl">
        <div className="flex items-center gap-6">
          <Link href={addLangToHref('/')} className="flex items-center gap-1 text-blue-500">
            <img src="/logo4.png" alt="Logo" style={{ width: '1.2em' }} />
            <span className="font-bold cor-roxa">Fizz.link</span>
          </Link>
        </div>
        <nav className="flex items-center text-sm text-slate-500">
          <Link href={addLangToHref('/login')} className="btn-link2">{dict.header.login}</Link>
          <Link href={addLangToHref('/signup')} className="btn-link">{dict.header.signup}</Link>
        </nav>
      </div>
    </header>
  );
}
