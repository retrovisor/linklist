'use server';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Page} from "@/models/Page";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import clientPromise from "@/libs/mongoClient";


export default async function grabUsername(formData) {
  const username = formData.get('username');
  const client = await clientPromise; const db = client.db();
  const existingPageDoc = await Page.findOne({uri:username});
  if (existingPageDoc) {
    return false;
  } else {
    const session = await getServerSession(authOptions);
    return await Page.create({
      uri:username,
      owner:session?.user?.email,
    });
  }
}
