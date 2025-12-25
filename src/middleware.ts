import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware to protect routes
export function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED FOR TESTING WITH MOCK USERS
  // This middleware will be re-enabled when real authentication is implemented

  return NextResponse.next()

  /* ORIGINAL AUTH LOGIC - COMMENTED OUT FOR TESTING
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If trying to access protected route without token
  if (!token && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and trying to access auth pages
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
