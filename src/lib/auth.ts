import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  // Don't set pages.signIn — let each login page handle its own routing.
  // This prevents NextAuth from always redirecting to /admin/login.
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        // Optional: which portal the user is trying to log into
        portal: { label: "Portal", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user || !user.passwordHash) return null;
        if (user.role !== "admin" && user.role !== "agent") return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        // Portal-based access control:
        // - If portal=admin, only allow admin role
        // - If portal=agent, only allow agent role
        // - If no portal specified, allow any (backwards compat)
        const portal = (credentials as any).portal;
        if (portal === "admin" && user.role !== "admin") return null;
        if (portal === "agent" && user.role !== "agent") return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
          avatarUrl: user.avatarUrl ?? undefined,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.avatarUrl = (user as any).avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).avatarUrl = token.avatarUrl;
      }
      return session;
    },
  },
};

// Type augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}
