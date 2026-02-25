# Code Quality Audit - `@drk/design-system`

## Current State

- **Overall maturity:** medium
- **Strengths:** clear project structure, concise component boundaries, SCSS tokenization, and generally readable code.
- **Main gaps:** no test suite, no lint/format/typecheck scripts in package metadata, some type and API design inconsistencies, and release process tightly coupled to source pushes.

## Findings (Prioritized)

### High

1. **No automated tests in repository**
   - Location: repo-wide (no test files detected)
   - Why this matters: regressions in sanitizer, consent logic, and accessibility behavior are likely to ship unnoticed.
   - What to do:
     - Add unit tests for `lib/sanitize.ts`, `lib/cookies/consent.ts`, and `lib/site.ts`.
     - Add component tests for modal/nav/cookie/form accessibility states.

2. **Quality gates are not encoded as package scripts**
   - Location: `package.json`
   - Why this matters: contributors and CI lack standard commands for lint/typecheck/test.
   - What to do:
     - Add scripts: `lint`, `typecheck`, `test`, `build:check`.
     - Run these in PR checks before merge/publish.

### Medium

3. **Type safety gaps (`any`, broad object typing)**
   - Location: `lib/site.ts` (`logo?: any`), `lib/blocks.ts` (`SanityBlockImageSource = object`)
   - Why this matters: weak types make runtime issues more likely and reduce maintainability.
   - What to do:
     - Replace with stricter Sanity image/reference types.
     - Add explicit interfaces for CMS-driven structures.

4. **Duplicate date formatting logic**
   - Location: `lib/utils.ts` and `components/LegalPage/LegalPage.tsx`
   - Why this matters: duplicated formatting logic can diverge over time.
   - What to do:
     - Reuse shared `formatDate` util across components.

5. **Potentially brittle internal SCSS import strategy**
   - Location: `styles/_mixins.scss`
   - Why this matters: `@use '@drk/design-system/styles/variables'` inside the package itself can complicate local tooling and bundler resolution.
   - What to do:
     - Use relative imports internally, reserve package-path imports for consumers.

6. **Package publish surface is TypeScript source-first**
   - Location: `package.json` (`main`/`types` pointing to `index.ts`)
   - Why this matters: works in modern Next transpile setups but can break in non-Next consumers and limits portability.
   - What to do:
     - Consider build output (`dist`) with generated `.d.ts` for broader compatibility.

### Low

7. **Release workflow mutates version automatically on source push**
   - Location: `.github/workflows/publish.yml`
   - Why this matters: operationally simple, but tightly couples merge activity with package versioning and can create noisy releases.
   - What to do:
     - Move to explicit release trigger (tag/manual dispatch) with changelog discipline.

## Recommended Action Plan

- **Phase 1:** add scripts + baseline tests (sanitizer/consent/site).
- **Phase 2:** improve types and remove duplicated logic.
- **Phase 3:** harden release engineering and optionally add `dist` build publishing.

