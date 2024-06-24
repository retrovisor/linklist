// src/components/Footer.js
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Footer({ locale }) {
  const session = await getServerSession(authOptions);

  return (
    <footer className="fundo-home border-t py-6">
      <div className="max-w-4xl flex justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href={`/`} className="flex items-center gap-1 text-blue-500">
            <img src="/logo4.png" alt="Logo" style={{ width: '1em' }} />
            <span className="font-bold cor-roxa">Fizz.link</span>
          </Link>
          <nav className="flex items-center gap-4 text-slate-500 text-sm">
            <Link href={`/about`}>에 대한</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
