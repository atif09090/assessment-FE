import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: '211094885179-0i8pstte40h1ch1sktr2dk93e71fvcp1.apps.googleusercontent.com',
      clientSecret: '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',
    }),
  ],
  callbacks: {
    // The `signIn` callback should return true or false
    async signIn({ account, profile, }) {
      // console.log(account, profile);
      try {
        const response = await fetch(
          `http://localhost:8080/api/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account?.id_token }),
          }
        );

        if (!response.ok) {
          console.error("Failed to authenticate with the backend.");
          return false;
        }
        const data = await response.json();
        // console.log(data);
        const cookieStore = await cookies();
        
        const { accessToken, refreshToken } = data;
        if(accessToken&& refreshToken && account){
          cookieStore.set("access_token", accessToken as string)
          cookieStore.set("refresh_token", refreshToken as string)
          account.access_token = accessToken ;
          account.refresh_token = refreshToken;
          return true;
        }

        // Return true to allow sign-in and proceed with the session
        return false;
      } catch (error) {
        console.error("Sign-in callback error:", error);
        return false;
      }
    },
    async jwt({token,account, profile}) {
      console.log(account?.access_token);
        return {token: account?.access_token};
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the dashboard or another page after successful login
      return baseUrl + '/dashboard'; // Adjust to your desired route
    }
  },

  events:{
    async  signIn({user,account}) {
      
    }
  },
});

export { handler as GET, handler as POST };
