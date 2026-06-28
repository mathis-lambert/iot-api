import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KeycloakProvider from "next-auth/providers/keycloak";
import { env } from "@/lib/env";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Admin",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toLowerCase().trim();
      const password = credentials?.password ?? "";
      if (email !== env.ADMIN_EMAIL.toLowerCase()) return null;
      const valid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
      if (!valid) return null;
      return {
        id: "admin",
        email: env.ADMIN_EMAIL,
        name: "Maison",
      };
    },
  }),
];

if (env.KEYCLOAK_CLIENT_ID && env.KEYCLOAK_CLIENT_SECRET && env.KEYCLOAK_ISSUER) {
  providers.push(
    KeycloakProvider({
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      issuer: env.KEYCLOAK_ISSUER,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : "admin";
      }
      return session;
    },
  },
};
