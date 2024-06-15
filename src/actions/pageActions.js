'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import clientPromise from "@/libs/mongoClient";

// Helper function to ensure the database connection
async function connectToDatabase() {
  const client = await clientPromise;
  return client.db();
}

const serviceUrlMap = {
  email: '{{value}}',
  instagram: 'https://instagram.com/{{value}}',
  kakao: 'https://pf.kakao.com/{{value}}',
  naver: '{{value}}',
  tiktok: 'https://www.tiktok.com/@{{value}}',
  facebook: '{{value}}',
  discord: '{{value}}',
  youtube: '{{value}}',
  telegram: 'https://t.me/{{value}}',
  wechat: '{{value}}',
  line: '{{value}}',
  pinterest: 'https://www.pinterest.com/{{value}}',
  twitch: 'https://www.twitch.tv/{{value}}',
  soundcloud: 'https://soundcloud.com/{{value}}',
  twitter: 'https://twitter.com/{{value}}',
};

export async function savePageButtons(formData) {
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (session) {
    const buttonsValues = {};

    if (formData && typeof formData.forEach === 'function') {
      formData.forEach((value, key) => {
        if (value) {
          const urlTemplate = serviceUrlMap[key];
          if (urlTemplate) {
            buttonsValues[key] = urlTemplate.replace('{{value}}', value);
          } else {
            buttonsValues[key] = value;
          }
        }
      });
    } else {
      console.error('Form data is not iterable:', formData);
      throw new Error('Invalid form data');
    }

    const dataToUpdate = { buttons: buttonsValues };

    await db.collection("pages").updateOne(
      { owner: session?.user?.email },
      { $set: dataToUpdate },
    );

    return { success: true };
  }

  return { success: false, message: 'Unauthorized' };
}

export async function savePageImageLink(imageLink) {
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (session) {
    const existingImageLink = await db.collection("pages").findOne({
      owner: session?.user?.email,
      "imageLinks.key": imageLink.key
    });

    if (existingImageLink) {
      // Update existing image link
      await db.collection("pages").updateOne(
        { owner: session?.user?.email, "imageLinks.key": imageLink.key },
        { $set: { "imageLinks.$": imageLink } },
      );
    } else {
      // Add new image link
      await db.collection("pages").updateOne(
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
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (session) {
    await db.collection("pages").updateOne(
      { owner: session?.user?.email },
      { $pull: { imageLinks: { key: imageLinkKey } } },
    );

    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function deletePageLink(linkKey) {
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    await db.collection("pages").updateOne(
      { owner: session?.user?.email },
      { $pull: { links: { key: linkKey } } },
    );
    
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function savePageSettings(formData) {
  const db = await connectToDatabase();
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

    await db.collection("pages").updateOne(
      { owner: session?.user?.email },
      { $set: dataToUpdate },
    );

    if (formData.has('avatar')) {
      const avatarLink = formData.get('avatar');
      dataToUpdate.avatar = avatarLink;
      await db.collection("users").updateOne(
        { email: session.user?.email },
        { $set: { image: avatarLink } },
      );
    }

    await db.collection("pages").updateOne(
      { owner: session?.user?.email },
      { $set: dataToUpdate },
    );

    return { success: true };
  }

  return { success: false, message: 'Unauthorized' };
}

export async function savePageYouTubeVideo(video) {
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    const existingVideo = await db.collection("pages").findOne({
      owner: session?.user?.email,
      "youTubeVideos.key": video.key
    });
    
    if (existingVideo) {
      // Update existing video
      await db.collection("pages").updateOne(
        { owner: session?.user?.email, "youTubeVideos.key": video.key },
        { $set: { "youTubeVideos.$": video } },
      );
    } else {
      // Add new video
      await db.collection("pages").updateOne(
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
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    await db.collection("pages").updateOne(
      { owner: session?.user?.email },
      { $pull: { youTubeVideos: { key: videoKey } } },
    );
    
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function savePageLink(link) {
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    const existingLink = await db.collection("pages").findOne({
      owner: session?.user?.email,
      "links.key": link.key
    });
    
    if (existingLink) {
      // Update existing link
      await db.collection("pages").updateOne(
        { owner: session?.user?.email, "links.key": link.key },
        { $set: { "links.$": link } },
      );
    } else {
      // Add new link
      await db.collection("pages").updateOne(
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
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (session) {
    await db.collection("pages").updateOne(
      { owner: session?.user?.email },
      { $set: { textBoxes } },
    );

    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function savePageTextBox(textBox) {
  const db = await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (session) {
    const existingTextBox = await db.collection("pages").findOne({
      owner: session?.user?.email,
      "textBoxes.key": textBox.key
    });
    
    if (existingTextBox) {
      // Update existing text box
      await db.collection("pages").updateOne(
        { owner: session?.user?.email, "textBoxes.key": textBox.key },
        { $set: { "textBoxes.$": textBox } },
      );
    } else {
      // Add new text box
      await db.collection("pages").updateOne(
        { owner: session?.user?.email },
        { $push: { textBoxes: textBox } },
      );
    }
    
    return { success: true };
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}
