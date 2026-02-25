# Privacy Audit (DSGVO/GDPR) - `@drk/design-system`

## Current State

- **Overall maturity:** medium
- **Strengths:** cookie choices default to non-essential denied, self-hosted font guidance, and legal links are built into footer patterns.
- **Main gaps:** consent is client-only (`localStorage`), no explicit proof/audit mechanism for consent events, and no explicit transfer/compliance guidance for Sanity-backed processing.

## Findings (Prioritized)

### High

1. **Consent state is not available server-side**
   - Location: `lib/cookies/consent.ts`, `components/CookieBanner/*`
   - Why this matters (DSGVO/GDPR): with localStorage-only consent, SSR/server middleware cannot reliably block non-essential scripts before page render.
   - What to do:
     - Store consent in a signed first-party cookie in addition to localStorage.
     - Expose helper to read consent in middleware/server components and gate trackers there.

2. **No structured consent proof trail**
   - Location: current consent model
   - Why this matters: GDPR accountability often requires being able to demonstrate what the user chose and when.
   - What to do:
     - Add optional consent event callback hook (consuming app decides whether/how to log).
     - Store policy/version with consent object (for legal text versioning).

### Medium

3. **“Change settings” flow is reset-only, not granular**
   - Location: `components/CookieBanner/CookieSettingsLink.tsx`
   - Why this matters: users can reopen banner, but cannot directly edit per category in a dedicated settings modal.
   - What to do:
     - Add a full preference center UI (necessary locked, others toggleable).
     - Persist explicit category-level choices.

4. **Cross-border transfer guidance is missing for Sanity usage**
   - Location: docs and architecture (`lib/sanity/*`)
   - Why this matters: if personal data enters CMS content or forms, international transfer/legal basis documentation is required.
   - What to do:
     - Document required DPA/SCC checks for Sanity and hosting providers.
     - Add a privacy checklist for consuming apps before go-live.

5. **No data retention recommendation for consent metadata**
   - Location: consent model/docs
   - Why this matters: GDPR storage limitation principle expects retention boundaries.
   - What to do:
     - Define retention period (for example 6-24 months depending on legal advice).
     - Add consent refresh logic after retention threshold.

### Low

6. **Legal baseline pages are linked but not enforced**
   - Location: `components/Footer/Footer.tsx`
   - Why this matters: consumers can still publish without complete legal content.
   - What to do:
     - Add a docs checklist requiring `Impressum`, `Datenschutz`, consent text, and cookie categories.

## Risk Trade-Offs Requiring Your Approval

To become closer to strict GDPR accountability, the following add notable effort:

1. **Server-readable consent cookie + middleware gating** (medium implementation effort, high compliance gain)
2. **Versioned consent proof logging hook** (medium effort, high legal defensibility)
3. **Granular preferences center UI** (medium effort, medium-high user trust/compliance gain)

Please confirm if you want these implemented now, or if we should accept temporary risk with documented mitigation.

