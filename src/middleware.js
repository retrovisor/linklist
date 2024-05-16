// middleware.js

import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  console.log('Middleware executed');
  const token = await getToken({ req, secret: process.env.SECRET })
  console.log('Token:', token);

  const { pathname } = req.nextUrl

  if (token && pathname === '/login') {
    console.log('Redirecting to /account');
    return NextResponse.redirect(new URL('/account', req.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: '/login'
}
