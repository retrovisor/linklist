import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow these paths to pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/select-template')
  ) {
    return NextResponse.next();
  }

  // For the root path, redirect to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // If the path doesn't start with /en or /kr, prepend /en
  if (!pathname.startsWith('/en') && !pathname.startsWith('/kr')) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // For all other paths, just pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
