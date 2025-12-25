import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware to protect routes
export function middleware(request: NextRequest) {
  // This is a placeholder for authentication middleware
  // Will be implemented with proper auth logic

  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  // Public routes - Giriş yapılmadan erişilebilir sayfalar
  const publicRoutes = ['/giris', '/sifremi-unuttum', '/sifre-yenileme']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Korumalı sayfaya token olmadan erişmeye çalışılırsa giriş sayfasına yönlendir
  if (!token && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/giris', request.url))
  }

  // Giriş yapmış kullanıcı auth sayfalarına gitmeye çalışırsa dashboard'a yönlendir
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
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
