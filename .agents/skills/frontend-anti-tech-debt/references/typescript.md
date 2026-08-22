# TypeScript Reference

Read this BEFORE configuring TypeScript, typing complex data, or fixing type errors.

---

## Rules (MUST)

- `strict: true` always. **[enforceable]**
- **No `any`.** Use `unknown` + narrowing.
- **No `as SomeType`** to hide errors. Prefer narrowing or Zod parsing.
- **No `@ts-ignore`/`@ts-expect-error`** without a comment referencing the issue. **[enforceable]**
- Model runtime boundaries with Zod: API responses, form inputs, env vars.
- Use **discriminated unions** for multi-state values.
- Use `satisfies` for typed literals.
- Prefer readonly types where applicable.

## Evaluate Enabling (SHOULD — when compatible)

- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `noImplicitOverride`
- `noFallthroughCasesInSwitch`
- `useUnknownInCatchVariables`

## SvelteKit Types (MUST)

Use `$types` (generated from route files) for props, load functions, and actions. Never hand-type route data. **[enforceable: svelte-check]**
