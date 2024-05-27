import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import UsernameForm from "@/components/forms/UsernameForm";
import { Page } from "@/models/Page";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import cloneDeep from 'clone-deep';

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

  // Ensure mongoose connection is established only once
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  try {
    const page = await Page.findOne({ owner: session?.user?.email });
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

    const leanPage = cloneDeep(page.toJSON());
    leanPage._id = leanPage._id.toString();
    console.log('Lean Page:', leanPage);

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
