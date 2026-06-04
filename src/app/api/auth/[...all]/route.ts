// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// This single route handles ALL auth endpoints:
// GET/POST /api/auth/sign-in/google
// GET/POST /api/auth/callback/google
// GET/POST /api/auth/sign-out
// GET/POST /api/auth/get-session
// ...and everything else Better Auth needs internally
export const { GET, POST } = toNextJsHandler(auth);