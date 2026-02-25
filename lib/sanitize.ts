/**
 * Minimal HTML sanitizer for rich text from CMS (XSS prevention).
 * Allowlist of tags and attributes. Use for content that might contain HTML.
 * For new content, prefer Sanity Portable Text instead of raw HTML.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li', 'span',
])

/** Allowed attributes per tag (only href for links). */
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href']),
}

/**
 * Checks if an href value is safe (no javascript:, data:, etc.).
 */
function isSafeHref(href: string): boolean {
  if (!href || typeof href !== 'string') return false
  const t = href.trim().toLowerCase()
  return (
    t.startsWith('/') ||
    t.startsWith('https://') ||
    t.startsWith('http://')
  )
}

/**
 * Sanitizes an HTML string to prevent XSS. Allows only a small set of tags
 * and strips or validates attributes. Use for CMS-sourced HTML when
 * Portable Text is not available.
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') return ''
  if (html.length === 0) return ''

  // Remove obviously dangerous tags and their content
  let out = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')

  // Process opening tags: allow only allowed tags and safe attributes
  out = out.replace(/<\s*([a-z][a-z0-9]*)\s*([^>]*)>/gi, (_, tagName, attrs) => {
    const name = tagName.toLowerCase()
    if (!ALLOWED_TAGS.has(name)) return ''

    if (name === 'a') {
      const hrefMatch = attrs.match(/\bhref\s*=\s*["']([^"']*)["']/i)
      const href = hrefMatch ? hrefMatch[1].trim() : ''
      if (isSafeHref(href)) {
        return `<a href="${escapeAttr(href)}">`
      }
      return '<span>' // unsafe link → render as span (no link)
    }

    // Other allowed tags: strip all attributes for simplicity
    return `<${name}>`
  })

  // Process closing tags: allow only allowed tags
  out = out.replace(/<\s*\/\s*([a-z][a-z0-9]*)\s*>/gi, (_, tagName) => {
    const name = tagName.toLowerCase()
    return ALLOWED_TAGS.has(name) ? `</${name}>` : ''
  })

  return out
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
