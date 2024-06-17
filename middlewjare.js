// src/app/middleware.js
import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};

export function middleware(req) {
  try {
    const { pathname } = req.nextUrl;
    console.log('Pathname:', pathname);

    const isLocalePath = languages.some((loc) => pathname.startsWith(`/${loc}/`));
    console.log('Is Locale Path:', isLocalePath);

    if (isLocalePath) {
      const locale = pathname.split('/')[1];
      console.log('Locale:', locale);
      const response = NextResponse.next();
      response.cookies.set(cookieName, locale);
      console.log('Setting locale cookie:', locale);
      return response;
    }

    let lng;
    if (req.cookies.has(cookieName)) {
      lng = acceptLanguage.get(req.cookies.get(cookieName).value);
      console.log('Language from cookie:', lng);
    }
    if (!lng) {
      lng = acceptLanguage.get(req.headers.get('Accept-Language'));
      console.log('Language from Accept-Language header:', lng);
    }
    if (!lng) {
      lng = fallbackLng;
      console.log('Fallback language:', lng);
    }

    if (!isLocalePath) {
      const uriPath = pathname.slice(1);
      const rewriteUrl = new URL(`/${lng}/[uri]/${uriPath}`, req.url);
      console.log('Rewriting URL:', rewriteUrl.toString());
      return NextResponse.rewrite(rewriteUrl);
    }

    console.log('Continuing to next middleware or route handler');
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.error();
  }
}
