import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // @ts-ignore
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.isOnboarded = user.isOnboarded;
      }

      if (trigger === "update" && session) {
        if (session.role) token.role = session.role;
        if (session.isOnboarded !== undefined) token.isOnboarded = session.isOnboarded;
      } else if (token.sub) {
        // Fetch fresh role and isOnboarded from DB to ensure session stays in sync with onboarding/admin changes
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, isOnboarded: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isOnboarded = dbUser.isOnboarded;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.isOnboarded = token.isOnboarded;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
