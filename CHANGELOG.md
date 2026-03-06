# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.1]: https://github.com/DRKAachen/drk-design-system/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/DRKAachen/drk-design-system/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/DRKAachen/drk-design-system/releases/tag/v1.0.1
