import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // The `signIn` callback should return true or false
    async signIn({ account, profile, }) {
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

        // const data = await response.json()
        // Return true to allow sign-in and proceed with the session
        return true;
      } catch (error) {
        console.error("Sign-in callback error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the dashboard or another page after successful login
      return baseUrl + '/dashboard'; // Adjust to your desired route
    }
  },
});

export { handler as GET, handler as POST };
