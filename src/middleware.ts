import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // We'll move the authentication logic to the API route handlers
  // because the middleware runs in Edge runtime which doesn't support
  // the Node.js crypto module used by jsonwebtoken
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/media/:path*',
};