import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/applications', '/profile', '/settings'];
const authRoutes = ['/login', '/register'];

// Role-restricted route prefixes
const roleRoutes: Record<string, string> = {
  '/dashboard/student': 'student',
  '/dashboard/company': 'company',
  '/dashboard/admin': 'admin',
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

  // Not logged in — redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Already logged in — redirect away from auth pages to correct dashboard
  if (isAuthRoute && token && role) {
    const dashMap: Record<string, string> = {
      student: '/dashboard/student',
      company: '/dashboard/company',
      admin: '/dashboard/admin',
    };
    return NextResponse.redirect(new URL(dashMap[role] ?? '/dashboard/student', request.url));
  }

  // Wrong role trying to access another role's dashboard
  for (const [routePrefix, requiredRole] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(routePrefix) && role && role !== requiredRole) {
      const dashMap: Record<string, string> = {
        student: '/dashboard/student',
        company: '/dashboard/company',
        admin: '/dashboard/admin',
      };
      return NextResponse.redirect(new URL(dashMap[role] ?? '/dashboard/student', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
