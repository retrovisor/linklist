'use server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Page } from "@/models/Page";
import { User } from "@/models/User";  // Assuming User model is used in other functions
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

// Helper function to ensure the database connection
async function connectToDatabase() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function savePageButtons(formData) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (session) {
    const buttonsValues = {};
    // Ensure formData is iterable and correctly processed
    if (formData && typeof formData.forEach === 'function') {
      formData.forEach((value, key) => {
        buttonsValues[key] = value;
      });
    } else {
      console.error('Form data is not iterable:', formData);
      throw new Error('Invalid form data');
    }

    const dataToUpdate = { buttons: buttonsValues };
    await Page.updateOne(
      { owner: session?.user?.email },
      dataToUpdate,
    );

    return { success: true };
  }

  return { success: false, message: 'Unauthorized' };
}

// Assuming savePageSettings and savePageLinks are also needed
export async function savePageSettings(formData) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (session) {
    const dataKeys = [
      'displayName', 'location',
      'bio', 'bgType', 'bgColor', 'bgImage',
    ];

    const dataToUpdate = {};
    for (const key of dataKeys) {
      if (formData.has(key)) {
        dataToUpdate[key] = formData.get(key);
      }
    }

    await Page.updateOne(
      { owner: session?.user?.email },
      dataToUpdate,
    );

    if (formData.has('avatar')) {
      const avatarLink = formData.get('avatar');
      await User.updateOne(
        { email: session.user?.email },
        { image: avatarLink },
      );
    }

    return { success: true };
  }

  return { success: false, message: 'Unauthorized' };
}

export async function savePageLinks(links) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (session) {
    await Page.updateOne(
      { owner: session?.user?.email },
      { links },
    );
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}
