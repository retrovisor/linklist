import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppSidebar from "@/components/layout/AppSidebar";
import { faFileLines, faShareFromSquare, faBars, faLink, faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
import { Lato } from 'next/font/google';
import '../globals.css';
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import ShareDialog from '../(page)/[uri]/ShareDialog';
import CopyLinkButton from '@/components/buttons/CopyLinkButton';
import { ObjectId } from 'mongodb';
import clientPromise from "@/libs/mongoClient";
import TrackPageView from "@/components/Fathom";


const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Fizz.link',
  description: '모든 링크를 한 곳에서',
};

export default async function AppTemplate({ children, ...rest }) {
  const headersList = headers();
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/');
  }

  let page, user;
  try {
    const client = await clientPromise;
    if (!client) {
      throw new Error('Failed to initialize MongoDB client');
    }

    const db = client.db();
    if (!db) {
      throw new Error('Failed to get MongoDB database');
    }

    console.log('Connected to MongoDB');

    const collection = db.collection("pages");
    if (!collection) {
      throw new Error('Failed to get MongoDB collection');
    }

    console.log('Looking for page with owner:', session.user.id);
    page = await collection.findOne({ owner: session.user.id });
    console.log('MongoDB query result:', page);

    if (!page) {
      console.log('Page not found for the user:', session.user.id);
      return redirect('/account');
    }

    console.log('Page found:', page);

    user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });
    console.log('User found:', user);

    return (
      <html lang="kr">
        <body className={lato.className}>
              <TrackPageView />

          <Toaster />
          <main className="md:flex">
            <div className="flex justify-end sticky bg-white top-0 z-10 shadow">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-6 md:hidden">
                  <Link href={'/'} className="flex items-center gap-1 text-blue-500 ml-4">
                    <img src="/logo4.png" alt="Logo" style={{ width: '1.2em' }} />
                    <span className="font-bold cor-roxa" style={{ fontSize: '20px' }}>Fizz.link</span>
                  </Link>
                </div>
                <label htmlFor="navCb" className="md:hidden p-2 rounded-md bg-white inline-flex items-center gap-2 cursor-pointer">
                  <div className="flex items-center gap-5">
                    <Link href="/account">
                      <FontAwesomeIcon icon={faFileLines} className="text-slate-500 w-6 h-6" />
                    </Link>
                    <Link href="/analytics">
                      <FontAwesomeIcon icon={faChartSimple} className="text-slate-500 w-6 h-6" />
                    </Link>
                    {page && page.uri && (
                      <ShareDialog uri={page.uri}>
                        <button>
                          <FontAwesomeIcon icon={faShareFromSquare} className="text-slate-500 w-6 h-6" />
                        </button>
                      </ShareDialog>
                    )}
                    <div className="rounded-full overflow-hidden w-12 h-12 shadow">
                      <Image
                        src={user?.image || 'https://fizz.link/avatar.png'}
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
            </div>
            <input id="navCb" type="checkbox" className="hidden" />
            <label htmlFor="navCb" className="hidden backdrop fixed inset-0 bg-black/80 z-10"></label>
            <aside className="bg-white w-48 p-2 pt-6 shadow fixed md:static -left-48 top-0 bottom-0 z-20 transition-all">
              <div className="sticky top-0 pt-2">
                <div className="rounded-full overflow-hidden aspect-square w-24 mx-auto border-3 border-white shadow shadow-black/50">
                  <Image src={user?.image || 'https://fizz.link/avatar.png'} className="object-cover w-full h-full" width={256} height={256} alt={'avatar'} unoptimized />
                </div>
                {page && page.uri && (
                  <div className="text-center mt-4 bg-custom-gray p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-1">
                      <img src="/logo4.png" alt="Logo" style={{ width: '1em' }} />
                      <Link
                        target="_blank"
                        href={'/' + page.uri}
                        className="text-base font-semibold text-slate-900 hover:text-blue-600 transition duration-200"
                      >
                        <span>Fizz.link/{page.uri}</span>
                      </Link>
                    </div>
                    <div className="mt-2 flex justify-center">
                      <CopyLinkButton uri={page.uri} />
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <AppSidebar />
                </div>
              </div>
            </aside>
            <div className="grow min-h-screen">
              {typeof children === 'function' ? children({ page, user }) : children}
            </div>
          </main>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error during MongoDB operation or page rendering:', error);
    return (
      <html lang="en">
        <body>
          <p>An error occurred. Please try again later.</p>
        </body>
      </html>
    );
  }
}
