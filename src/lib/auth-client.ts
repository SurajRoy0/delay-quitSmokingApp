// src/lib/auth-client.ts
// Import from better-auth/react — gives us useSession hook + reactive state
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Same domain — baseURL is optional, but explicit is safer
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

// Named exports for convenience throughout the app
export const { signIn, signOut, useSession } = authClient;