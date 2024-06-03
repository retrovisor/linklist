// src/middleware.js
import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
    '/:locale(en|ko)?/:path*',
    '/:uri',
  ],
};

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const isLocalePath = languages.some((loc) => pathname.startsWith(`/${loc}`));
  const isUserGeneratedPath = pathname.split('/').length === 2;

  if (isLocalePath) {
    const locale = pathname.split('/')[1];
    const response = NextResponse.next();
    response.cookies.set(cookieName, locale);
    return response;
  }

  if (isUserGeneratedPath) {
    return NextResponse.rewrite(new URL(`/[uri]${pathname}`, req.url));
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
    return NextResponse.redirect(new URL(`/${lng}${pathname}`, req.url));
  }

  return NextResponse.next();
}
