import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_ENDPOINTS } from "@/lib/config";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60, 
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const res = await fetch(API_ENDPOINTS.login, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Authentication failed");
          }

          if (!data.token) {
            throw new Error("No token received from server");
          }

          // Return the user object with token
          return {
            id: data.user.id || "1",
            email: data.user.email,
            name: data.user.name,
            token: data.token,
          };
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Decode the token to get its expiration
        try {
          token.accessToken = user.token;
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          const expiresIn = 1 * 24 * 60 * 60; // 3 days
          token.exp = Math.floor(Date.now() / 1000) + expiresIn;
        } catch (error) {
          console.error("Error decoding token:", error);
          // Fallback expiration if decoding fails
          const expiresIn = 1 * 24 * 60 * 60; // 3 days
          token.exp = Math.floor(Date.now() / 1000) + expiresIn;
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
      }

      // More detailed logging
      console.log(
        "Token Expiration:",
        token.exp ? new Date(token.exp * 1000) : "No expiration"
      );
      console.log("Current Time:", new Date());

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
