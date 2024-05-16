// middleware.js

import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const { pathname } = req.nextUrl

  // If the user is logged in and trying to access the login page, redirect them to /account
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/account', req.url))
  }

  // Continue with the request if it's not a login page or if the user is not logged in
  return NextResponse.next()
}

export const config = {
  matcher: '/login'
}
