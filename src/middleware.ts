import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // TODO: Check NextAuth session
    // For now, allow all access during development
  }

  return NextResponse.next()
}

export const config = {