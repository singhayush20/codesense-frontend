import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth middleware example
export function middleware(request: NextRequest) {
  // Add auth logic here
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
