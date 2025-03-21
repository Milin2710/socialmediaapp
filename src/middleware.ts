import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode'; // You'll need to install this package

export function middleware(request: NextRequest) {
  // Check for auth token in cookies
  const authToken = request.cookies.get('auth-token')?.value;
  let isAuthenticated = false;
  let userInfo = null;
  
  if (authToken) {
    try {
      // Decode the token to get user information
      const decoded = jwtDecode(authToken);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (decoded.exp && decoded.exp > currentTime) {
        isAuthenticated = true;
        userInfo = {
          user_id: decoded.sub,
          email: decoded.email,
          user_id: decoded.user_id,
          role: decoded.role
        };
      }
    } catch (error) {
      console.error('Token verification failed', error);
    }
  }
  
  // Get the path the user is trying to access
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/'];
  
  // Routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/create-post'];
  
  // If user is authenticated and trying to access login/signup pages, redirect to dashboard
  if (isAuthenticated && publicRoutes.includes(pathname) && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes this middleware will run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
