import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request (e.g. /admin/dashboard)
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/admin/login'];

  // Check if the path starts with /admin and is not a public path
  if (path.startsWith('/admin') && !publicPaths.includes(path)) {
    // Check if the user is authenticated
    const isAuthenticated = request.cookies.get('isAdminLoggedIn');

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*'
  ]
};
