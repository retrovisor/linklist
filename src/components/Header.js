import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { getDictionary } from '@/libs/getDictionary';

export default async function Header({ lang }) {
  let session;
  let dict;

  try {
    [session, dict] = await Promise.all([
      getServerSession(authOptions),
      getDictionary(lang)
    ]);
  } catch (error) {
    console.error("Error in Header:", error);
    // Handle error as needed
  }

  return (
    <header className="py-4 sticky top-0 z-50 fundo-home">
      <div className="max-w-4xl flex justify-between mx-auto px-4 text-xl">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}`} className="flex items-center gap-1 text-blue-500">
            <img src="/logo4.png" alt="Logo" style={{ width: '1.2em' }} />
            <span className="font-bold cor-roxa">Fizz.link</span>
          </Link>
        </div>
        <nav className="flex items-center text-sm text-slate-500">
          {session ? (
            <>
              <Link href={`/${lang}/account`} className="btn-link2 mr-2">
                {dict.header.myPage}
              </Link>
              <LogoutButton label={dict.header.logout} />
            </>
          ) : (
            <>
              <Link href={`/${lang}/login`} className="btn-link2">{dict.header.login}</Link>
              <Link href={`/${lang}/signup`} className="btn-link">{dict.header.signup}</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

