import { Event } from '@/models/Event';
import { performDatabaseOperation } from "@/libs/mongoClient";

export async function POST(req) {
  const url = new URL(req.url);
  const clickedLink = atob(url.searchParams.get('url'));
  const page = url.searchParams.get('page');

  try {
    await performDatabaseOperation(async (db) => {
      await db.collection('events').insertOne({ type: 'click', uri: clickedLink, page });
    });
    return Response.json(true);
  } catch (error) {
    console.error('Error recording click event:', error);
    return Response.json({ error: 'Failed to record click event' }, { status: 500 });
  }
}
