// src/app/api/username/logUsername.js
import connectToDatabase from "@/libs/mongoClient";

export async function POST(req, res) {
  try {
    const { username } = await req.json();
    const db = await connectToDatabase();
    await db.collection('usernames').insertOne({ username, timestamp: new Date() });
    return new Response(JSON.stringify({ message: 'Username logged successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error logging username:', error);
    return new Response(JSON.stringify({ message: 'Error logging username', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
