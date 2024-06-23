'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { performDatabaseOperation } from "@/libs/mongoClient";

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

    return performDatabaseOperation(async (db) => {
      await db.collection("pages").updateOne(
        { owner: session?.user?.id },
        { $set: dataToUpdate },
      );
      return { success: true };
    });
  }

  return { success: false, message: 'Unauthorized' };
}

export async function savePageImageLink(imageLink) {
  const session = await getServerSession(authOptions);

  if (session) {
    return performDatabaseOperation(async (db) => {
      const existingImageLink = await db.collection("pages").findOne({
        owner: session?.user?.id,
        "imageLinks.key": imageLink.key
      });

      if (existingImageLink) {
        await db.collection("pages").updateOne(
          { owner: session?.user?.id, "imageLinks.key": imageLink.key },
          { $set: { "imageLinks.$": imageLink } },
        );
      } else {
        await db.collection("pages").updateOne(
          { owner: session?.user?.id },
          { $push: { imageLinks: imageLink } },
        );
      }

      return { success: true };
    });
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function deletePageImageLink(imageLinkKey) {
  const session = await getServerSession(authOptions);

  if (session) {
    return performDatabaseOperation(async (db) => {
      await db.collection("pages").updateOne(
        { owner: session?.user?.id },
        { $pull: { imageLinks: { key: imageLinkKey } } },
      );
      return { success: true };
    });
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function deletePageLink(linkKey) {
  const session = await getServerSession(authOptions);
  
  if (session) {
    return performDatabaseOperation(async (db) => {
      await db.collection("pages").updateOne(
        { owner: session?.user?.id },
        { $pull: { links: { key: linkKey } } },
      );
      return { success: true };
    });
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function savePageSettings(formData) {
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

    return performDatabaseOperation(async (db) => {
      await db.collection("pages").updateOne(
        { owner: session?.user?.id },
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
        { owner: session?.user?.id },
        { $set: dataToUpdate },
      );

      return { success: true };
    });
  }

  return { success: false, message: 'Unauthorized' };
}

export async function savePageYouTubeVideo(video) {
  const session = await getServerSession(authOptions);
  
  if (session) {
    return performDatabaseOperation(async (db) => {
      const existingVideo = await db.collection("pages").findOne({
        owner: session?.user?.id,
        "youTubeVideos.key": video.key
      });
      
      if (existingVideo) {
        await db.collection("pages").updateOne(
          { owner: session?.user?.id, "youTubeVideos.key": video.key },
          { $set: { "youTubeVideos.$": video } },
        );
      } else {
        await db.collection("pages").updateOne(
          { owner: session?.user?.id },
          { $push: { youTubeVideos: video } },
        );
      }
      
      return { success: true };
    });
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function deletePageYouTubeVideo(videoKey) {
  const session = await getServerSession(authOptions);
  
  if (session) {
    return performDatabaseOperation(async (db) => {
      await db.collection("pages").updateOne(
        { owner: session?.user?.id },
        { $pull: { youTubeVideos: { key: videoKey } } },
      );
      return { success: true };
    });
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function savePageLink(link) {
  const session = await getServerSession(authOptions);
  
  if (session) {
    return performDatabaseOperation(async (db) => {
      const existingLink = await db.collection("pages").findOne({
        owner: session?.user?.id,
        "links.key": link.key
      });
      
      if (existingLink) {
        await db.collection("pages").updateOne(
          { owner: session?.user?.id, "links.key": link.key },
          { $set: { "links.$": link } },
        );
      } else {
        await db.collection("pages").updateOne(
          { owner: session?.user?.id },
          { $push: { links: link } },
        );
      }
      
      return { success: true };
    });
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function saveTextBoxes(textBoxes) {
  const session = await getServerSession(authOptions);

  if (session) {
    return performDatabaseOperation(async (db) => {
      await db.collection("pages").updateOne(
        { owner: session?.user?.id },
        { $set: { textBoxes } },
      );
      return { success: true };
    });
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}

export async function savePageTextBox(textBox) {
  const session = await getServerSession(authOptions);
  
  if (session) {
    return performDatabaseOperation(async (db) => {
      const existingTextBox = await db.collection("pages").findOne({
        owner: session?.user?.id,
        "textBoxes.key": textBox.key
      });
      
      if (existingTextBox) {
        await db.collection("pages").updateOne(
          { owner: session?.user?.id, "textBoxes.key": textBox.key },
          { $set: { "textBoxes.$": textBox } },
        );
      } else {
        await db.collection("pages").updateOne(
          { owner: session?.user?.id },
          { $push: { textBoxes: textBox } },
        );
      }
      
      return { success: true };
    });
  } else {
    return { success: false, message: 'Unauthorized' };
  }
}
