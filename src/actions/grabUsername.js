'use server';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Page} from "@/models/Page";
import {getServerSession} from "next-auth";
import clientPromise from "@/libs/mongoClient";

export default async function grabUsername(formData) {
  const username = formData.get('username');
  
  try {
    const client = await clientPromise;
    const db = client.db();

    const existingPageDoc = await db.collection("pages").findOne({ uri: username });
    if (existingPageDoc) {
      return false;
    } else {
      const session = await getServerSession(authOptions);
      return await db.collection("pages").insertOne({
        uri: username,
        owner: session?.user?.email,
      });
    }
  } catch (error) {
    console.error('Error in grabUsername:', error);
    throw error;
  }
}
