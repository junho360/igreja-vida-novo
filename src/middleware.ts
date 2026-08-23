import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value

  const pathname = request.nextUrl.pathname
  const isOnLoginPage = pathname === '/admin/login'

  if (isOnLoginPage) return NextResponse.next()

  const isOnAdmin = pathname.startsWith('/admin')
  if (isOnAdmin && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
