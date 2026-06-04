// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from "@/lib/prisma";
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  // Required: tells Better Auth your base URL so Google OAuth
  // callback URLs are constructed correctly (avoids redirect_uri_mismatch)
  baseURL: process.env.BETTER_AUTH_URL!,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    nextCookies()
  ]
});

// Export type helpers used in the rest of the app
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;