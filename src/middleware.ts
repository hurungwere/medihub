import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionUser = request.cookies.get('session_user')?.value
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isClinicRoute = pathname.startsWith('/dashboard/clinic')
  const isSupplierRoute = pathname.startsWith('/dashboard/supplier')
  const isAuthRoute = pathname.startsWith('/auth')

  // Guard protected routes
  if (isAdminRoute || isClinicRoute || isSupplierRoute) {
    if (!sessionUser) {
      const loginUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const user = JSON.parse(sessionUser)
      const role = user.orgType

      if (isAdminRoute && role !== 'admin') {
        return NextResponse.redirect(new URL(role === 'clinic' ? '/dashboard/clinic' : '/dashboard/supplier', request.url))
      }
      if (isClinicRoute && role !== 'clinic') {
        return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard/supplier', request.url))
      }
      if (isSupplierRoute && role !== 'supplier') {
        return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard/clinic', request.url))
      }
    } catch (e) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('session_user')
      return response
    }
  }

  // Redirect authenticated users away from login/register pages
  if (isAuthRoute && sessionUser) {
    try {
      const user = JSON.parse(sessionUser)
      const role = user.orgType
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (role === 'clinic') {
        return NextResponse.redirect(new URL('/dashboard/clinic', request.url))
      } else if (role === 'supplier') {
        return NextResponse.redirect(new URL('/dashboard/supplier', request.url))
      }
    } catch {
      // Ignore invalid cookie structure on auth routes
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
  ],
}
