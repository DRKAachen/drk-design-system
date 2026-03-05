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

## Security Configuration

When deploying behind a reverse proxy (e.g. nginx, Cloudflare, AWS ALB), additional configuration is required to ensure secure header handling.

### TRUST_PROXY

Set `TRUST_PROXY=true` in your environment when the application runs behind a reverse proxy. This tells the middleware to trust the `x-forwarded-host` header for hostname resolution instead of relying solely on the `Host` header.

**Without `TRUST_PROXY=true`**, the middleware ignores `x-forwarded-host` entirely, which means hostname resolution may fail or resolve incorrectly when behind a proxy.

### ALLOWED_SITE_HOSTNAMES

Set `ALLOWED_SITE_HOSTNAMES` to a comma-separated list of hostnames that your deployment serves. This acts as a strict allowlist — any request whose resolved hostname does not match the list is rejected.

```
ALLOWED_SITE_HOSTNAMES=www.example.de,example.de,staging.example.de
```

In production, always set this variable to prevent host-header injection attacks.

### Header stripping

The middleware strips any incoming `x-site-id` and `x-site-hostname` headers before processing the request and setting its own values. This prevents upstream clients or attackers from spoofing site identity by injecting these headers into requests.

### Reverse proxy requirements

Your reverse proxy **must** be configured to strip the `x-forwarded-host` header from untrusted client requests before forwarding them to the application. If untrusted clients can set `x-forwarded-host` and `TRUST_PROXY=true` is enabled, they could influence hostname resolution.

Example nginx configuration:

```nginx
proxy_set_header X-Forwarded-Host $host;
```

This overwrites any client-supplied `X-Forwarded-Host` with the actual host, preventing spoofing.
