/**
 * Recommended security headers for consuming Next.js apps.
 *
 * Usage in next.config.ts:
 *   import { securityHeaders } from '@drkaachen/design-system-ui/lib/security-headers'
 *   const nextConfig = {
 *     async headers() {
 *       return [{ source: '/(.*)', headers: securityHeaders() }]
 *     },
 *   }
 *
 * Or in middleware:
 *   import { applySecurityHeaders } from '@drkaachen/design-system-ui/lib/security-headers'
 *   const response = NextResponse.next()
 *   applySecurityHeaders(response.headers)
 */

export interface SecurityHeaderOptions {
  /** Additional script-src directives (e.g. "'nonce-abc'" or a CDN domain). */
  extraScriptSrc?: string[]
  /** Additional img-src directives (e.g. "https://*.sanity.io" for CMS images). */
  extraImgSrc?: string[]
  /** Additional connect-src directives (e.g. analytics endpoints). */
  extraConnectSrc?: string[]
  /** Set to true if inline styles are required beyond CSS Modules. */
  allowUnsafeInlineStyles?: boolean
}

/**
 * Returns an array of `{ key, value }` security header objects suitable for
 * Next.js `headers()` config or manual response header setting.
 */
export function securityHeaders(
  options: SecurityHeaderOptions = {}
): Array<{ key: string; value: string }> {
  const {
    extraScriptSrc = [],
    extraImgSrc = [],
    extraConnectSrc = [],
    allowUnsafeInlineStyles = true,
  } = options

  const styleSrc = allowUnsafeInlineStyles
    ? "'self' 'unsafe-inline'"
    : "'self'"

  const scriptSrc = ["'self'", ...extraScriptSrc].join(' ')
  const imgSrc = ["'self'", 'data:', ...extraImgSrc].join(' ')
  const connectSrc = ["'self'", ...extraConnectSrc].join(' ')

  return [
    {
      key: 'Content-Security-Policy',
      value: [
        `default-src 'self'`,
        `script-src ${scriptSrc}`,
        `style-src ${styleSrc}`,
        `img-src ${imgSrc}`,
        `font-src 'self'`,
        `connect-src ${connectSrc}`,
        `frame-ancestors 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
      ].join('; '),
    },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-XSS-Protection', value: '0' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
  ]
}

/**
 * Applies security headers directly to a Headers object (e.g. in middleware).
 */
export function applySecurityHeaders(
  headers: Headers,
  options: SecurityHeaderOptions = {}
): void {
  for (const { key, value } of securityHeaders(options)) {
    headers.set(key, value)
  }
}
