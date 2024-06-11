import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from 'jimp';
import uniqid from 'uniqid';
import { Page } from '@/models/Page'; // Adjust the import path as necessary

export async function POST(request) {
    const { backgroundImageUrl, avatarImageUrl, pageUri } = await request.json();
    let timeoutId;
    try {
        timeoutId = setTimeout(() => {
            throw new Error('Image generation timed out');
        }, 30000);  // Timeout after 30 seconds

        const [background, avatar] = await Promise.all([
            Jimp.read(backgroundImageUrl),
            Jimp.read(avatarImageUrl)
        ]);
        
        avatar.resize(200, Jimp.AUTO); // Resize avatar keeping aspect ratio
        const x = (background.bitmap.width - avatar.bitmap.width) / 2;
        const y = (background.bitmap.height - avatar.bitmap.height) / 2;

        background.composite(avatar, x, y, {
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

        await Page.findOneAndUpdate({ uri: pageUri }, { ogImageUrl: link }, { new: true });

        clearTimeout(timeoutId);  // Clear the timeout on successful completion
        return new Response(JSON.stringify({ success: true, link }), { status: 200 });
    } catch (error) {
        clearTimeout(timeoutId);  // Ensure timeout is cleared on error
        console.error('Failed to generate OG image:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
    }
}
