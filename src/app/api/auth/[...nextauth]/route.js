import clientPromise from "@/libs/mongoClient";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub, // Use the 'sub' field as the providerId for Google
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id, // Use the 'id' field as the providerId for Kakao
          name: profile.kakao_account.profile.nickname,
          email: profile.kakao_account.email,
          image: profile.kakao_account.profile.profile_image_url.replace('http://', 'https://'),
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.SECRET,
    encryption: true,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.providerId = account.provider + ':' + user.id; // Add this line to include the providerId
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.providerId = token.providerId; // Add this line to include the providerId in the session
      
      // Check if the user's image URL exists, otherwise set the default image URL
      if (!session.user.image) {
        session.user.image = 'https://fizz.link/avatar.png';
      }
      
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
