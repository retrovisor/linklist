import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const { lang } = params;
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file') || 'about'; // Default to 'about' if no file is specified
  console.log(`API route called for lang: ${lang} and file: ${file}`);

  try {
    // Construct the file path
    const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${file}.json`);
    console.log('Reading file from:', filePath);

    // Read the file contents
    const fileContents = await fs.readFile(filePath, 'utf-8');
    console.log('Raw file contents:', fileContents);

    // Clean up potential issues with file content
    const cleanFileContents = fileContents.replace(/^\s*\/\/.*$/gm, '').trim();
    console.log('Clean file contents:', cleanFileContents);

    // Parse the JSON contents
    const translations = JSON.parse(cleanFileContents);
    console.log('Translations in API route:', translations);

    return new Response(JSON.stringify(translations), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching translations in API route:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch translations' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
