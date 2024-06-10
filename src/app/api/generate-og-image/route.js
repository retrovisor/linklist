// Import necessary modules
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from 'sharp';
import uniqid from 'uniqid';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// MongoDB setup (assuming Mongoose)
import mongoose from 'mongoose';
import Page from './models/Page'; // Import your Page model

mongoose.connect('mongodb_connection_string');

// Endpoint to generate and upload OG image
app.post('/generate-og-image', async (req, res) => {
    const { backgroundImageUrl, avatarImageUrl, pageId } = req.body;

    try {
        // Fetch and combine images using Sharp
        const [backgroundBuffer, avatarBuffer] = await Promise.all([
            fetch(backgroundImageUrl).then(res => res.buffer()),
            fetch(avatarImageUrl).then(res => res.buffer())
        ]);

        const avatarSize = 200;
        const background = sharp(backgroundBuffer);
        const { width, height } = await background.metadata();

        const ogImage = await background
            .composite([{
                input: avatarBuffer,
                top: (height - avatarSize) / 2,
                left: (width - avatarSize) / 2,
                resize: { width: avatarSize, height: avatarSize }
            }])
            .png()
            .toBuffer();

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
            Body: ogImage,
            ContentType: 'image/png'
        }));

        const customDomain = 'momofriends.com/naelink';
        const link = `https://${customDomain}/${newFilename}`;

        // Update MongoDB
        await Page.findOneAndUpdate({ _id: pageId }, { ogImageUrl: link });

        res.json({ success: true, link });
    } catch (error) {
        console.error('Error processing images', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
