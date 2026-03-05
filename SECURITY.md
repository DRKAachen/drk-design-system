# Security Policy

## Supported Versions

Security updates are provided for the latest published major versions of:

- `@drkaachen/design-system-ui`
- `@drkaachen/content-sanity`
- `@drkaachen/next-site-runtime`

| Version | Supported |
| --- | --- |
| Latest major | yes |
| Older majors | no |

## Reporting a Vulnerability

Please do **not** open public GitHub issues for security vulnerabilities.

- Report via GitHub Security Advisories (preferred): `https://github.com/DRKAachen/drk-design-system/security/advisories/new`
- If advisory submission is not possible, open a minimal issue asking for a private contact channel (without sharing exploit details).
- Include:
  - affected package version
  - clear reproduction steps or proof-of-concept
  - impact assessment (confidentiality/integrity/availability)
  - suggested fix (optional)

## Response Targets

- Initial acknowledgement: within **2 business days**
- Triage + severity classification: within **5 business days**
- Target patch for high/critical issues: within **14 business days**

## Disclosure Process

- We validate and reproduce the report.
- A fix is prepared and reviewed privately.
- A patched version is published.
- A coordinated disclosure note is published after remediation.

## Security Baseline

- **CI quality gates:** Type checks, ESLint (including jsx-a11y), tests, and `npm audit` run on every PR and push to main. Showcase dependencies are audited separately.
- **Publish protection:** The npm publish workflow requires the `npm-publish` GitHub environment with required reviewers.
- **HTML sanitization:** Uses `sanitize-html` with strict allowlists. Unsafe protocols (`javascript:`, `data:`, `vbscript:`) are blocked. External links receive `rel="noopener noreferrer"`.
- **Cookie consent:** Supports client- and server-side enforcement paths. `hasConsent()` utility for gating functionality. `SameSite=Lax`, conditional `Secure` flag, `encodeURIComponent` serialization.
- **Security headers:** `securityHeaders()` utility provides recommended CSP, HSTS, X-Frame-Options, and other headers for consuming apps.
- **Middleware hardening:** `x-forwarded-host` is only trusted when `TRUST_PROXY=true`. Incoming `x-site-id`/`x-site-hostname` headers are stripped before setting. Hostname allowlist via `ALLOWED_SITE_HOSTNAMES`.
- **Pre-commit hooks:** Husky + lint-staged enforce linting and formatting before commits reach the repo.
- **Dependency automation:** Dependabot monitors npm and GitHub Actions dependencies weekly.
- **npm provenance:** Packages are published with `--provenance` for supply-chain verification.
- **No external resources:** Fonts are self-hosted. No CDN links, analytics, or third-party scripts in the library.
