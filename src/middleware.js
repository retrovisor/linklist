import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)'],
};

export function middleware(req) {
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
  
  const pathname = req.nextUrl.pathname;
  
  // Check if the path starts with a locale prefix
  const startsWithLocale = languages.some((loc) => pathname.startsWith(`/${loc}`));
  
  // Check if the path is a locale path
  const isLocalePath = languages.some((loc) => pathname === `/${loc}`);
  
  // Check if the path matches the user-generated path pattern
  const isUserGeneratedPath = /^\/[a-zA-Z0-9_-]+$/.test(pathname);
  
  if (!startsWithLocale && !isLocalePath && !isUserGeneratedPath) {
    return NextResponse.redirect(new URL(`/${lng}${pathname}`, req.url));
  }
  
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer'));
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) {
      response.cookies.set(cookieName, lngInReferer);
    }
    return response;
  }
  
  return NextResponse.next();
}
