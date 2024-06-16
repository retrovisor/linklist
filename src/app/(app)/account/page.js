import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import PageTextBoxesForm from "@/components/forms/PageTextBoxesForm";
import UsernameForm from "@/components/forms/UsernameForm";
import PageYouTubeForm from "@/components/forms/PageYouTubeForm";
import PageImageLinksForm from "@/components/forms/PageImageLinksForm";
import clientPromise from "@/libs/mongoClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import cloneDeep from 'clone-deep';
import Head from 'next/head';
import { ObjectId } from 'mongodb';

export default async function AccountPage({ searchParams }) {
  console.log('AccountPage function started');

  let session;
  try {
    session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session) {
      console.log('No session, redirecting to /');
      return redirect('/');
    }

    if (!session.user) {
      throw new Error('Session user is undefined');
    }
  } catch (sessionError) {
    console.error('Session retrieval error:', sessionError.message);
    return <div>에러 발생됨. 나중에 다시 시도 해주십시오</div>;
  }

  const desiredUsername = searchParams?.desiredUsername;
  console.log('Desired Username:', desiredUsername);

  let page;
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

    // Use ObjectId for querying by owner if necessary
    const userId = new ObjectId(session.user.id);
    page = await collection.findOne({ owner: userId });
    console.log('Query executed successfully');

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
    if (leanPage._id) {
      leanPage._id = leanPage._id.toString();
    } else {
      console.warn('Page _id is undefined');
    }
    console.log('Lean Page:', leanPage);

    // Ensure leanPage.uri exists before rendering components that might access it
    if (!leanPage.uri) {
      throw new Error('Page uri is undefined');
    }

    return (
      <>
        <Head>
          <title>{`Edit account - ${session.user.name}`}</title>
        </Head>
        <div className="container h-full bg-center fixed bg-auto overflow-x-hidden bg-no-repeat pb-10">
          <PageSettingsForm page={leanPage} user={session.user} />
          <PageButtonsForm page={leanPage} user={session.user} />
          <PageLinksForm page={leanPage} user={session.user} />
          <PageTextBoxesForm page={leanPage} user={session.user} />
          <PageImageLinksForm page={leanPage} user={session.user} />
          <PageYouTubeForm page={leanPage} user={session.user} />
        </div>
      </>
    );
  } catch (dbError) {
    console.error('Error occurred while interacting with the database:', dbError.message);
    console.error('Error stack:', dbError.stack);
    return <div>에러 발생됨. 나중에 다시 시도 해주십시오</div>;
  }
}
