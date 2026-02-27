/**
 * @drkaachen/content-sanity
 *
 * Optional Sanity adapter for DRK apps.
 */

export { default as client, urlFor } from './lib/sanity/client'
export * from './lib/sanity/queries'
export { getSiteByHostname } from './lib/site'
export type { SiteConfig } from './lib/site'
