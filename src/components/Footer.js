import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Footer({ dict, lang }) {
  const session = await getServerSession(authOptions);

  const addLangToHref = (href) => {
    return `${href}${href.includes('?') ? '&' : '?'}lang=${lang}`;
  };

  return (
    <footer className="fundo-home border-t py-6">
      <div className="max-w-4xl flex justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href={addLangToHref('/')} className="flex items-center gap-1 text-blue-500">
            <img src="/logo4.png" alt="Logo" style={{ width: '1em' }} />
            <span className="font-bold cor-roxa">Fizz.link</span>
          </Link>
          <nav className="flex items-center gap-4 text-slate-500 text-sm">
            <Link href={addLangToHref('/about')}>{dict.footer.about}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
