// src/app/(localized)/[lang]/page.js
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import HomeContent from './HomeContent';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return <HomeContent session={session} />;
}
