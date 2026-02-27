# @drkaachen/content-sanity

Optional Sanity integration package for DRK apps.

This package contains:
- Sanity client setup
- image URL builder (`urlFor`)
- GROQ queries
- hostname-based site loading (`getSiteByHostname`)

## When to use

Use this package only in apps that actually need Sanity CMS data.

If your app is UI-only, install only `@drkaachen/design-system-ui`.

## Installation

```bash
npm install @drkaachen/content-sanity
```

## Exports

```ts
import {
  client,
  urlFor,
  getSiteByHostname,
  siteByHostnameQuery,
  pageBySlugQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  legalPageBySlugQuery,
} from '@drkaachen/content-sanity'
```

## Environment Variables

Required:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`

Recommended:
- `NEXT_PUBLIC_SANITY_DATASET` (default: `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (default: `2024-01-01`)
- `NEXT_PUBLIC_DEFAULT_SITE_HOSTNAME` (optional fallback hostname)

## Typical Usage

```ts
import { getSiteByHostname, urlFor } from '@drkaachen/content-sanity'
import type { SiteConfig as UiSiteConfig } from '@drkaachen/design-system-ui'

export async function getUiSite(hostname: string): Promise<UiSiteConfig | null> {
  const cmsSite = await getSiteByHostname(hostname)
  if (!cmsSite) return null

  return {
    _id: cmsSite._id,
    name: cmsSite.name,
    hostname: cmsSite.hostname,
    defaultLocale: cmsSite.defaultLocale,
    logoUrl: cmsSite.logo ? urlFor(cmsSite.logo).height(120).fit('max').auto('format').url() : undefined,
    navigation: cmsSite.navigation,
    footerLinks: cmsSite.footerLinks,
  }
}
```

## Boundaries

- Keep CMS-specific logic in this package.
- Do not import this package from `@drkaachen/design-system-ui`.
- Keep UI package consumers free from Sanity dependencies unless explicitly needed.

## Privacy and Security Notes

- Store secrets and tokens in environment variables only.
- Validate all hostnames and request inputs before using them in fetch parameters.
- Keep CMS integration optional to reduce GDPR/DSGVO risk surface for apps that do not need external content services.
