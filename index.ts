/**
 * @drkaachen/design-system-ui
 *
 * UI-only exports: components, styles, and generic client-side utilities.
 */

export type { SiteConfig } from './lib/site-config'
export * from './lib/cookies/consent'
export { sanitizeHtml } from './lib/sanitize'

// Components (use these from main entry to avoid deep path resolution issues)
export { default as Header } from './components/Header/Header'
export { default as Footer } from './components/Footer/Footer'
export { default as Navigation } from './components/Navigation/Navigation'
export { default as Button } from './components/Button/Button'
export { default as CookieBanner } from './components/CookieBanner/CookieBanner'
export { default as CookieSettingsLink } from './components/CookieBanner/CookieSettingsLink'
export { default as Label } from './components/Label/Label'
export { default as Input } from './components/Input/Input'
export { default as Textarea } from './components/Textarea/Textarea'
export { default as Select } from './components/Select/Select'
export { default as Checkbox } from './components/Checkbox/Checkbox'
export { default as Radio } from './components/Radio/Radio'
export { default as Alert } from './components/Alert/Alert'
export { default as Spinner } from './components/Spinner/Spinner'
export { default as Modal } from './components/Modal/Modal'
