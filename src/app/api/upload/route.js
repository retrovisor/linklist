import { R2 } from '@cloudflare/r2';
import uniqid from 'uniqid';

export async function POST(req) {
  const formData = await req.formData();

  if (formData.has('file')) {
    const file = formData.get('file');

    const r2 = new R2({
      accountId: process.env.R2_ACCOUNT_ID,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    });

    const randomId = uniqid();
    const ext = file.name.split('.').pop();
    const newFilename = `${randomId}.${ext}`;
    const bucketName = process.env.R2_BUCKET_NAME;

    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }

    await r2.put(newFilename, Buffer.concat(chunks), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const link = `https://${bucketName}.r2.cloudflare.com/${newFilename}`;
    return Response.json(link);
  }
}
