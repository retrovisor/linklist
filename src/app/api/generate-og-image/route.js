import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from 'jimp';
import uniqid from 'uniqid';
import { Page } from '@/models/Page';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI, {
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

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

    const finalWidth = 1000;
    const finalHeight = 524;

    background.resize(finalWidth, finalHeight);
    background.opacity(0.7);

    const avatarSize = 170;
    avatar.cover(avatarSize, avatarSize);
    avatar.circle();

    const x = (finalWidth - avatarSize) / 2;
    const topMargin = 80;
    const y = topMargin;

    background.composite(avatar, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1
    });

    const text = "Fizz.link";
    const maxWidth = finalWidth; // Set the max width to the width of the image
    const maxHeight = finalHeight; // Set the max height to the height of the image

    background.print(
      font,
      0, // x position
      y - 60, // y position
      {
        text: text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP,
      },
      maxWidth,
      maxHeight
    );

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
