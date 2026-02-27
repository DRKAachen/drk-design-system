/**
 * Next.js middleware for multi-site hostname-based routing.
 * Resolves site configuration from the request hostname and makes it available
 * to pages and API routes via request headers.
 *
 * Consuming site: create middleware.ts at project root that re-exports this:
 *   import { middleware, config } from '@drkaachen/design-system/middleware'
 *   export { middleware, config }
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSiteByHostname } from './lib/site'

export async function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const hostname = normalizeHostname(forwardedHost || request.headers.get('host') || '')
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/sanity')
  ) {
    return NextResponse.next()
  }

  if (!isAllowedHostname(hostname)) {
    console.warn(`Blocked request with non-allowed hostname: ${hostname}`)
    return NextResponse.next()
  }

  if (pathname === '/home' || pathname === '/home/') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 301)
  }

  const site = await getSiteByHostname(hostname)

  if (!site) {
    console.warn(`No site configuration found for hostname: ${hostname}`)
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-site-id', site._id)
  requestHeaders.set('x-site-hostname', site.hostname)

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
