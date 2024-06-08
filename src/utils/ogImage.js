import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { name } = req.query;

  try {
    const decodedName = decodeURIComponent(name);
    const firstName = decodedName.split(' ')[0];

    // Remove accents and non-alphanumeric characters from the first name
    const fileNameFirstName = firstName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '');

    const outputFilename = `og_${fileNameFirstName}.jpg`;
    const baseImagePath = path.join(process.cwd(), 'public', 'base2.jpg');
    const outputImagePath = path.join(process.cwd(), 'public', 'ogimages', outputFilename);

    // Check if the generated image already exists
    if (fs.existsSync(outputImagePath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(fs.readFileSync(outputImagePath));
      return;
    }

    const baseImage = sharp(baseImagePath);
    const metadata = await baseImage.metadata();

    const fontSize = 74;
    const textX = 40;
    const textY = 170;
    const textRotation = -20;

    const svgText = `
      <svg width="${metadata.width}" height="${metadata.height}">
        <text x="${textX}" y="${textY}" font-size="${fontSize}" fill="white" stroke="black" stroke-width="3" transform="rotate(${textRotation} ${textX}, ${textY})">
          ${firstName}
        </text>
      </svg>
    `;

    const generatedImage = await baseImage
      .composite([{ input: Buffer.from(svgText), top: 0, left: 0 }])
      .toFile(outputImagePath);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(generatedImage);
  } catch (error) {
    console.error('Error generating OG image:', error);
    res.status(500).json({ error: 'Failed to generate OG image' });
  }
}
