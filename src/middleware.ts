import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Middleware to protect routes with Supabase Auth
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes - Giriş yapılmadan erişilebilir sayfalar
  const publicRoutes = ['/', '/giris', '/sifremi-unuttum', '/sifre-yenileme']
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))

  // Static files and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // DEVELOPMENT MODE: Allow access without authentication
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    return NextResponse.next()
  }

  try {
    // Get auth token from cookie
    const token = request.cookies.get('sb-access-token')?.value

    if (!token && !isPublicRoute) {
      // No session and trying to access protected route
      return NextResponse.redirect(new URL('/giris', request.url))
    }

    if (token && isPublicRoute && pathname !== '/') {
      // Has session but trying to access auth pages - redirect to dashboard
      // Default to admin for now, you can improve this by decoding the JWT
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of error, allow request to continue in development
    return NextResponse.next()
  }
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
