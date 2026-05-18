import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

const COOKIE_NAME = 'haven_auth_token';

// Routes that require authentication
const AUTH_ROUTES = ['/cart', '/checkout', '/account'];

// Routes that require seller role
const SELLER_ROUTES = ['/dashboard'];

// Routes that should redirect authenticated users away
const GUEST_ROUTES = ['/auth/login', '/auth/register'];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let user = null;

  // Try to verify token if present
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload;
    } catch {
      // Token is invalid — clear it
      const response = NextResponse.next();
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // Redirect authenticated users away from login/register
  if (user && GUEST_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check auth-required routes
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check seller-only routes
  if (SELLER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== 'seller') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/account/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};
