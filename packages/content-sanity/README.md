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

## Data Privacy & DSGVO

Using this package means your application makes API requests to Sanity.io servers to fetch content. This has several DSGVO (Datenschutz-Grundverordnung) implications:

- **IP address transmission:** Every Sanity API/CDN request transmits the visitor's IP address to Sanity servers. This constitutes personal data processing under DSGVO.
- **Data Processing Agreement (DPA):** A Auftragsverarbeitungsvertrag (AVV / DPA) with Sanity.io must be in place before processing any visitor data through their services.
- **International data transfer:** Sanity.io is a US-based service. Standard Contractual Clauses (SCCs) for international data transfer must be executed to comply with DSGVO Chapter V requirements.
- **Privacy policy disclosure:** Your site's privacy policy (Datenschutzerklärung) must mention Sanity.io as a data processor, the categories of data processed, and the legal basis for the transfer.
- **Public datasets:** Sanity public datasets are readable by anyone with the project ID. Never store personal data (e.g. user submissions, contact details) in public datasets.
- **Client-exposed env vars:** All `NEXT_PUBLIC_` environment variables are embedded in the client-side JavaScript bundle by design. `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` will be visible to end users.
- **CDN routing:** When `useCdn: true` is set (the default for production), content requests are routed through Sanity's CDN, which is likely US-hosted. Consider this when evaluating data residency requirements.

## Security

- **`NEXT_PUBLIC_SANITY_PROJECT_ID` is intentionally public.** It is required on the client to fetch content and only grants read access to public datasets. This is safe as long as public datasets contain only published content data.
- **Never store sensitive or personal data in public Sanity datasets.** Use private datasets with token-based access for any data that should not be publicly accessible.
- **Configure Sanity Studio access controls properly.** Restrict editor/admin roles to authorized personnel. Enable two-factor authentication for Sanity accounts. Review the project's CORS origins and API token permissions regularly.
