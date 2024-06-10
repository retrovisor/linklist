import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from 'jimp';
import uniqid from 'uniqid';
import fetch from 'node-fetch';
import Page from '@/models/Page'; // Adjust the import path as necessary

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { backgroundImageUrl, avatarImageUrl, pageId } = req.body;

    try {
        const [background, avatar] = await Promise.all([
            Jimp.read(backgroundImageUrl),
            Jimp.read(avatarImageUrl)
        ]);

        const avatarSize = 200;
        avatar.resize(avatarSize, Jimp.AUTO); // Resize avatar keeping aspect ratio

        const x = (background.bitmap.width - avatarSize) / 2;
        const y = (background.bitmap.height - avatarSize) / 2;

        background.composite(avatar, x, y, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 1,
            opacityDest: 1
        });

        const ogImageBuffer = await background.getBufferAsync(Jimp.MIME_PNG);

        // Upload to R2
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

        // Update MongoDB
        await Page.findOneAndUpdate({ _id: pageId }, { ogImageUrl: link });

        res.status(200).json({ success: true, link });
    } catch (error) {
        console.error('Failed to generate OG image:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
