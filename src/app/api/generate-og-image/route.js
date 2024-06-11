import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from 'jimp';
import uniqid from 'uniqid';
import { Page } from '@/models/Page';
import mongoose from 'mongoose';
import path from 'path';

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

    // Load the Roboto-MediumItalic font
    const fontPath = path.resolve(process.cwd(), 'public', 'Roboto-MediumItalic.ttf');
    const font = await Jimp.loadFont(fontPath);

    // Set final dimensions based on the example image
    const finalWidth = 1000; // Set the final width
    const finalHeight = 524; // Set the final height

    // Stretch background to match the width and height of the example image
    background.resize(finalWidth, finalHeight);

    // Reduce opacity of the background image
    background.opacity(0.7);

    const avatarSize = 170;
    avatar.cover(avatarSize, avatarSize); // Resize avatar to cover the square dimensions

    // Create a circular avatar image using the @jimp/plugin-circle plugin
    avatar.circle();

    const x = (finalWidth - avatarSize) / 2;
    const topMargin = 80; // Adjust this value to control the distance from the top
    const y = topMargin;

    background.composite(avatar, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1
    });

    const text = "Fizz.link";
    const fontSize = 40; // Set the font size
    const textWidth = Jimp.measureText(font, text);
    const textX = (finalWidth - textWidth) / 2;
    const textY = y - 60; // Adjust this value to control the distance between the text and avatar

    const textColor = '#FFFFFF'; // Set the text color to white
    const shadowColor = '#000000'; // Set the shadow color to black
    const shadowOffset = 2; // Set the shadow offset

    // Print the text with shadow on the background image
    background.print(
      font,
      textX + shadowOffset,
      textY + shadowOffset,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      shadowColor
    );
    background.print(
      font,
      textX,
      textY,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      textColor
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
