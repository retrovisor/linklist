import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppSidebar from "@/components/layout/AppSidebar";
import { Page } from "@/models/Page";
import { faBars, faLink, faChartSimple, faFileLines, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { Lato } from 'next/font/google'
import '../globals.css'
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import ShareDialog from '../(page)/[uri]/ShareDialog';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Fizz.link',
  description: 'Generated by create next app',
};

export default async function AppTemplate({ children, ...rest }) {
  const headersList = headers();
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/');
  }

  mongoose.connect(process.env.MONGO_URI);

  const page = await Page.findOne({ owner: session.user.email });

  return (
    <html lang="en">
      <body className={lato.className}>
        <Toaster />
        <main className="md:flex">
          <div className="flex justify-end sticky bg-white top-0 z-10 shadow">
            <label htmlFor="navCb" className="md:hidden p-2 rounded-md bg-white inline-flex items-center gap-2 cursor-pointer">
              <div className="flex items-center gap-5">
                <Link href="/account">
                  <FontAwesomeIcon icon={faFileLines} className="text-slate-500	w-6 h-6" />
                </Link>
                <Link href="/analytics">
                  <FontAwesomeIcon icon={faChartSimple} className="text-slate-500	w-6 h-6" />
                </Link>
                <ShareDialog uri={page.uri}>
  <FontAwesomeIcon icon={faShareFromSquare} className="text-slate-500	w-6 h-6" />
</ShareDialog>
                <div className="rounded-full overflow-hidden w-12 h-12 shadow">
                  <Image
                    src={session.user.image}
                    width={80}
                    height={80}
                    alt={'avatar'}
                    unoptimized
                    className="object-cover w-full h-full rounded-full border border-white shadow shadow-black/50"
                  />
                </div>
              </div>
            </label>
          </div>

          <input id="navCb" type="checkbox" className="hidden" />
          <label htmlFor="navCb" className="hidden backdrop fixed inset-0 bg-black/80 z-10"></label>

          <aside className="bg-white w-48 p-4 pt-6 shadow fixed md:static -left-48 top-0 bottom-0 z-20 transition-all">
            <div className="sticky top-0 pt-2">
              <div className="rounded-full overflow-hidden aspect-square w-24 mx-auto border border-white shadow shadow-black/50">
                <Image src={session.user.image} className="object-cover w-full h-full" width={256} height={256} alt={'avatar'} unoptimized />
              </div>
              {page && (
                <div className="text-center mt-4 flex gap-1 items-center justify-center text-sm">
                  <FontAwesomeIcon size="sm" icon={faLink} className="text-blue-500" />
                  <span className="text-sm">Fizz.link</span>
                  <Link
                    target="_blank"
                    href={'/' + page.uri}
                    className="flex gap-1 items-center justify-center text-sm"
                  >
                    <span className="text-sm text-gray-300">/</span>
                    <span className="text-sm">{page.uri}</span>
                  </Link>
                </div>
              )}
              <div className="text-center">
                <AppSidebar />
              </div>
            </div>
          </aside>

          <div className="grow min-h-screen">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}
