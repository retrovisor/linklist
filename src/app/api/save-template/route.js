import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { performDatabaseOperation } from "@/libs/mongoClient";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect('/api/auth/signin');
  }

  const { template } = await request.json();

  try {
    const result = await performDatabaseOperation(async (db) => {
      const page = await db.collection('pages').findOneAndUpdate(
        { owner: session.user.id },
        { $set: { template } },
        { returnOriginal: false }
      );
      return page;
    });

    if (!result.value) {
      return NextResponse.json({ success: false, message: 'Page not found' });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
