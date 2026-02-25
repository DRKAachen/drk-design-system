import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from '../lib/sanitize'

describe('sanitizeHtml', () => {
  it('removes script tags and preserves allowed markup', () => {
    const input = '<p>Hello</p><script>alert(1)</script><strong>World</strong>'
    const output = sanitizeHtml(input)

    expect(output).toContain('<p>Hello</p>')
    expect(output).toContain('<strong>World</strong>')
    expect(output).not.toContain('<script>')
    expect(output).not.toContain('alert(1)')
  })

  it('forces rel and target for external links', () => {
    const input = '<a href="https://example.org">External</a>'
    const output = sanitizeHtml(input)

    expect(output).toContain('href="https://example.org"')
    expect(output).toContain('target="_blank"')
    expect(output).toContain('rel="noopener noreferrer"')
  })

  it('blocks unsafe link protocols', () => {
    const input = '<a href="javascript:alert(1)">Bad</a>'
    const output = sanitizeHtml(input)

    expect(output).toBe('<span>Bad</span>')
    expect(output).not.toContain('href=')
  })
})
