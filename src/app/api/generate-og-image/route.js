import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from 'jimp';
import uniqid from 'uniqid';
import { Page } from '@/models/Page';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
});

export async function POST(request) {
  const { backgroundImageUrl, avatarImageUrl, pageUri } = await request.json();
  try {
    const timeoutId = setTimeout(() => {
      throw new Error('Image generation timed out');
    }, 60000);

    const [background, avatar] = await Promise.all([
      Jimp.read(backgroundImageUrl),
      Jimp.read(avatarImageUrl)
    ]);

    const avatarSize = 200;
    avatar.cover(avatarSize, avatarSize); // Resize avatar to cover the square dimensions

    // Create a new circular avatar image
    const circularAvatar = new Jimp(avatarSize, avatarSize);
    circularAvatar.circle({ radius: avatarSize / 2, x: avatarSize / 2, y: avatarSize / 2 });
    circularAvatar.composite(avatar, 0, 0);

    const x = (background.bitmap.width - avatarSize) / 2;
    const y = (background.bitmap.height - avatarSize) / 2;

    background.composite(circularAvatar, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1
    });

    const ogImageBuffer = await background.getBufferAsync(Jimp.MIME_PNG);

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const randomId = uniqid();
    const newFilename = `${randomId}.png`;
    const bucketName = process.env.R2_BUCKET_NAME;

    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      ACL: 'public-read',
      Body: ogImageBuffer,
      ContentType: 'image/png'
    }));

    const customDomain = 'momofriends.com/naelink';
    const link = `https://${customDomain}/${newFilename}`;

    await Page.findOneAndUpdate({ uri: pageUri }, { ogImageUrl: link });

    clearTimeout(timeoutId);
    return new Response(JSON.stringify({ success: true, link }), { status: 200 });
  } catch (error) {
    console.error('Failed to generate OG image:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}
