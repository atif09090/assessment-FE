import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken') || req.cookies.get('next-auth.csrf-token');
  console.log("call",token)
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ['/protected-page/:path*'], // Protect the "protected-page" route
};