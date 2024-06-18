'use server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import clientPromise from "@/libs/mongoClient";
import { ObjectId } from 'mongodb';

function koreanToRomanized(text) {
  const initialConsonants = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', 'ng', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
  const medialVowels = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
  const finalConsonants = ['', 'k', 'k', 'ks', 'n', 'nc', 'nh', 't', 'r', 'rk', 'rm', 'rp', 'rs', 'rt', 'rp', 'rh', 'm', 'p', 'ps', 't', 't', 'ng', 't', 'ch', 'k', 't', 'p', 'h'];

  return text.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, function (match) {
    const koreanChar = match.charCodeAt(0);
    let romanized = '';

    if (koreanChar >= 0xAC00 && koreanChar <= 0xD7A3) {
      const syllableIndex = koreanChar - 0xAC00;
      const initialIndex = Math.floor(syllableIndex / 588);
      const medialIndex = Math.floor((syllableIndex % 588) / 28);
      const finalIndex = syllableIndex % 28;

      romanized = initialConsonants[initialIndex] + medialVowels[medialIndex] + finalConsonants[finalIndex];
    } else {
      const singleConsonantMapping = {
        'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt', 'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's',
        'ㅆ': 'ss', 'ㅇ': 'ng', 'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h'
      };
      const singleVowelMapping = {
        'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo', 'ㅔ': 'e', 'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa',
        'ㅙ': 'wae', 'ㅚ': 'oe', 'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo', 'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅢ': 'ui', 'ㅣ': 'i'
      };

      romanized = singleConsonantMapping[match] || singleVowelMapping[match] || '';
    }

    return romanized;
  });
}

export default async function grabUsername(formData) {
  const username = formData.get('username');
  console.log('Desired username:', username); // Log the desired username

  // Transliterate Korean characters to romanized equivalents
  const romanizedUsername = koreanToRomanized(username);

  // Check if the romanized username contains spaces, emojis, or invalid characters
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(romanizedUsername)) {
    console.log('Invalid username:', username); // Log if the username is invalid
    return false;
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Check if a page with the same uri already exists
    const existingPageDoc = await db.collection("pages").findOne({ uri: romanizedUsername });
    if (existingPageDoc) {
      console.log('Username already taken:', username); // Log if the username is already taken
      return false;
    } else {
      // Get the session to retrieve user information
      const session = await getServerSession(authOptions);
      if (!session || !session.user || !session.user.id) {
        throw new Error('User session not found');
      }

      // Insert new page document with the user's ObjectId as a string
      const result = await db.collection("pages").insertOne({
        uri: romanizedUsername,
        owner: session.user.id, // Store the user's _id as a string
        displayName: '',
        location: '',
        bio: '',
        bgType: 'color',
        bgColor: '#6fdcc6',
        bgImage: '',
        buttons: {},
        links: [],
        template: '',
        avatar: '',
        ogImageUrl: 'https://momofriends.com/naelink/alxbu6ej0.png',
        textBoxes: [],
        imageLinks: [],
        youTubeVideos: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Username grabbed successfully:', romanizedUsername); // Log successful username grab
      return result.insertedId;
    }
  } catch (error) {
    console.error('Error in grabUsername:', error);
    throw error;
  }
}

