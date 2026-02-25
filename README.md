# @drk/design-system

Shared DRK (Deutsches Rotes Kreuz) design system, React components, SCSS tokens, and utilities for multi-site Next.js projects.

## Contents

- **Components**: Header, Footer, Navigation, Button, BlockRenderer, CookieBanner, LegalPage; **Form**: Label, Input, Textarea, Select, Checkbox, Radio; **Feedback**: Alert, Spinner, Modal
- **Styles**: DRK corporate design tokens (`_variables.scss`), mixins, reset, layout, fonts, `globals.scss`
- **Lib**: Site resolution (`getSiteByHostname`), Sanity client and GROQ queries, cookie consent (GDPR/DSGVO), utils, HTML sanitizer (`sanitizeHtml`), block types
- **Middleware**: Hostname-based multi-site routing for Next.js (re-export `middleware` and `config` from your app's `middleware.ts`)

## Components

All components can be imported from `@drk/design-system` or via deep paths (e.g. `@drk/design-system/components/Button/Button`).

### Layout & navigation

| Component   | Main props | Description |
|------------|------------|-------------|
| **Header** | `site: SiteConfig or null` | Site logo and main navigation from Sanity. |
| **Footer** | `site: SiteConfig or null` | Footer with legal links (Impressum, Datenschutz, AGB) and cookie settings link. |
| **Navigation** | `site: SiteConfig` | Main nav (desktop + mobile menu), dropdowns from Sanity. |

### Actions & content

| Component        | Main props | Description |
|-----------------|------------|-------------|
| **Button**      | `variant?: 'primary' / 'secondary' / 'outline'`, `size?: 'sm' / 'md' / 'lg'`, `asChild?`, `disabled?`, plus native button props | Button or link-styled button when `asChild` with `<Link>` or `<a>`. |
| **BlockRenderer** | `block: BlockRendererBlock` | Renders Sanity content blocks: hero, text+image, CTA, FAQ. |
| **LegalPage**   | `title`, `content: PortableTextBlock[]`, `lastUpdated?` | Renders Portable Text (e.g. Impressum, Datenschutz). |

### GDPR / legal

| Component            | Main props | Description |
|----------------------|------------|-------------|
| **CookieBanner**     | —          | Cookie consent banner; shown until user accepts or chooses “Nur notwendige”. |
| **CookieSettingsLink** | `className?`, `children?` | Link/button to reopen cookie settings (clears storage and reloads). |

### Form

| Component   | Main props | Description |
|------------|------------|-------------|
| **Label**  | `required?`, `error?`, `hint?`, `htmlFor?`, plus native label props | Accessible label with optional required asterisk, error text, and hint. |
| **Input**  | `error?`, `fullWidth?`, plus native input props | Single-line text input. |
| **Textarea** | `error?`, `fullWidth?`, plus native textarea props | Multi-line text input. |
| **Select** | `options: { value, label, disabled? }[]`, `placeholder?`, `error?`, `fullWidth?`, plus native select props | Native select with styled dropdown. |
| **Checkbox** | `label: ReactNode`, `error?`, `hint?`, plus native checkbox props | Checkbox with inline label. |
| **Radio**  | `options: { value, label, disabled? }[]`, `name`, `value?` (controlled), `error?`, `hint?`, plus native input props | Radio group. |

### Feedback

| Component | Main props | Description |
|-----------|------------|-------------|
| **Alert** | `variant?: 'success' / 'error' / 'warning' / 'info'`, `title?`, `children` | Inline message (e.g. form validation, success). |
| **Spinner** | `size?: 'sm' \| 'md' \| 'lg'`, `aria-label?` (default: "Laden") | Loading indicator. |
| **Modal**  | `open`, `onClose`, `title`, `showCloseButton?` (default: true) | Dialog overlay; closes on Escape or backdrop click. |

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

## Local Showcase App

This repository includes a local Next.js showcase consumer app in `showcase/` to preview all components in one page without changing the published package surface.

Run locally:

```bash
cd showcase
npm install
npm run dev
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

For hardened multi-domain setups behind a proxy/CDN, set `ALLOWED_SITE_HOSTNAMES` to an explicit comma-separated list. The middleware will normalize the incoming host and ignore hosts outside this allowlist.

### SCSS in your app

Import design tokens or globals as needed:

```scss
@use '@drk/design-system/styles/variables' as *;
@use '@drk/design-system/styles/mixins' as *;
// Or import the full globals in your root layout:
// import '@drk/design-system/styles/globals.scss'
```

### Form and feedback components

Use the design system components for forms and feedback:

```tsx
import { Label, Input, Button, Alert, Spinner, Modal } from '@drk/design-system'

// Form field with label and error
<Label htmlFor="email" required error={errors.email}>E-Mail</Label>
<Input id="email" type="email" error={!!errors.email} />

// Alert (success, error, warning, info)
<Alert variant="error" title="Fehler">Bitte füllen Sie alle Pflichtfelder aus.</Alert>

// Loading state
<Button disabled><Spinner size="sm" aria-label="Wird gesendet" /> Absenden</Button>

// Modal
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Cookie-Einstellungen">
  ...
</Modal>
```

### Environment variables

Your site must set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (e.g. `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (e.g. `2024-01-01`)
- Optional: `NEXT_PUBLIC_DEFAULT_SITE_HOSTNAME` for fallback site
- Optional: `ALLOWED_SITE_HOSTNAMES` (comma-separated, e.g. `example.de,www.example.de`) to allow only trusted hostnames in middleware

Cookie consent is stored in both `localStorage` and a first-party cookie (`drk_cookie_consent_v1`) so consuming apps can read consent server-side before loading optional services. Consent is refreshed after 12 months (banner is shown again when stored consent is older than the retention window).

## Fonts (GDPR/DSGVO)

Fonts are not included in the package. Place Merriweather (and any other) font files in your app's `public/fonts/` and ensure `globals.scss` (or `_fonts.scss`) is loaded so `url('/fonts/...')` resolves correctly.

## Versioning

This package follows semantic versioning (semver). When you publish a new version, consuming apps can update manually or use automated dependency updates.

### Publishing

Publishing is intentionally explicit: trigger the publish workflow manually (`workflow_dispatch`) or via a GitHub release. The workflow no longer auto-bumps versions on every push to `main`. Update `package.json` first, then publish.

## Security

See `SECURITY.md` for vulnerability reporting and disclosure process.

### Automated updates in consuming apps (Dependabot or Renovate)

**Do I need to do anything now? What’s the workflow?**

- **Yes, one-time setup per app** (including **drk-app-template**): add the Dependabot config once (see below). After that, when you publish a new version of the design system, GitHub will open a PR in that repo to bump `@drk/design-system`. You review and merge; no manual version hunting.
- **New projects** (e.g. from **drk-app-template**): put the Dependabot config **into drk-app-template**. Every app you create from that template will then get automatic PRs for design system updates. You don’t have to do anything per new project.
- **Updating drk-app-template itself**: Add `.github/dependabot.yml` to drk-app-template (copy from this repo’s `templates/dependabot.consuming-app.yml`). When you release a new design system version, Dependabot will open a PR in drk-app-template to update the dependency; merge it and the template is updated. New apps you create from the template after that will start with the latest design system version.

**Summary:** One-time: add Dependabot config to each consuming repo (including drk-app-template). From then on: you publish design system → Dependabot opens PRs in those repos → you merge → done.

**One-time setup for drk-app-template (and any other consuming app):**

1. In the app repo (e.g. `drk-app-template`), create `.github/dependabot.yml`.
2. Copy the contents from this repo’s **`templates/dependabot.consuming-app.yml`** (or from the YAML block below).
3. Commit and push. Dependabot will run on the schedule (e.g. weekly) and open a PR when a new `@drk/design-system` version exists.

---

Consuming apps can get automatic pull requests when a new version of `@drk/design-system` is published. Two common options:

**Option 1: Dependabot** (built into GitHub)

Copy the example config from this repo into your consuming app:

```bash
mkdir -p .github
cp node_modules/@drk/design-system/templates/dependabot.consuming-app.yml .github/dependabot.yml
```

Or create `.github/dependabot.yml` in the **consuming app’s repo** with:

```yaml
# .github/dependabot.yml (in your Next.js / consuming app repo)
version: 2
updates:
  # npm dependencies (includes @drk/design-system)
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    # Optional: group design system updates with a clear PR title
    groups:
      design-system:
        patterns:
          - "@drk/design-system*"
        update-types:
          - "minor"
          - "patch"
```

- Full example file in this repo: **`templates/dependabot.consuming-app.yml`** (copy to your app’s `.github/dependabot.yml`).
- Dependabot will open PRs when it finds a newer version on the registry (e.g. GitHub Packages).
- Ensure the app can resolve the package (e.g. `.npmrc` with `@drk:registry=https://npm.pkg.github.com` and auth if the package is private).

**Option 2: Renovate** (GitHub App: [renovateapp.com](https://www.renovate.com))

In the **consuming app’s repo**, add a config file. Example `renovate.json` in the repo root:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "schedule": ["before 10am on monday"],
  "packageRules": [
    {
      "matchPackagePatterns": ["^@drk/design-system"],
      "groupName": "drk-design-system",
      "schedule": ["at any time"]
    }
  ]
}
```

Or enable Renovate on the repo via GitHub; it will propose this (or a minimal) config. The rule above groups `@drk/design-system` updates into a single PR and can check “at any time” so you get PRs soon after you publish.

**Summary**

| Tool        | Config location              | What it does |
|------------|-----------------------------|--------------|
| Dependabot | `.github/dependabot.yml`    | Opens PRs when newer versions of npm deps (including `@drk/design-system`) exist. |
| Renovate   | `renovate.json` or GitHub UI | Same idea; more options (grouping, scheduling, labels). |

After you merge the PR in the consuming app, run `npm install` (or your CI does it) and the app will use the new design system version.
