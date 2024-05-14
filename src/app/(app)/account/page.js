import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import UsernameForm from "@/components/forms/UsernameForm";
import { Page } from "@/models/Page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import cloneDeep from 'clone-deep';
import clientPromise from '@/lib/mongoClient';

export default async function AccountPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const desiredUsername = searchParams?.desiredUsername;

  if (!session) {
    return redirect('/');
  }

  const client = await clientPromise;
  const db = client.db();
  const page = await db.collection('pages').findOne({ owner: session?.user?.email });

  if (!page) {
    return (
      <div>
        <UsernameForm desiredUsername={desiredUsername} />
      </div>
    );
  }

  const leanPage = cloneDeep(page);
  leanPage._id = leanPage._id.toString();

  return (
    <>
      <PageSettingsForm page={leanPage} user={session.user} />
      <PageButtonsForm page={leanPage} user={session.user} />
      <PageLinksForm page={leanPage} user={session.user} />
    </>
  );
}
