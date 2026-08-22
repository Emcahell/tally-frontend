# Definition of Done

Load this WHEN verifying completion of any task.

---

## MUST verify

```
□ Requirements implemented (what was asked is delivered)
□ Architecture reviewed (consistent with existing patterns)
□ Typecheck passes
□ Lint passes
□ Tests pass
□ Production build passes
□ E2E passes (when applicable — critical user flows)
□ Accessibility checked (semantic HTML, keyboard, a11y where relevant)
□ Security checked (no secrets, no XSS, server-side validation)
□ Performance checked (no regressions, bundle not bloated)
□ SEO checked (when applicable — public pages)
□ Dependencies reviewed (no unnecessary additions)
□ No unused code (no dead imports, no leftover debug code)
□ No debug code (no console.log, no TODO hacks, no debugger)
□ Git diff reviewed (only intended changes, no accidental modifications)
```

## Critical rule

The agent MUST NOT claim completion if required validation was skipped.
