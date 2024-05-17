import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Page } from '@/models/Page';
import mongoose from 'mongoose';

export async function POST(request) {
  await mongoose.connect(process.env.MONGO_URI);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect('/api/auth/signin');
  }

  const { template } = await request.json();

  try {
    const page = await Page.findOneAndUpdate(
      { owner: session.user.email },
      { $set: { template } },
      { new: true }
    );

    if (!page) {
      return NextResponse.json({ success: false, message: 'Page not found' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}