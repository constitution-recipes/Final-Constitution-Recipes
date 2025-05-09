import { NextResponse } from 'next/server';

export function middleware(request) {
  // 관리자 페이지 접근 제한
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // TODO: 실제 인증 로직 구현
    const isAdmin = true; // 임시로 true로 설정

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 