import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import PageTextBoxesForm from "@/components/forms/PageTextBoxesForm";
import UsernameForm from "@/components/forms/UsernameForm";
import PageYouTubeForm from "@/components/forms/PageYouTubeForm";
import PageImageLinksForm from "@/components/forms/PageImageLinksForm";
import { Page } from "@/models/Page";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import cloneDeep from 'clone-deep';
import Head from 'next/head';

export default async function AccountPage({ searchParams }) {
  console.log('AccountPage function started');

  const session = await getServerSession(authOptions);
  console.log('Session:', session);

  const desiredUsername = searchParams?.desiredUsername || '';
  console.log('Desired Username:', desiredUsername);

  if (!session) {
    console.log('No session, redirecting to /');
    return redirect('/');
  }

  // Ensure mongoose connection is established only once
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      return <div>An error occurred. Please try again later.</div>;
    }
  }

  try {
    let page = await Page.findOne({ owner: session.user.email });
    console.log('Query executed successfully');
    console.log('Page:', page);

    if (!page) {
      console.log('Page not found for the user');
      console.log('Rendering UsernameForm with desiredUsername:', desiredUsername);
      return <UsernameForm desiredUsername={desiredUsername} />;
    }

    console.log('Page found:', page);

    if (!page.uri) {
      console.log('Page.uri is not defined');
      return <div>Page data is corrupted. Please contact support.</div>;
    }

    const leanPage = cloneDeep(page.toObject());
    if (leanPage._id) {
      leanPage._id = leanPage._id.toString();
    }
    console.log('Lean Page:', leanPage);

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
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return <div>An error occurred. Please try again later.</div>;
  }
}
