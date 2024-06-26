import { NextResponse } from 'next/server';

export default function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = !pathname.startsWith('/en') && !pathname.startsWith('/kr');

  if (pathnameIsMissingLocale) {
    const locale = 'en'; // Set the default locale
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
