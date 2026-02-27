# @drkaachen/next-site-runtime

Optional Next.js runtime helpers for DRK multi-site apps.

This package contains:
- Next middleware for hostname-based site resolution
- request header propagation (`x-site-id`, `x-site-hostname`)
- helper functions to read site headers in Next server contexts

## When to use

Use this package if your app needs centralized multi-site hostname handling in middleware.

If your app does not need middleware/site routing features, do not install this package.

## Installation

```bash
npm install @drkaachen/next-site-runtime
```

This package expects `@drkaachen/content-sanity` to be available for site lookup.

## Middleware Setup

Create a `middleware.ts` file in your consuming app root:

```ts
export { middleware, config } from '@drkaachen/next-site-runtime/middleware'
```

## Runtime Helpers

```ts
import {
  getSiteIdFromHeaders,
  getSiteHostnameFromHeaders,
  getSiteHostname,
} from '@drkaachen/next-site-runtime'
```

## Environment Variables

Optional but recommended for hardened deployments:
- `ALLOWED_SITE_HOSTNAMES` (comma-separated allowlist, e.g. `example.de,www.example.de`)

Behavior:
- if `ALLOWED_SITE_HOSTNAMES` is set, only listed hostnames are accepted
- if not set, all normalized hostnames are allowed

## Request Flow

1. Middleware reads incoming host headers
2. Hostname is normalized and validated
3. Site is loaded via `@drkaachen/content-sanity`
4. Site headers are attached to the forwarded request

## Boundaries

- Keep framework/runtime concerns here, not in UI package.
- Keep CMS query/client concerns in `@drkaachen/content-sanity`.
- Keep presentational components and styles in `@drkaachen/design-system-ui`.

## Security Notes

- Use explicit hostname allowlists in production to reduce host-header abuse risks.
- Do not trust forwarded host headers without normalization and allowlist checks.
