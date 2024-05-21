import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

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
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      ACL: 'public-read',
      Body: Buffer.concat(chunks),
      ContentType: file.type,
    }));
    const customDomain = 'momofriends.com/naelink';
    const link = `https://${customDomain}/${newFilename}`;
    return Response.json(link);
  }
}
