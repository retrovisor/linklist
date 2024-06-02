// src/components/Header.js
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Header({ locale }) {
  const session = await getServerSession(authOptions);

  return (
    <header className="py-4 sticky top-0 z-50 fundo-home">
      <div className="max-w-4xl flex justify-between mx-auto px-4 text-xl">
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center gap-1 text-blue-500">
            <img src="/logo4.png" alt="Logo" style={{ width: '1.2em' }} />
            <span className="font-bold cor-roxa">Fizz.link</span>
          </Link>
        </div>
        <nav className="flex items-center text-sm text-slate-500">
          {session ? (
            <>
              <Link href={`/${locale}/account`} className="btn-link2 mr-2">
                My Page
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href={`/${locale}/login`} className="btn-link2">Login</Link>
              <Link href={`/${locale}/signup`} className="btn-link">Sign Up</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <Link href={`/${locale === 'en' ? 'ko' : 'en'}`} locale={false}>
            <a className="btn-link">
              {locale === 'en' ? '한국어' : 'English'}
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
