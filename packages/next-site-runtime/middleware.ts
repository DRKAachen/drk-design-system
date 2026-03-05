/**
 * Next.js middleware for multi-site hostname-based routing.
 * Resolves site configuration from the request hostname and makes it available
 * to pages and API routes via request headers.
 *
 * SECURITY: This middleware trusts x-forwarded-host only when
 * TRUST_PROXY=true is set. Consuming apps behind a reverse proxy must
 * set this env var AND configure the proxy to overwrite x-forwarded-host.
 *
 * Consuming site: create middleware.ts at project root that re-exports this:
 *   import { middleware, config } from '@drkaachen/next-site-runtime/middleware'
 *   export { middleware, config }
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSiteByHostname } from '@drkaachen/content-sanity'

const SITE_HEADER_ID = 'x-site-id'
const SITE_HEADER_HOSTNAME = 'x-site-hostname'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const hostname = resolveHostname(request)
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/sanity')
  ) {
    return NextResponse.next()
  }

  if (!isAllowedHostname(hostname)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Middleware] Blocked request with non-allowed hostname: ${hostname}`)
    }
    return NextResponse.next()
  }

  if (pathname === '/home' || pathname === '/home/') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 301)
  }

  const site = await getSiteByHostname(hostname)

  if (!site) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Middleware] No site configuration found for hostname: ${hostname}`)
    }
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)

  // Overwrite site headers to prevent spoofing from incoming requests (S4)
  requestHeaders.delete(SITE_HEADER_ID)
  requestHeaders.delete(SITE_HEADER_HOSTNAME)
  requestHeaders.set(SITE_HEADER_ID, site._id)
  requestHeaders.set(SITE_HEADER_HOSTNAME, site.hostname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

/** Next.js middleware matcher: run on all paths except static and API. */
export const config = {
  matcher: ['/((?!_next|api|sanity).*)'],
}

/**
 * Resolves the effective hostname from the request.
 * Only trusts x-forwarded-host when TRUST_PROXY env var is explicitly "true".
 */
function resolveHostname(request: NextRequest): string {
  const trustProxy = process.env.TRUST_PROXY === 'true'
  if (trustProxy) {
    const forwarded = request.headers.get('x-forwarded-host')
    if (forwarded) return normalizeHostname(forwarded)
  }
  return normalizeHostname(request.headers.get('host') || '')
}

function normalizeHostname(hostname: string): string {
  return hostname
    .split(',')[0]
    .trim()
    .toLowerCase()
    .split(':')[0]
}

function isAllowedHostname(hostname: string): boolean {
  if (!hostname) return false
  const rawAllowlist = process.env.ALLOWED_SITE_HOSTNAMES
  if (!rawAllowlist) return true
  const allowlist = rawAllowlist
    .split(',')
    .map((entry) => normalizeHostname(entry))
    .filter(Boolean)
  return allowlist.includes(hostname)
}
