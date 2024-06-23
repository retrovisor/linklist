import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import PageTextBoxesForm from "@/components/forms/PageTextBoxesForm";
import UsernameForm from "@/components/forms/UsernameForm";
import PageYouTubeForm from "@/components/forms/PageYouTubeForm";
import PageImageLinksForm from "@/components/forms/PageImageLinksForm";
import { performDatabaseOperation } from "@/libs/mongoClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import cloneDeep from 'clone-deep';
import Head from 'next/head';

export default async function AccountPage({ searchParams }) {
  console.log('AccountPage function started');
  const session = await getServerSession(authOptions);
  console.log('Session:', session);

  if (!session) {
    console.log('No session, redirecting to /login');
    return redirect('/login');
  }

  const desiredUsername = searchParams?.desiredUsername;
  console.log('Desired Username:', desiredUsername);

  let page;
  try {
    page = await performDatabaseOperation(async (db) => {
      console.log('Connected to MongoDB');
      const collection = db.collection("pages");
      return await collection.findOne({ owner: session.user.id });
    });

    console.log('MongoDB query result:', page);

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
    }
    console.log('Lean Page:', leanPage);

    if (!leanPage.uri) {
      console.error('Page uri is undefined:', leanPage);
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
  } catch (error) {
    console.error('Error occurred:', error.message);
    console.error('Error stack:', error.stack);
    return <div>에러 발생됨. 나중에 다시 시도 해주십시오</div>;
  }
}
