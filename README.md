# DRK Frontend Monorepo

Monorepo for DRK frontend packages with strict separation between UI, CMS adapters, and runtime helpers.

## Package Architecture

### `@drkaachen/design-system-ui` (repo root)

UI-only package with:
- React components (Header, Footer, Navigation, Button, Modal, Alert, form controls, CookieBanner, Spinner)
- SCSS tokens, mixins, globals (including dark mode and reduced-motion support)
- Cookie consent helpers with DSGVO enforcement utilities
- HTML sanitizer, scroll-lock utility, and CSP security headers helper

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
- Proxy trust and hostname allowlist configuration

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
  Modal,
  Alert,
  Input,
  Label,
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

### Cookie Consent Enforcement (DSGVO)

The design system provides consent storage **and** enforcement utilities. Consuming apps must gate non-essential functionality behind consent checks:

```tsx
import { hasConsent, onConsentChange } from '@drkaachen/design-system-ui'

// Gate analytics behind user consent
if (hasConsent('analytics')) {
  initAnalytics()
}

// Forward consent events to a server-side audit log (DSGVO Art. 7(1))
onConsentChange((consent) => {
  fetch('/api/consent-log', {
    method: 'POST',
    body: JSON.stringify(consent),
  })
})
```

Available consent utilities:
- `hasConsent(category)` — checks if a specific category is consented to
- `hasAllConsent(categories)` — checks multiple categories at once
- `clearConsentData()` — removes all consent data (Art. 17 right to erasure)
- `getConsentDataForExport()` — returns consent in portable JSON (Art. 20 data portability)
- `onConsentChange(callback)` — subscribe to consent changes (returns unsubscribe function)

### Security Headers

Apply recommended security headers in consuming apps:

```tsx
// In next.config.ts
import { securityHeaders } from '@drkaachen/design-system-ui/lib/security-headers'

const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders() }]
  },
}
```

Or in middleware:

```tsx
import { applySecurityHeaders } from '@drkaachen/design-system-ui/lib/security-headers'

const response = NextResponse.next()
applySecurityHeaders(response.headers, {
  extraImgSrc: ['https://*.sanity.io'],
})
```

### Scroll Lock

iOS-safe body scroll lock for modals and drawers (used internally by Modal and Navigation):

```tsx
import { lockBodyScroll, unlockBodyScroll } from '@drkaachen/design-system-ui'
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

## Accessibility (WCAG 2.2 AA)

The design system follows WCAG 2.2 Level AA guidelines:

- **Color contrast:** Heading and text colors use `$color-text-accent` (#c20004, ~5.2:1 ratio) instead of raw `$drk-rot` (#e60005, ~4.0:1) for WCAG AA compliance on small text. `$drk-rot` is reserved for large text (>=18pt), decorative elements, and background fills.
- **Reduced motion:** Global `prefers-reduced-motion: reduce` media query disables all transitions and animations. A `@mixin reduced-motion` is available for component-level use.
- **Dark mode:** Basic `prefers-color-scheme: dark` support with dark tokens.
- **Focus indicators:** Visible 2px red outline with white shadow ring on all interactive elements via `@mixin focus-outline`.
- **Keyboard navigation:** Modal focus trap, Navigation arrow-key/Escape/Home/End support, skip link.
- **Screen readers:** Proper ARIA attributes (`aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-live`, `role="alert"`, `role="status"`).
- **Form accessibility:** All form components support `aria-describedby` for linking to error/hint IDs from Label.

## App Template Guidance

For `drk-app-template`:
- Keep default dependency set to `@drkaachen/design-system-ui` only
- Provide an optional documented module/feature toggle for Sanity setup
- Only add Sanity env vars and middleware in apps that explicitly enable Sanity

## Public Registry Setup

Packages are published publicly to npm. Consuming apps can install without extra registry auth:

```bash
npm install @drkaachen/design-system-ui
```

Optional internal mirror setup (if you later switch to private hosting) is documented in
`templates/npmrc.consuming-app.private`.

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
npm run lint          # ESLint (TypeScript, React, jsx-a11y)
npm run format:check  # Prettier formatting check
npm run typecheck     # TypeScript strict mode
npm run typecheck:workspaces
npm run test          # Vitest (128 tests across 8 files)
```

Run showcase:

```bash
cd showcase
npm run dev
```

### Pre-commit Hooks

Husky + lint-staged runs automatically on `git commit`:
- `*.{ts,tsx}` → ESLint fix + Prettier
- `*.{scss,css,json,yml,yaml}` → Prettier

## Publishing

Publishing runs via GitHub Actions (`.github/workflows/publish.yml`) and pushes to npm. The publish job requires the `npm-publish` environment (configure required reviewers in GitHub repo settings).

Requirements before first release:

- Create an npm organization/user that owns the `@drkaachen` scope.
- Add `NPM_TOKEN` as a repository secret (token with publish rights for that scope).
- Create a GitHub environment named `npm-publish` with required reviewers.
- Bump package versions intentionally before triggering release.

Then trigger the publish workflow manually or via GitHub Release.

## Fonts and GDPR/DSGVO

All fonts are self-hosted via `@fontsource` packages — no external CDN requests at runtime.

| Font | Purpose | Weights | Source |
|------|---------|---------|--------|
| Open Sans | Body text, UI elements | 300, 400, 500, 700 | `@fontsource/open-sans` |
| Merriweather | Headings | 300, 400, 700 | `@fontsource/merriweather` |

The body font stack follows the [DRK Styleguide](https://styleguide.drk.de/deutsches-rotes-kreuz/digital/webseite):

```
'Helvetica Neue', 'Open Sans', Helvetica, Arial, sans-serif
```

- **macOS/iOS users** get Helvetica Neue (pre-installed system font)
- **All other users** get Open Sans (self-hosted, free, closest visual match to Helvetica Neue per DRK styleguide)
- Helvetica Neue is a commercial font (Monotype). It is referenced as a system font only — no licensed font files are bundled.
- No per-project font file copy is required.
- Do not load fonts from external CDNs.

### Cookie Inventory (for Datenschutzerklärung)

| Cookie/Storage | Name | Purpose | Category | Retention |
|---------------|------|---------|----------|-----------|
| Cookie | `drk_cookie_consent_v1` | Stores user's cookie consent preferences | Necessary (TTDSG §25(2)) | 365 days |
| localStorage | `drk_cookie_consent` | Mirrors consent for faster client-side access | Necessary | Until cleared |

Consuming apps must include this information in their Datenschutzerklärung.

## Security

See `SECURITY.md` for vulnerability reporting and disclosure process.

Branch protection is recommended:
- Require CI to pass before merge
- Require at least 1 review on pull requests
- Prevent force-push to `main`
