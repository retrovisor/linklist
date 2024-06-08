import Jimp from 'jimp';
import path from 'path';
import fs from 'browserify-fs';


export async function generateOgImage(backgroundImageUrl, avatarImageUrl) {
  try {
    const backgroundImage = await Jimp.read(backgroundImageUrl);
    const avatarImage = await Jimp.read(avatarImageUrl);

    const outputFilename = `og-image-${Date.now()}.png`;
    const outputImagePath = path.join(process.cwd(), 'public', 'og-images', outputFilename);

    const avatarSize = 200;
    const avatarX = (backgroundImage.bitmap.width - avatarSize) / 2;
    const avatarY = (backgroundImage.bitmap.height - avatarSize) / 2;

    avatarImage.resize(avatarSize, avatarSize);
    backgroundImage.composite(avatarImage, avatarX, avatarY);

    await backgroundImage.writeAsync(outputImagePath);

    return `/og-images/${outputFilename}`;
  } catch (error) {
    console.error('Error generating OG image:', error);
    return null;
  }
}
