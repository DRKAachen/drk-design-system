# Implementation Backlog (From Audits)

## P1 - Immediate (Implemented in this pass)

- [x] Add consent cookie persistence in addition to localStorage for better DSGVO/GDPR enforceability (`lib/cookies/consent.ts`).
- [x] Add server-side helper to read consent from request cookie header (`lib/cookies/consent.ts`).
- [x] Clear consent cookie when reopening cookie settings (`components/CookieBanner/CookieSettingsLink.tsx`).
- [x] Harden hostname parsing and add optional allowlist gate via `ALLOWED_SITE_HOSTNAMES` (`middleware.ts`, `lib/site.ts`).
- [x] Replace random form IDs with deterministic React `useId()` to avoid hydration/a11y instability (`components/Checkbox/Checkbox.tsx`, `components/Label/Label.tsx`, `components/Radio/Radio.tsx`).
- [x] Add modal focus management improvements: initial focus, tab trapping, and focus restore on close (`components/Modal/Modal.tsx`).
- [x] Replace custom regex sanitizer with maintained sanitizer library setup (`lib/sanitize.ts`, `package.json`).
- [x] Add baseline package quality script (`typecheck`) (`package.json`).

## P2 - Next Sprint

- [x] Add automated tests for sanitizer payloads and consent state transitions.
- [x] Add menu keyboard refinements (arrow/home/end and explicit submenu `aria-controls` wiring).
- [x] Add cookie preference center UI with per-category toggles and policy version in stored consent.
- [x] Document trusted proxy/header setup and hostname allowlist usage for consumers.

## P3 - Hardening / Ops

- [x] Add CI quality gates (`typecheck`, tests, dependency audit) before release.
- [x] Move package publishing from push-based automatic patch bump to explicit release trigger.
- [x] Add `SECURITY.md` disclosure policy and support window.
- [x] Introduce retention/refresh policy for consent metadata in docs.

