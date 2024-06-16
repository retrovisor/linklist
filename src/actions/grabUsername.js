'use server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import clientPromise from "@/libs/mongoClient";
import { ObjectId } from 'mongodb';

export default async function grabUsername(formData) {
  const username = formData.get('username');
  console.log('Desired username:', username); // Log the desired username

  try {
    const client = await clientPromise;
    const db = client.db();

    // Check if a page with the same uri already exists
    const existingPageDoc = await db.collection("pages").findOne({ uri: username });
    if (existingPageDoc) {
      console.log('Username already taken:', username); // Log if the username is already taken
      return false;
    } else {
      // Get the session to retrieve user information
      const session = await getServerSession(authOptions);
      if (!session || !session.user || !session.user.id) {
        throw new Error('User session not found');
      }

      // Insert new page document with the user's ObjectId as a string
      const result = await db.collection("pages").insertOne({
        uri: username,
        owner: session.user.id, // Store the user's _id as a string
        displayName: '',
        location: '',
        bio: '',
        bgType: 'color',
        bgColor: '#6fdcc6',
        bgImage: '',
        buttons: {},
        links: [],
        template: '',
        avatar: '',
        ogImageUrl: 'https://momofriends.com/naelink/alxbu6ej0.png',
        textBoxes: [],
        imageLinks: [],
        youTubeVideos: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Username grabbed successfully:', username); // Log successful username grab
      return result.insertedId;
    }
  } catch (error) {
    console.error('Error in grabUsername:', error);
    throw error;
  }
}
