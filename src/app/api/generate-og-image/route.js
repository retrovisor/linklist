import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from 'jimp';
import uniqid from 'uniqid';
import { Page } from '@/models/Page'; // Adjust the import path as necessary
import mongoose from 'mongoose';

// Connect to MongoDB with increased timeout
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
});

export async function POST(request) {
    const { backgroundImageUrl, avatarImageUrl, pageUri } = await request.json();
    try {
        const timeoutId = setTimeout(() => {
            throw new Error('Image generation timed out');
        }, 60000); // Increase timeout to 60 seconds

        // Load images
        const [background, avatar] = await Promise.all([
            Jimp.read(backgroundImageUrl),
            Jimp.read(avatarImageUrl)
        ]);

        console.log('Images loaded successfully');

        // Set final dimensions based on the example image
        const finalWidth = 1000;  // Set the final width
        const finalHeight = 524;  // Set the final height

        // Resize avatar keeping aspect ratio
        const avatarSize = 200;
        avatar.resize(avatarSize, Jimp.AUTO);

        // Stretch background to match the width and height of the example image
        background.resize(finalWidth, finalHeight);

        // Reduce opacity of the background image
        background.opacity(0.7);

        // Create a circular mask
        const mask = new Jimp(avatarSize, avatarSize, 0x00000000); // Create a black (transparent) image
        mask.scan(0, 0, mask.bitmap.width, mask.bitmap.height, (x, y, idx) => {
            const radius = avatarSize / 2;
            const centerX = avatarSize / 2;
            const centerY = avatarSize / 2;
            const dx = x - centerX;
            const dy = y - centerY;
            if (dx * dx + dy * dy <= radius * radius) {
                mask.bitmap.data[idx + 3] = 255; // Set alpha channel to 255 (opaque)
            }
        });

        // Apply the circular mask to the avatar
        avatar.mask(mask, 0, 0);

        console.log('Mask applied successfully');

        // Calculate the position: one-third horizontally and vertically centered
        const x = (finalWidth / 3) - (avatarSize / 2);
        const y = (finalHeight - avatarSize) / 2;
        
        // Composite the avatar on top of the background
        background.composite(avatar, x, y, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 1,
            opacityDest: 1
        });

        console.log('Avatar composited successfully');

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
