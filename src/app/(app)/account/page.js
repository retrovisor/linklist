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
    console.log('Session:', JSON.stringify(session, null, 2));

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
    const db = client.db();
    console.log('Connected to MongoDB');

    const collection = db.collection("pages");
    console.log('Looking for page with owner:', session.user.id);

    const userId = new ObjectId(session.user.id);
    page = await collection.findOne({ owner: userId });
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

    const leanPage = cloneDeep(page);
    if (leanPage._id) {
      leanPage._id = leanPage._id.toString();
   
