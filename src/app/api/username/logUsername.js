// src/app/api/username/logUsername.js
import connectToDatabase from "@/libs/mongoClient";

export async function POST(request) {
  try {
    const { username } = await request.json();
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

export async function GET(request) {
  return new Response('Method Not Allowed', { status: 405 });
}

export async function PUT(request) {
  return new Response('Method Not Allowed', { status: 405 });
}

export async function DELETE(request) {
  return new Response('Method Not Allowed', { status: 405 });
}

export async function PATCH(request) {
  return new Response('Method Not Allowed', { status: 405 });
}
