/**
 * CMS-agnostic site configuration shape used by UI components.
 */
export interface SiteConfig {
  _id: string
  name: string
  hostname: string
  defaultLocale: string
  logoUrl?: string
  navigation?: Array<{
    label: string
    href: string
    children?: Array<{ label: string; href: string }>
  }>
  footerLinks?: Array<{ label: string; href: string }>
}
