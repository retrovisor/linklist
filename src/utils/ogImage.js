import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function generateOgImage(backgroundImageUrl, avatarImageUrl) {
  try {
    const backgroundImage = sharp(backgroundImageUrl);
    const avatarImage = sharp(avatarImageUrl);

    const backgroundMetadata = await backgroundImage.metadata();
    const avatarMetadata = await avatarImage.metadata();

    const outputFilename = `og-image-${Date.now()}.png`;
    const outputImagePath = path.join(process.cwd(), 'public', 'og-images', outputFilename);

    const avatarSize = 200;
    const avatarX = (backgroundMetadata.width - avatarSize) / 2;
    const avatarY = (backgroundMetadata.height - avatarSize) / 2;

    const generatedImage = await backgroundImage
      .composite([
        {
          input: await avatarImage.resize(avatarSize, avatarSize).toBuffer(),
          top: avatarY,
          left: avatarX,
        },
      ])
      .toFile(outputImagePath);

    return `/og-images/${outputFilename}`;
  } catch (error) {
    console.error('Error generating OG image:', error);
    return null;
  }
}
