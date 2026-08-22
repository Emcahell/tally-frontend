# Testing Reference

Read this BEFORE writing tests, setting up test infrastructure, or modifying the test pipeline.

---

## Philosophy (MUST)

**Test behavior, not implementation.** Tests MUST verify what the code does, not how it does it.

## Anti-patterns (AVOID)

- Tests that only check "component exists"
- Tests that assert on class names, div structure, or implementation details
- Tests with zero real assertions
- High coverage with no meaningful assertions

## Testing Pyramid

- **Unit:** hooks, utilities, runes, business logic (Vitest/Jest)
- **Component:** user-visible behavior (Testing Library / `@testing-library/svelte`)
- **E2E:** critical user flows (Playwright)

## Priority (SHOULD test first)

1. Critical business logic
2. Authentication / authorization
3. Form submissions and validation
4. Error handling and edge cases
5. Loading states and mutations
6. Navigation
7. Accessibility
8. Regression-prone areas

## Production Testing Pipeline (MUST)

```
format check → lint → typecheck → unit → component → build → production server → E2E → a11y → bundle budget → security → dependency review → secret scanning
```

NEVER accept: "it works in dev" as proof of correctness.

## SvelteKit-Specific (SHOULD)

- Extract business logic to `$lib/server/` for unit testing (Vitest).
- E2E with Playwright against running SvelteKit dev server.
- Test form actions as pure functions where possible.
