import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const { lang } = params;
  console.log(`API route called for lang: ${lang}`);
  
  try {
    // Construct the file path
    const filePath = path.join(process.cwd(), 'public', 'locales', lang, 'about.json');
    console.log('Reading file from:', filePath);

    // Read the file contents
    const fileContents = await fs.readFile(filePath, 'utf-8');
    console.log('File contents:', fileContents);

    // Parse the JSON contents
    const translations = JSON.parse(fileContents);
    console.log('Translations in API route:', translations);

    return new Response(JSON.stringify(translations), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching translations in API route:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch translations' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
