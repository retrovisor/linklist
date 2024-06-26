import { NextResponse } from 'next/server';

export default function middleware(request) {
  const { pathname } = request.nextUrl;
  const defaultLocale = 'en'; // Set your default locale here
  
  // Check if the path is missing the locale
  const pathnameIsMissingLocale = !pathname.startsWith('/en') && !pathname.startsWith('/kr');
  
  if (pathname === '/') {
    // Redirect root path to default locale
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  if (pathnameIsMissingLocale) {
    // Handle paths missing locale
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
