import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";
import LoginWithKakao from "@/components/buttons/LoginWithKakao";
import LoginWithFacebook from "@/components/buttons/LoginWithFacebook";
import UsernameForm from "@/components/forms/UsernameForm";
import { redirect } from "next/navigation";
import { Page } from "@/models/Page";
import mongoose from "mongoose";

export default async function LoginPage({ searchParams }) {
  console.log('LoginPage function started');

  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (session) {
      console.log('User is logged in');

      // Ensure mongoose connection is established only once
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
      }

      // Check if the user has a page associated with their email
      const page = await Page.findOne({ owner: session?.user?.email });
      if (page) {
        console.log('User has a page, redirecting to /account');
        return redirect('/account');
      }

      console.log('User does not have a page, rendering UsernameForm');
      const desiredUsername = searchParams.desiredUsername || "";
      return <UsernameForm desiredUsername={desiredUsername} />;
    }

    console.log('User is not logged in, rendering login buttons');
    return (
      <div>
        <div className="p-4 max-w-xs mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Sign In</h1>
          <p className="text-center mb-6 text-gray-500">
            Sign in to your account using one of the methods below
          </p>
          <LoginWithKakao />
          <div className="mt-4">
            <LoginWithGoogle />
          </div>
          <div className="mt-4">
            <LoginWithFacebook />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in LoginPage:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
