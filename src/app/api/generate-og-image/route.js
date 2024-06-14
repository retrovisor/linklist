import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from 'jimp';
import uniqid from 'uniqid';
import path from 'path';
import clientPromise from "@/libs/mongoClient";

export async function POST(request) {
  const { backgroundImageUrl, avatarImageUrl, pageUri, bgColor } = await request.json();
  console.log('Request received:', { backgroundImageUrl, avatarImageUrl, pageUri, bgColor });

  const timeoutId = setTimeout(() => {
    throw new Error('Image generation timed out');
  }, 60000);

  try {
    let background;
    if (backgroundImageUrl) {
      background = await Jimp.read(backgroundImageUrl);
    } else {
      background = new Jimp(1000, 524, bgColor || '#FFFFFF');
    }

    const [avatar, overlay] = await Promise.all([
      Jimp.read(avatarImageUrl),
      Jimp.read(path.join(process.cwd(), 'public/images/overlay.png')) // Path to your overlay image
    ]);

    const finalWidth = 1000;
    const finalHeight = 524;
    background.resize(finalWidth, finalHeight);
    background.opacity(0.75);

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

    // Composite the fixed transparent overlay image on top
    background.composite(overlay, 0, 0, {
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

    console.log('Image uploaded to S3:', link);

    const client = await clientPromise;
    if (!client) {
      throw new Error('Failed to initialize MongoDB client');
    }

    const db = client.db();
    if (!db) {
      throw new Error('Failed to get MongoDB database');
    }

    const collection = db.collection("pages");
    if (!collection) {
      throw new Error('Failed to get MongoDB collection');
    }

    console.log('Updating page with URI:', pageUri);
    const updateResult = await collection.findOneAndUpdate(
      { uri: pageUri },
      { $set: { ogImageUrl: link } },
      { returnDocument: 'after' }
    );

    if (!updateResult.value) {
      throw new Error('Failed to update the page');
    }

    console.log('Page updated successfully:', updateResult.value);

    clearTimeout(timeoutId);
    return new Response(JSON.stringify({ success: true, link }), { status: 200 });
  } catch (error) {
    console.error('Failed to generate OG image:', error.message);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
}
