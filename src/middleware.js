import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const LOCALIZED_PAGES = ['', 'about', 'login', 'signup'];

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

  // Check if the path should be localized
  const shouldLocalize = LOCALIZED_PAGES.some(page => 
    pathname === `/${page}` || pathname === `/${page}/`
  );

  if (shouldLocalize) {
    // If it's not already localized, add the default locale
    if (!pathname.startsWith('/en/') && !pathname.startsWith('/kr/')) {
      return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
    }
  }

  // For the root path, redirect to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // For all other paths, just pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
