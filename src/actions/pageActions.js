'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Page } from "@/models/Page";
import { User } from "@/models/User";
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

async function saveLink(link) {
  const response = await savePageLink(link);
  if (response.success) {
    setLinks(prevLinks => prevLinks.map(l => l.key === link.key ? link : l));
    toast.success('Link saved!');
  } else {
    toast.error('Failed to save link. Please try again.');
  }
}

export async function savePageImageLink(imageLink) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (session) {
    const existingImageLink = await Page.findOne({ owner: session?.user?.email, "imageLinks.key": imageLink.key });

    if (existingImageLink) {
      // Update existing image link
      await Page.updateOne(
        { owner: session?.user?.email, "imageLinks.key": imageLink.key },
        { $set: { "imageLinks.$": imageLink } },
      );
    } else {
      // Add new image link
      await Page.updateOne(
        { owner: session?.user?.email },
        { $push: { imageLinks: imageLink } },
      );
    }

    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function deletePageImageLink(imageLinkKey) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (session) {
    await Page.updateOne(
      { owner: session?.user?.email },
      { $pull: { imageLinks: { key: imageLinkKey } } },
    );

    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function deletePageLink(linkKey) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    await Page.updateOne(
      { owner: session?.user?.email },
      { $pull: { links: { key: linkKey } } },
    );
    
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

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

export async function savePageYouTubeVideo(video) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    const existingVideo = await Page.findOne({ owner: session?.user?.email, "youTubeVideos.key": video.key });
    
    if (existingVideo) {
      // Update existing video
      await Page.updateOne(
        { owner: session?.user?.email, "youTubeVideos.key": video.key },
        { $set: { "youTubeVideos.$": video } },
      );
    } else {
      // Add new video
      await Page.updateOne(
        { owner: session?.user?.email },
        { $push: { youTubeVideos: video } },
      );
    }
    
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function deletePageYouTubeVideo(videoKey) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    await Page.updateOne(
      { owner: session?.user?.email },
      { $pull: { youTubeVideos: { key: videoKey } } },
    );
    
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function savePageLink(link) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    const existingLink = await Page.findOne({ owner: session?.user?.email, "links.key": link.key });
    
    if (existingLink) {
      // Update existing link
      await Page.updateOne(
        { owner: session?.user?.email, "links.key": link.key },
        { $set: { "links.$": link } },
      );
    } else {
      // Add new link
      await Page.updateOne(
        { owner: session?.user?.email },
        { $push: { links: link } },
      );
    }
    
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}
 
 

export async function saveTextBoxes(textBoxes) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (session) {
    await Page.updateOne(
      { owner: session?.user?.email },
      { textBoxes },
    );

    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function savePageTextBox(textBox) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    const existingTextBox = await Page.findOne({ owner: session?.user?.email, "textBoxes.key": textBox.key });
    
    if (existingTextBox) {
      // Update existing text box
      await Page.updateOne(
        { owner: session?.user?.email, "textBoxes.key": textBox.key },
        { $set: { "textBoxes.$": textBox } },
      );
    } else {
      // Add new text box
      await Page.updateOne(
        { owner: session?.user?.email },
        { $push: { textBoxes: textBox } },
      );
    }
    
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}
