import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import UsernameForm from "@/components/forms/UsernameForm";
import { Page } from "@/models/Page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import cloneDeep from 'clone-deep';
import clientPromise from '@/libs/mongoClient';

export default async function AccountPage({ searchParams }) {
  console.log('AccountPage function started');

  const session = await getServerSession(authOptions);
  console.log('Session:', session);

  const desiredUsername = searchParams?.desiredUsername;
  console.log('Desired Username:', desiredUsername);

  if (!session) {
    console.log('No session, redirecting to /');
    return redirect('/');
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    console.log('Connected to MongoDB');

    const page = await db.collection('pages').findOne({ owner: session?.user?.email });
    console.log('Query executed successfully');
    console.log('Page:', page);

    if (!page) {
      console.log('Page not found for the user');
      return (
        <div>
          <UsernameForm desiredUsername={desiredUsername} />
        </div>
      );
    }

    console.log('Page found:', page);

    const leanPage = cloneDeep(page);
    leanPage._id = leanPage._id.toString();

    console.log('Rendering page components');

    return (
      <>
        <PageSettingsForm page={leanPage} user={session.user} />
        <PageButtonsForm page={leanPage} user={session.user} />
        <PageLinksForm page={leanPage} user={session.user} />
      </>
    );
  } catch (error) {
    console.error('Error:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
