# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2026-03-10

### Fixed

- Reverted jsdom from ^28.1.0 to ^26.0.0 — jsdom 28 has known compatibility issues with Vitest 4.x causing test failures in CI
- CI workflow now uses `npm ci` instead of `npm install` for stricter, reproducible dependency resolution

## [1.2.0] - 2026-03-10

### Added

- `DrkLogo` component: renders the official DRK circular emblem (red cross with "DEUTSCHES ROTES KREUZ" text)
- Official DRK logo shipped as `assets/drk-logo.png` for consuming apps to place in their public directory
- Header now renders the DRK emblem alongside the site name when no custom `logoUrl` is provided
- New shadow tokens `$shadow-card` and `$shadow-card-hover` for modern card-based layouts
- New `$radius-2xl` token (1.25rem) for larger rounded corners
- Alert `titleAs` prop for semantic heading levels (h2–h6) to improve screen-reader heading navigation
- Radio `groupLabel` prop for accessible radio group naming
- Spinner `aria-hidden` prop to prevent double announcements when used inside labeled buttons
- CookieBanner focus trap: keyboard users cannot Tab away without making a consent choice (DSGVO/TTDSG)

### Changed

- Heading colors changed to brand red (`$drk-rot` #e60005) — WCAG AA compliant for large text (>=18pt, 3:1 ratio). For small body text needing red, use `$drk-rot-text` (#c20004) instead
- Modernized design tokens: increased default border-radius (`$radius-sm` from 0.25rem to 0.375rem), refined shadow scale for softer, more contemporary elevations
- Button styles: added subtle box-shadow for depth, active press feedback, smooth hover transitions, increased border-radius to `$radius-md`
- Form inputs (Input, Textarea, Select): reduced border to 1.5px, increased border-radius to `$radius-md`
- Alert and Modal: increased border-radius for consistency with updated design tokens
- Footer: subtle gradient background, refined link styling
- CookieBanner: `aria-modal="true"` and focus trap for DSGVO-compliant consent flow; buttons and preferences panel use `$radius-md`
- Header: upgraded shadow from `$shadow-sm` to `$shadow-md`, site name uses `$drk-dunkelblau` for brand consistency
- Showcase: redesigned with dark navy hero section, card-based section layout with hover shadows, light background

### Fixed

- Corrected German Umlaute throughout the showcase: "Menues" → "Menüs", "fuer" → "für", "Zugaengliche" → "Zugängliche", "waehlen" → "wählen", "pruefen" → "prüfen", "gross" → "groß", "oeffnen" → "öffnen", "Schliessen" → "Schließen", "Auswahlmoeglichkeiten" → "Auswahlmöglichkeiten", "spaeterem" → "späterem"
- Removed incorrect `aria-required`, `aria-invalid`, `aria-describedby` from `<label>` element (they belong on the input)
- Removed redundant `role="document"` from Modal inner element

## [1.1.2] - 2026-03-06

### Added

- Self-hosted Open Sans font via `@fontsource/open-sans` (DRK styleguide body font fallback)
- Open Sans inserted into font stack: Helvetica Neue → Open Sans → Helvetica → Arial → sans-serif

## [1.1.1] - 2026-03-06

### Fixed

- Publish workflow tolerates already-published versions to prevent cascading failures
- CI concurrency group cancels superseded runs automatically
- Showcase dependencies installed before audit in CI

## [1.1.0] - 2026-03-05

### Added

- `hasConsent(category)` and `hasAllConsent(categories)` helpers for consent enforcement (DSGVO D1)
- `onConsentChange(callback)` for server-side consent audit logging (DSGVO D2)
- `clearConsentData()` for DSGVO Art. 17 right to erasure (D5)
- `getConsentDataForExport()` for DSGVO Art. 20 data portability (D6)
- `securityHeaders()` and `applySecurityHeaders()` CSP utility (S2)
- `lockBodyScroll()` / `unlockBodyScroll()` iOS-safe scroll lock (A8)
- ESLint with TypeScript, React, React Hooks, jsx-a11y, and Prettier integration (C1, C2)
- Prettier for consistent formatting (C2)
- Husky + lint-staged for pre-commit quality gates (C4)
- Component tests with @testing-library/react (C3)
- Vitest configuration with jsdom (C3)
- `prefers-reduced-motion` support globally and per-component (A3)
- `prefers-color-scheme: dark` basic dark mode tokens and styles (A10)
- WCAG-safe `$color-text-accent` / `$drk-rot-text` token for small text (A1)
- Alert `onDismiss` callback with close button (A5)
- Select `allowEmpty` prop (A9)
- CookieBanner `categoryDescriptions` prop for per-category labels (D7)
- `REOPEN_CONSENT_EVENT` custom event for banner reopen flow (D8)
- Showcase audit step in CI (S6)
- Publish workflow environment protection (`npm-publish` environment) (S7)
- `TRUST_PROXY` env var requirement for x-forwarded-host trust (S1)

### Changed

- CookieSettingsLink now reopens banner with pre-filled prefs instead of clearing (D8/A6)
- Middleware strips incoming x-site-id/x-site-hostname before setting them (S4)
- Console warnings gated behind `NODE_ENV === 'development'` (S5/C10)
- Heading colors use WCAG-compliant `$color-text-accent` instead of `$drk-rot` (A1)
- Showcase uses `next.config.ts` instead of CommonJS (C12)
- Cookie banner preferences panel uses CSS transition instead of conditional rendering (A7)
- Modal and Navigation use iOS-safe scroll lock (A8)

### Fixed

- Navigation uses stable keys (`item.href`) instead of array index (C7)
- Footer uses stable keys (`link.href`) instead of index-based (C8)
- Removed redundant `role="navigation"` from `<nav>` (A4)
- Radio uses `opt.value` as key instead of `opt.value + index` (C7)
- Fixed `any` type on `SiteConfig.logo` in content-sanity (C5)
- Form components properly support `aria-describedby` prop (A2)
- Added `displayName` to all forwardRef components (C9)
- Cookie size limit check prevents oversized payloads (S11)

## [1.0.1] - 2025-01-01

Initial public release.

[1.2.1]: https://github.com/DRKAachen/drk-design-system/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/DRKAachen/drk-design-system/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/DRKAachen/drk-design-system/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/DRKAachen/drk-design-system/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/DRKAachen/drk-design-system/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/DRKAachen/drk-design-system/releases/tag/v1.0.1
