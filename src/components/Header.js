import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="py-4 sticky top-0 z-50 fundo-home">
      <div className="max-w-4xl flex justify-between mx-auto px-4 text-xl">
        <div className="flex items-center gap-6">
          <Link href={'/'} className="flex items-center gap-1 text-blue-500">
            <FontAwesomeIcon icon={faLink} className="cor-roxa" />
            <span className="font-bold cor-roxa">Fizz.link</span>
          </Link>
        </div>
        <nav className="flex items-center text-sm text-slate-500">
          {session ? (
            <>
              <Link href={'/account'} className="btn-link2 mr-2">
                My Page
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href={'/login'} className="btn-link2">Login</Link>
              <Link href={'/signup'} className="btn-link">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
