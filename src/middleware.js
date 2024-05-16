// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export async function middleware(req) {
  console.log('Middleware executed');
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);

  // Log headers and cookies for debugging
  console.log('Request Headers:', req.headers);
  console.log('Request Cookies:', req.cookies);

  // Manually parse cookies
  const cookies = parse(req.headers.get('cookie') || '');
  const tokenCookie = cookies['next-auth.session-token'] || cookies['next-auth.callback-url'];

  console.log('Parsed Token Cookie:', tokenCookie);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: tokenCookie });
  console.log('Token:', token);

  const { pathname } = req.nextUrl;

  if (token && pathname === '/login') {
    console.log('Redirecting to /account');
    return NextResponse.redirect(new URL('/account', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
};
