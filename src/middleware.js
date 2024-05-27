// src/middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export async function middleware(req) {
  console.log('Middleware executed');
  console.log('SECRET:', process.env.SECRET);

  // Manually parse cookies
  const cookieHeader = req.headers.get('cookie');
  const cookies = parse(cookieHeader || '');
  const tokenCookie = cookies['__Secure-next-auth.session-token'] || cookies['next-auth.session-token'];
  console.log('Parsed Token Cookie:', tokenCookie);

  // Ensure req is passed correctly to getToken
  const token = await getToken({ req, secret: process.env.SECRET });
  console.log('Token:', token);

  const { pathname } = req.nextUrl;
  if (token !== null && pathname === '/login') {
    console.log('Redirecting to /account');
    return NextResponse.redirect(new URL('/account', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
};
