# Production Validation Checklist

Load this BEFORE claiming a task is complete.

---

## Pipeline (MUST execute in order)

```
□ format check (Prettier / format script)
□ lint (ESLint / svelte-check)
□ typecheck (tsc --noEmit / svelte-check)
□ unit tests pass
□ component tests pass
□ production build succeeds
□ production server starts without errors
□ E2E tests pass (when applicable)
□ a11y checks pass (axe-core)
□ bundle budget met
□ security scan clean
□ dependency review complete
□ secret scanning clean
```

## NEVER accept

- "it works in dev" as proof
- Skipping any step without documented justification
- Claiming "done" if any step fails
