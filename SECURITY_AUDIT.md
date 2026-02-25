# Security Audit - `@drk/design-system`

## Current State

- **Overall maturity:** medium
- **Strengths:** strict TypeScript mode, constrained external dependencies, `rel="noopener noreferrer"` on external CTA links, and a dedicated sanitizer utility for CMS HTML.
- **Main risks:** custom sanitizer robustness, trust of request `Host` header for site resolution, missing automated security checks in CI/CD, and release automation publishing every main-branch source change.

## Findings (Prioritized)

### High

1. **Custom regex-based sanitizer can be bypassed by edge-case HTML payloads**
   - Location: `lib/sanitize.ts`, used in `components/BlockRenderer/BlockRenderer.tsx`
   - Why this matters: regex sanitizers are historically fragile against malformed tags/attributes and browser parsing quirks. This can create XSS risk if CMS input is attacker-controlled.
   - What to do:
     - Replace with a maintained sanitizer library (for example `isomorphic-dompurify`) with strict allowlist config.
     - Add regression tests for malicious payloads and lock expected output.

2. **Hostname trust boundary is weak in middleware/site resolution**
   - Location: `middleware.ts`, `lib/site.ts`
   - Why this matters: directly reading `host` from request headers can be abused in misconfigured proxy/CDN setups, potentially causing wrong tenant/site routing decisions.
   - What to do:
     - Prefer trusted forwarded host headers from your edge/proxy configuration.
     - Validate hostname against an allowlist from CMS or env before querying.
     - Reject/ignore unknown hostnames early.

### Medium

3. **No reproducible dependency lockfile**
   - Location: repository root (no `package-lock.json`)
   - Why this matters: dependency tree can drift between environments, increasing supply-chain unpredictability.
   - What to do:
     - Commit lockfile and enforce `npm ci` locally and in CI.

4. **No automated dependency/vulnerability gate in workflow**
   - Location: `.github/workflows/publish.yml`
   - Why this matters: publish pipeline can ship vulnerable transitive deps without blocking checks.
   - What to do:
     - Add `npm audit --production` (or equivalent policy scanner) before publish.
     - Add SAST/lint/typecheck/test jobs as required status checks on `main`.

5. **Auto-release on any source push to main increases blast radius**
   - Location: `.github/workflows/publish.yml`
   - Why this matters: every direct merge to `main` becomes a published package version automatically.
   - What to do:
     - Gate publishing via manual release tags or a dedicated release workflow.
     - Keep main protected with required reviews and checks.

### Low

6. **Missing explicit security policy/process docs**
   - Location: repo docs
   - Why this matters: external teams need clear disclosure and patch process.
   - What to do:
     - Add `SECURITY.md` (reporting channel, support window, response SLA).

## Recommended Action Plan

- **Week 1 (critical):** replace sanitizer + add security tests for XSS payload corpus.
- **Week 2:** harden hostname trust/validation path and add guardrails in middleware.
- **Week 3:** introduce lockfile, CI security gates, and protected release strategy.
- **Week 4:** publish `SECURITY.md` and threat-model notes for consumers.

