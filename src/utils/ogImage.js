import Jimp from 'jimp';
import path from 'path';
import fs from 'browserify-fs';

export async function generateOgImage(backgroundImageUrl, avatarImageUrl) {
  console.log('generateOgImage called');
  console.log('Background image URL:', backgroundImageUrl);
  console.log('Avatar image URL:', avatarImageUrl);

  try {
    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Load the background image using an <img> tag
    const backgroundImg = new Image();
    backgroundImg.crossOrigin = 'anonymous';
    backgroundImg.src = backgroundImageUrl;
    backgroundImg.origin = 'https://fizz.link'; // Set the origin property
    await new Promise((resolve) => {
      backgroundImg.onload = resolve;
    });

    // Set the canvas dimensions to match the background image
    canvas.width = backgroundImg.width;
    canvas.height = backgroundImg.height;

    // Draw the background image on the canvas
    ctx.drawImage(backgroundImg, 0, 0);

    // Load the avatar image using an <img> tag
    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    avatarImg.src = avatarImageUrl;
    avatarImg.origin = 'https://fizz.link'; // Set the origin property
    await new Promise((resolve) => {
      avatarImg.onload = resolve;
    });

    // Calculate the avatar position and size
    const avatarSize = 200;
    const avatarX = (canvas.width - avatarSize) / 2;
    const avatarY = (canvas.height - avatarSize) / 2;

    // Draw the avatar image on the canvas
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);

    // Convert the canvas to a data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Save the generated image to a file using Jimp
    const outputFilename = `og-image-${Date.now()}.png`;
    const outputImagePath = path.join(process.cwd(), 'public', 'og-images', outputFilename);
    const jimpImage = await Jimp.read(Buffer.from(dataUrl.split(',')[1], 'base64'));
    await jimpImage.writeAsync(outputImagePath);

    return `/og-images/${outputFilename}`;
  } catch (error) {
    console.error('Error generating OG image:', error);
    return null;
  }
}
