/**
 * Site resolution and configuration utilities.
 * Handles hostname-based site identification for multi-site support.
 */

import client from './sanity/client'
import { siteByHostnameQuery } from './sanity/queries'

export interface SiteConfig {
  _id: string
  name: string
  hostname: string
  logo?: any
  primaryColor?: string
  secondaryColor?: string
  defaultLocale: string
  navigation?: Array<{
    label: string
    href: string
    children?: Array<{ label: string; href: string }>
  }>
  footerLinks?: Array<{ label: string; href: string }>
}

/**
 * Development fallback site configuration.
 */
const DEV_FALLBACK_SITE: SiteConfig = {
  _id: 'dev-fallback',
  name: 'DRK Development Site',
  hostname: 'localhost',
  defaultLocale: 'de',
  navigation: [
    { label: 'Startseite', href: '/' },
    { label: 'Über uns', href: '/ueber-uns' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  footerLinks: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
  ],
}

/**
 * Resolve site configuration from hostname.
 */
export async function getSiteByHostname(hostname: string): Promise<SiteConfig | null> {
  try {
    const cleanHostname = normalizeHostname(hostname)
    if (!isValidHostname(cleanHostname)) {
      return null
    }

    const site = await client.fetch<SiteConfig | null>(siteByHostnameQuery, {
      hostname: cleanHostname,
    })

    if (site) {
      return site
    }

    const defaultHostname = process.env.NEXT_PUBLIC_DEFAULT_SITE_HOSTNAME
    if (defaultHostname && defaultHostname !== cleanHostname) {
      const defaultSite = await client.fetch<SiteConfig | null>(siteByHostnameQuery, {
        hostname: defaultHostname,
      })
      if (defaultSite) {
        return defaultSite
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Site] No site found for hostname "${cleanHostname}". Using development fallback.`
      )
      return DEV_FALLBACK_SITE
    }

    return null
  } catch (error) {
    console.error('Error fetching site configuration:', error)
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Site] Returning development fallback due to error.')
      return DEV_FALLBACK_SITE
    }
    return null
  }
}

function normalizeHostname(hostname: string): string {
  return hostname
    .split(',')[0]
    .trim()
    .toLowerCase()
    .split(':')[0]
}

function isValidHostname(hostname: string): boolean {
  if (!hostname) return false
  if (hostname === 'localhost') return true
  return /^[a-z0-9.-]+$/.test(hostname)
}
