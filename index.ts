/**
 * @drkaachen/design-system
 *
 * Re-exports for convenience. Consumers can also use deep imports, e.g.:
 *   import { getSiteByHostname } from '@drkaachen/design-system/lib/site'
 */

export { getSiteByHostname } from './lib/site'
export type { SiteConfig } from './lib/site'
export { default as client, urlFor } from './lib/sanity/client'
export * from './lib/sanity/queries'
export * from './lib/cookies/consent'
export * from './lib/utils'
export { middleware, config } from './middleware'
export { sanitizeHtml } from './lib/sanitize'
export type {
  BlockRendererBlock,
  HeroBlock,
  TextImageBlock,
  CtaSectionBlock,
  FaqBlock,
  FaqBlockItem,
} from './lib/blocks'
export { isInternalPath } from './lib/blocks'

// Components (use these from main entry to avoid deep path resolution issues)
export { default as Header } from './components/Header/Header'
export { default as Footer } from './components/Footer/Footer'
export { default as Navigation } from './components/Navigation/Navigation'
export { default as Button } from './components/Button/Button'
export { default as BlockRenderer } from './components/BlockRenderer/BlockRenderer'
export { default as CookieBanner } from './components/CookieBanner/CookieBanner'
export { default as CookieSettingsLink } from './components/CookieBanner/CookieSettingsLink'
export { default as LegalPage } from './components/LegalPage/LegalPage'
export { default as Label } from './components/Label/Label'
export { default as Input } from './components/Input/Input'
export { default as Textarea } from './components/Textarea/Textarea'
export { default as Select } from './components/Select/Select'
export { default as Checkbox } from './components/Checkbox/Checkbox'
export { default as Radio } from './components/Radio/Radio'
export { default as Alert } from './components/Alert/Alert'
export { default as Spinner } from './components/Spinner/Spinner'
export { default as Modal } from './components/Modal/Modal'
