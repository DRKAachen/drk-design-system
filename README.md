# @drk/design-system

Shared DRK (Deutsches Rotes Kreuz) design system, React components, SCSS tokens, and utilities for multi-site Next.js projects.

## Contents

- **Components**: Header, Footer, Navigation, Button, BlockRenderer, CookieBanner, LegalPage
- **Styles**: DRK corporate design tokens (`_variables.scss`), mixins, reset, layout, fonts, `globals.scss`
- **Lib**: Site resolution (`getSiteByHostname`), Sanity client and GROQ queries, cookie consent (GDPR/DSGVO), utils
- **Middleware**: Hostname-based multi-site routing for Next.js (re-export from your app's `middleware.ts`)

## Installation

In your Next.js site project:

```bash
npm install @drk/design-system
```

For local development before publishing (e.g. from a sibling folder):

```json
{
  "dependencies": {
    "@drk/design-system": "file:../drk-design-system"
  }
}
```

## Usage

### Next.js config

Ensure the design system is transpiled and SCSS can resolve its styles:

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@drk/design-system'],
  sassOptions: {
    includePaths: ['./node_modules/@drk/design-system/styles', './styles'],
  },
  // ... images, etc.
}
module.exports = nextConfig
```

### Layout and components

```tsx
// app/layout.tsx
import { getSiteByHostname } from '@drk/design-system'
import Header from '@drk/design-system/components/Header/Header'
import Footer from '@drk/design-system/components/Footer/Footer'
import CookieBanner from '@drk/design-system/components/CookieBanner/CookieBanner'
import '@drk/design-system/styles/globals.scss'

export default async function RootLayout({ children }) {
  const headersList = await headers()
  const hostname = headersList.get('host') || ''
  const site = await getSiteByHostname(hostname)

  return (
    <html lang={site?.defaultLocale || 'de'}>
      <body className="app" data-site-id={site?._id}>
        <a href="#main-content" className="skip-link">Zum Inhalt springen</a>
        <Header site={site} />
        <main id="main-content" className="main">{children}</main>
        <Footer site={site} />
        <CookieBanner />
      </body>
    </html>
  )
}
```

### Middleware

Create `middleware.ts` at your project root and re-export the design system middleware:

```ts
// middleware.ts (at project root)
export { middleware, config } from '@drk/design-system/middleware'
```

### SCSS in your app

Import design tokens or globals as needed:

```scss
@use '@drk/design-system/styles/variables' as *;
@use '@drk/design-system/styles/mixins' as *;
// Or import the full globals in your root layout:
// import '@drk/design-system/styles/globals.scss'
```

### Environment variables

Your site must set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (e.g. `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (e.g. `2024-01-01`)
- Optional: `NEXT_PUBLIC_DEFAULT_SITE_HOSTNAME` for fallback site

## Fonts (GDPR/DSGVO)

Fonts are not included in the package. Place Merriweather (and any other) font files in your app's `public/fonts/` and ensure `globals.scss` (or `_fonts.scss`) is loaded so `url('/fonts/...')` resolves correctly.

## Versioning

This package follows semantic versioning. Consuming sites can use Renovate or Dependabot to open PRs when new versions are published.
