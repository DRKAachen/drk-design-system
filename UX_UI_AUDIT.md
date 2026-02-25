# UX/UI Audit - `@drk/design-system`

## Current State

- **Overall maturity:** medium
- **Strengths:** consistent DRK visual language, keyboard-visible focus styles, responsive navigation shell, and skip-link support in layout styles.
- **Main gaps:** modal accessibility behavior is incomplete, consent UX is binary, and some form semantics can cause unstable/unclear screen reader behavior.

## Findings (Prioritized)

### High

1. **Modal lacks focus trap and focus return**
   - Location: `components/Modal/Modal.tsx`
   - Why this matters: keyboard/screen-reader users can tab outside dialog, and focus may be lost after close.
   - What to do:
     - Implement focus trap while open.
     - Move initial focus into modal (title/close/first focusable).
     - Restore focus to trigger element on close.

2. **Generated IDs via `Math.random()` can break stable a11y links**
   - Location: `components/Checkbox/Checkbox.tsx`, `components/Label/Label.tsx`, `components/Radio/Radio.tsx`
   - Why this matters: unstable IDs can cause hydration mismatch and inconsistent `aria-describedby`/`htmlFor` targeting.
   - What to do:
     - Replace with React `useId()` for deterministic IDs.

### Medium

3. **Cookie consent interaction is only two-button decision**
   - Location: `components/CookieBanner/CookieBanner.tsx`
   - Why this matters: users cannot review category details inline, reducing transparency and perceived control.
   - What to do:
     - Add “Customize” path with category toggles and short explanations.

4. **Navigation submenu accessibility can be improved**
   - Location: `components/Navigation/Navigation.tsx`
   - Why this matters: current submenu logic supports basic interaction, but lacks richer ARIA relationships and arrow-key navigation patterns expected in complex menus.
   - What to do:
     - Add `aria-controls`/submenu IDs for explicit relationships.
     - Add arrow/home/end keyboard interactions for submenu traversal.

5. **Global link default removes underlines**
   - Location: `styles/_reset.scss`
   - Why this matters: non-underlined text links can reduce discoverability, especially in dense copy and for low-vision users.
   - What to do:
     - Keep underlines by default in text content, remove only where links are clearly button/nav elements.

### Low

6. **Motion reduction support is missing for spinner animation**
   - Location: `components/Spinner/Spinner.module.scss`
   - What to do:
     - Add `@media (prefers-reduced-motion: reduce)` to reduce/disable rotation.

## Recommended Action Plan

- **Sprint 1:** modal focus management and deterministic IDs.
- **Sprint 2:** cookie preference center and improved menu keyboard model.
- **Sprint 3:** global link visibility refinements and reduced-motion support.

