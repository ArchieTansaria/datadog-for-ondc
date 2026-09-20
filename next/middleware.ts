import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers so we can modify them
  const requestHeaders = new Headers(request.headers);
  
  // Inject the API key for Fastify proxy routes
  // This matches the demo tenant created in the database seed
  requestHeaders.set('x-api-key', process.env.API_KEY || 'demo-api-key-123');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only apply this middleware to Fastify proxy routes
export const config = {
  matcher: '/api/v1/:path*',
};
