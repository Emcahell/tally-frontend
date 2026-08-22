# SvelteKit Framework Rules

Read this BEFORE using SvelteKit features. Also applies Svelte rules from `frameworks/svelte.md`.

---

## File Conventions (MUST respect)

| File | Runs on | Purpose |
|---|---|---|
| `+page.server.ts` | Server only | Data loading, form actions, server-only logic |
| `+layout.server.ts` | Server only | Shared server data |
| `+page.ts` | Server + Client | Universal load (use only when necessary) |
| `+server.ts` | Server only | API endpoints |
| `+page.svelte` | Client | Route UI |
| `+layout.svelte` | Client | Shared UI |
| `+error.svelte` | Client | Error boundary |

NEVER import server-only modules into client code. ALWAYS provide root `+error.svelte`.

## Data Loading (MUST understand)

- **Server load** (`+page.server.ts`): preferred. Direct DB, `fetch`, secrets — all fine.
- **Universal load** (`+page.ts`): only when data must run on both sides.
- Access via `data` prop — NEVER re-fetch what `load` provided.

## Form Actions (SHOULD — idiomatic mutations)

- Type-safe via `$types`.
- Progressive enhancement.
- Named actions for multi-action forms.
- Validate with Zod server-side.

## Data Invalidation (MUST)

After mutations: `invalidate()`/`invalidateAll()`. NEVER manually reassign loaded data.

## Server-Only Code (MUST)

- `$lib/server/` for server-only modules (auto-excluded from client).
- Extract logic from `+page.server.ts` into `$lib/server/` for testability.

## Security (MUST)

- Authorization in load functions and form actions.
- NEVER trust client-side route guards.
- Secrets in `$env/static/private` or `$env/dynamic/private`.
