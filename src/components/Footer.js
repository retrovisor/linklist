
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getServerSession} from "next-auth";
import Link from "next/link";

export default async function Footer() {
  const session = await getServerSession(authOptions);
  return (
    <footer className="bg-white border-b py-2">
      <div className="max-w-4xl flex justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href={'/'} className="flex items-center gap-1 text-blue-500">
            <FontAwesomeIcon icon={faLink} className="text-blue-500" />
            <span className="font-bold">Fizz.link</span>
          </Link>
          <nav className="flex items-center gap-4 text-slate-500 text-sm">
            <Link href={'/about'}>About</Link>
           </nav>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-500">
          {!!session && (
            <>
              <Link href={'/account'}>
                My Links
              </Link>
              <LogoutButton />
            </>
          )}
          {!session && (
            <>
              <Link href={'/login'}>Sign In</Link>
              <Link href={'/login'}>Create Account</Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
