import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Build CSP - keeping unsafe-inline for Next.js compatibility
  // In production, we tighten other directives but keep what Next.js needs
  const cspHeader = [
    "default-src 'self'",
    // Next.js requires unsafe-eval for webpack and unsafe-inline for hydration scripts
    // We keep them but add additional restrictions
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://connect.facebook.net https://www.googletagmanager.com https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: http: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.facebook.com https://vitals.vercel-insights.com https://va.vercel-scripts.com wss://ws.vercel.live",
    "frame-src 'self' https://accounts.google.com https://www.facebook.com",
    "media-src 'self' data: blob:",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    isDev ? "" : "upgrade-insecure-requests",
  ].filter(Boolean).join('; ');

  const response = NextResponse.next();

  // Set CSP header on response
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
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
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
