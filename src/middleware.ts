import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard']; // Routes requiring authentication
const publicRoutes = ['/']; // Routes accessible without authentication

export default function middleware(req: NextRequest) {
  const token =
    req.cookies.get('accessToken') || req.cookies.get('next-auth.csrf-token');
  const currentPath = req.nextUrl.pathname;


  if (publicRoutes.includes(currentPath)) {
    return NextResponse.next();
  }

  if (protectedRoutes.includes(currentPath) && !token) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ['/dashboard/:path*', '/login/:path*'], 
};
