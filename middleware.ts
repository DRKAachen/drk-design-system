/**
 * Next.js middleware for multi-site hostname-based routing.
 * Resolves site configuration from the request hostname and makes it available
 * to pages and API routes via request headers.
 *
 * Consuming site: create middleware.ts at project root that re-exports this:
 *   import { middleware, config } from '@drk/design-system/middleware'
 *   export { middleware, config }
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSiteByHostname } from './lib/site'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/sanity')
  ) {
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
