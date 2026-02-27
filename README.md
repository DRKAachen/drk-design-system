# DRK Frontend Monorepo

Monorepo for DRK frontend packages with strict separation between UI, CMS adapters, and runtime helpers.

## Package Architecture

### `@drkaachen/design-system-ui` (repo root)

UI-only package with:
- React components
- SCSS tokens, mixins, globals
- Cookie consent helpers and components
- Generic sanitizer helper

This package intentionally does **not** include:
- Sanity client
- GROQ queries
- Hostname middleware

### `@drkaachen/content-sanity` (`packages/content-sanity`)

Optional Sanity adapter package:
- Sanity client and image URL builder (`urlFor`)
- GROQ queries
- `getSiteByHostname`

### `@drkaachen/next-site-runtime` (`packages/next-site-runtime`)

Optional Next.js runtime package:
- Middleware for hostname-to-site header propagation
- Runtime helpers for reading site headers

## Why We Split It

- Keeps app templates clean and lightweight by default
- Avoids forced CMS dependencies in UI-only apps
- Reduces security/privacy surface when CMS is not needed
- Better GDPR/DSGVO risk control by enabling integrations explicitly per app

## Install in Consuming Apps

### 1) UI-only baseline (recommended default)

```bash
npm install @drkaachen/design-system-ui
```

### 2) Add Sanity only if required

```bash
npm install @drkaachen/content-sanity @drkaachen/next-site-runtime
```

## UI Package Usage (`@drkaachen/design-system-ui`)

Import globals once in your root layout:

```tsx
import '@drkaachen/design-system-ui/styles/globals.scss'
```

Use UI components from package root:

```tsx
import {
  Header,
  Footer,
  CookieBanner,
  Button,
  type SiteConfig,
} from '@drkaachen/design-system-ui'
```

UI `SiteConfig` is CMS-agnostic and expects a plain `logoUrl` string:

```tsx
const site: SiteConfig = {
  _id: 'site-1',
  name: 'DRK Aachen',
  hostname: 'example.de',
  defaultLocale: 'de',
  logoUrl: '/images/logo.svg',
  navigation: [{ label: 'Startseite', href: '/' }],
}
```

## Optional Sanity Integration

Get site content via `@drkaachen/content-sanity`, then map it to UI shape:

```tsx
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

If middleware-based site header propagation is needed:

```ts
// middleware.ts in consuming app root
export { middleware, config } from '@drkaachen/next-site-runtime/middleware'
```

## Breaking Changes (Hard Cut)

The previous mixed package surface was removed by design.

- Old package name `@drkaachen/design-system` -> `@drkaachen/design-system-ui`
- Removed from UI package:
  - `getSiteByHostname`
  - `client`, `urlFor`, GROQ query exports
  - `middleware` export
  - `BlockRenderer` and `LegalPage` components
- New optional packages:
  - `@drkaachen/content-sanity`
  - `@drkaachen/next-site-runtime`

## App Template Guidance

For `drk-app-template`:
- Keep default dependency set to `@drkaachen/design-system-ui` only
- Provide an optional documented module/feature toggle for Sanity setup
- Only add Sanity env vars and middleware in apps that explicitly enable Sanity

## Private Registry Setup

Use `.npmrc` in consuming apps:

```ini
@drkaachen:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
always-auth=true
```

Template file is available at `templates/npmrc.consuming-app.private`.

## Automated Updates in Consuming Apps

Use Dependabot with the template:

- `templates/dependabot.consuming-app.yml`

It tracks:
- `@drkaachen/design-system-ui`
- `@drkaachen/content-sanity`
- `@drkaachen/next-site-runtime`

## Local Development (Monorepo)

Install dependencies at repository root:

```bash
npm install
```

Run quality checks:

```bash
npm run typecheck
npm run typecheck:workspaces
npm run test
```

Run showcase:

```bash
cd showcase
npm run dev
```

## Fonts and GDPR/DSGVO

Merriweather is self-hosted via `@fontsource/merriweather` inside `@drkaachen/design-system-ui`.

- No per-project font file copy is required.
- Do not load fonts from external CDNs by default.
- Font files are bundled with the package and served locally by the consuming app build.

## Security

See `SECURITY.md` for vulnerability reporting and disclosure process.
