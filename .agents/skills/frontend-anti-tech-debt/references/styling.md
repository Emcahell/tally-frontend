# Styling Reference

Read this BEFORE choosing a styling approach, creating design tokens, or modifying the CSS architecture.

---

## Approach (SHOULD)

- **One primary styling system per project** (Tailwind, CSS Modules, vanilla-extract, etc.).
- **Justified exceptions are allowed:** third-party library styles, global CSS requirements, browser/platform constraints, isolated component overrides.
- Prefer compile-time CSS (zero runtime cost) over runtime CSS-in-JS.

## Svelte Scoped Styles

`<style>` block in `.svelte` files is automatically scoped — a major anti-tech-debt feature. Use as default. `:global()` only for truly global styles.

## Design Tokens (SHOULD)

Define tokens for:
- Colors (primary, secondary, semantic: success, warning, error, info)
- Spacing scale
- Typography (families, sizes, weights, line heights)
- Border radii
- Shadows
- Motion (durations, easings)
- Breakpoints
- Z-index scale

NEVER allow arbitrary repeated values (e.g., `margin: 17px`, `margin: 19px`, `margin: 23px`) without a design reason.

## Anti-patterns

- No inline styles for layout/styling.
- No magic numbers.
- No mixing of styling approaches without justification.
