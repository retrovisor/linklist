// src/middleware.js
import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const pathnameIsMatcher = pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/assets') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/sw.js') || pathname.startsWith('/site.webmanifest');

  if (pathnameIsMatcher) {
    return NextResponse.next();
  }

  const isLocalePath = languages.some((loc) => pathname.startsWith(`/${loc}`));

  if (isLocalePath) {
    const locale = pathname.split('/')[1];
    const response = NextResponse.next();
    response.cookies.set(cookieName, locale);
    return response;
  }

  let lng;
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  }
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }
  if (!lng) {
    lng = fallbackLng;
  }

  if (!isLocalePath) {
    const uri = pathname.substring(1);
    return NextResponse.rewrite(new URL(`/${lng}/(page)/${uri}`, req.url));
  }

  return NextResponse.next();
}
