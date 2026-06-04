// src/proxy.ts  ← Next.js 16: middleware.ts is now proxy.ts
//
// Strategy: cookie-only check here for fast redirects.
// Real session validation happens in each page/server action.
// Never trust this check alone for sensitive operations.

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = getSessionCookie(request);

  // Redirect logged-in users away from auth pages
  if (sessionCookie && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Protect all app routes (anything not in PUBLIC_ROUTES)
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith("/api/auth")
  );

  if (!sessionCookie && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
