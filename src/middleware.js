import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  const pathnameHasLocale = pathname.startsWith('/en') || pathname.startsWith('/kr');

  if (!pathnameHasLocale) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  return NextResponse.next();
}
