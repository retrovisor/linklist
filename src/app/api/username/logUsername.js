// app/api/username/logUsername.js

import { connectToDatabase } from "@/libs/mongoClient";  // Adjust path as necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username } = req.body;
      const { db } = await connectToDatabase();
      await db.collection('usernames').insertOne({ username, timestamp: new Date() });
      res.status(200).json({ message: 'Username logged successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging username', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
