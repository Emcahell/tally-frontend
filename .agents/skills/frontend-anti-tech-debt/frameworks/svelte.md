# Svelte Framework Rules

Read this BEFORE using Svelte runes or patterns. Applies to Svelte 5.

---

## Runes Over Stores (SHOULD)

Prefer `$state`/`$derived`/`$effect` over Svelte stores. Stores are legacy — prefer runes for new code.

## Reactivity Model (MUST understand)

**`$state`:** deeply reactive by default. `$state.raw` for large non-mutating data (avoids proxy cost). Destructuring breaks reactivity.

**`$derived`:** computed state. NEVER use `$effect` to derive values — use `$derived`/`$derived.by` instead. Supports temporary overrides (optimistic UI).

**`$effect`:** side effects ONLY. NEVER update state inside `$effect` — leads to infinite loops. Use for DOM manipulation, subscriptions, network requests.

**`$props`:** component inputs. `$bindable()` for two-way parent-child binding.

## Component Architecture

- Same size rules as `references/architecture.md`.
- Actions (`use:`) for reusable DOM behavior: focus, keyboard, drag-and-drop.
- `$bindable` for clean two-way communication instead of callback props.

## Styling

`<style>` block is automatically scoped. `:global()` only when truly needed.

## TypeScript (MUST)

- `strict: true`. `svelte-check` for type errors, a11y warnings, runes misuse. **[enforceable]**

## Testing

- `@testing-library/svelte` for component tests.
- Vitest for unit tests.
- Playwright for E2E.
