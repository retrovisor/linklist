import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";
import { performDatabaseOperation } from "@/libs/mongoClient";

export async function POST(req) {
  const formData = await req.formData();
  if (formData.has('file')) {
    const file = formData.get('file');
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    const randomId = uniqid();
    const ext = file.name.split('.').pop();
    const newFilename = `${randomId}.${ext}`;
    const bucketName = process.env.R2_BUCKET_NAME;
    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        ACL: 'public-read',
        Body: Buffer.concat(chunks),
        ContentType: file.type,
      }));
      const customDomain = 'momofriends.com/naelink';
      const link = `https://${customDomain}/${newFilename}`;
      
      // If you need to store the upload information in the database
      await performDatabaseOperation(async (db) => {
        await db.collection('uploads').insertOne({
          filename: newFilename,
          url: link,
          uploadedAt: new Date()
        });
      });
      
      return Response.json(link);
    } catch (error) {
      console.error('Error uploading file:', error);
      return Response.json({ error: 'Failed to upload file' }, { status: 500 });
    }
  }
  return Response.json({ error: 'No file provided' }, { status: 400 });
}
