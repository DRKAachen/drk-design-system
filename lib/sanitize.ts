/**
 * HTML sanitizer for rich text from CMS (XSS prevention).
 * Uses a maintained sanitizer library with strict allowlists.
 */

import sanitizeHtmlLib, { IOptions } from 'sanitize-html'

/**
 * Checks if an href value is safe (no javascript:, data:, etc.).
 */
function isSafeHref(href: string): boolean {
  if (!href || typeof href !== 'string') return false
  const t = href.trim().toLowerCase()
  return (
    t.startsWith('/') ||
    t.startsWith('https://') ||
    t.startsWith('http://') ||
    t.startsWith('mailto:') ||
    t.startsWith('tel:')
  )
}

const SANITIZE_OPTIONS: IOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li', 'span'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  transformTags: {
    a: (_tagName: string, attrs: Record<string, string>) => {
      const href = typeof attrs.href === 'string' ? attrs.href.trim() : ''
      if (!isSafeHref(href)) {
        return { tagName: 'span', attribs: {} }
      }
      const isExternal = href.startsWith('http://') || href.startsWith('https://')
      return {
        tagName: 'a',
        attribs: {
          href,
          ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
        },
      }
    },
  },
}

/**
 * Sanitizes an HTML string to prevent XSS. Allows only a small set of tags
 * and strips or validates attributes. Use for CMS-sourced HTML when
 * Portable Text is not available.
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') return ''
  if (html.length === 0) return ''
  return sanitizeHtmlLib(html, SANITIZE_OPTIONS)
}
