import { createCanvas, loadImage } from 'canvas';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function generateOgImage(backgroundImageUrl, avatarImageUrl) {
  try {
    const [background, avatar] = await Promise.all([
      loadImage(backgroundImageUrl),
      loadImage(avatarImageUrl),
    ]);

    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0, 1200, 630);

    const avatarSize = 200;
    const avatarX = (1200 - avatarSize) / 2;
    const avatarY = (630 - avatarSize) / 2;
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

    const filename = `og-image-${Date.now()}.png`;
    const imagePath = path.join(process.cwd(), 'public', 'og-images', filename);

    await writeFile(imagePath, canvas.toBuffer());

    return `/og-images/${filename}`;
  } catch (error) {
    console.error('Error generating OG image:', error);
    return null;
  }
}
