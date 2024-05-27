// Imports
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

  // Get user session
  const session = await getServerSession(authOptions);
  console.log('Session:', session);

  // Check for active session, redirect if not found
  if (!session) {
    console.log('No session, redirecting to /login');
    return redirect('/login');
  }

  // Connect to MongoDB if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  try {
    // Find the Page document for the logged-in user
    const page = await Page.findOne({ owner: session.user.email });
    console.log('Query executed successfully', page ? 'Page found.' : 'Page not found.');

    // If no Page found, return UsernameForm to let user create one
    if (!page) {
      console.log('Page not found for the user, showing UsernameForm');
      return <UsernameForm desiredUsername={searchParams?.desiredUsername} />;
    }

    // Prepare the page data for rendering
    const leanPage = cloneDeep(page.toObject());
    leanPage._id = leanPage._id.toString();
    console.log('Lean Page:', leanPage);

    // Return the JSX component tree with all page forms loaded
    return (
      <>
        <Head>
          <title>Edit account - {session.user.name}</title>
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
    // Log and handle any error that occurred during the process
    console.error('Error during MongoDB operation or page rendering:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
