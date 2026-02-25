/**
 * @drk/design-system
 *
 * Re-exports for convenience. Consumers can also use deep imports, e.g.:
 *   import { getSiteByHostname } from '@drk/design-system/lib/site'
 */

export { getSiteByHostname } from './lib/site'
export type { SiteConfig } from './lib/site'
export { default as client, urlFor } from './lib/sanity/client'
export * from './lib/sanity/queries'
export * from './lib/cookies/consent'
export * from './lib/utils'
export { middleware } from './middleware'

// Components (use these from main entry to avoid deep path resolution issues)
export { default as Header } from './components/Header/Header'
export { default as Footer } from './components/Footer/Footer'
export { default as Navigation } from './components/Navigation/Navigation'
export { default as Button } from './components/Button/Button'
export { default as BlockRenderer } from './components/BlockRenderer/BlockRenderer'
export { default as CookieBanner } from './components/CookieBanner/CookieBanner'
export { default as CookieSettingsLink } from './components/CookieBanner/CookieSettingsLink'
export { default as LegalPage } from './components/LegalPage/LegalPage'
