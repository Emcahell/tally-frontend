---
name: frontend-anti-tech-debt-state-and-data
description: "State management, data fetching, mutations, cache architecture, optimistic updates"
---

# State and Data Management

## State Categories

### 1. Local State
- Component-specific state
- `useState` / `useReducer` (React)
- `$state` / `$state.raw` (Svelte runes)
- UI state: modals, forms, toggles, selected items

### 2. Server State
- Data from APIs / databases
- Managed by server (Server Components) or server-state library
- Has its own lifecycle: loading, fresh, stale, error
- May be cached, invalidated, refetched

### 3. Cross-Route Client State
- Genuinely shared client-only state
- Examples: theme, language preference, notification queue
- Use sparingly — most "global" state is actually server-derived

## Source of Truth

Every important piece of information MUST have a clear source of truth.

### Anti-Pattern: Duplicated State
```typescript
// ❌ Server data + Redux copy + local state copy = confusion
const userFromServer = useQuery('user', fetchUser);
const userInRedux = useSelector(state => state.user);
const localUser = useState(userFromServer);
// Which one is current? When does each update?
```

```typescript
// ✅ Single source of truth
const { data: user } = useQuery('user', fetchUser);
// Use `user` directly — no copies
```

## Proportional State Modeling

**Model states relevant to the operation and its failure modes.** Don't apply a universal state checklist.

### GET Collection (list of items)
```
loading → empty | success → error
```
States: loading, empty, success, error

### Authenticated GET (specific resource)
```
loading → unauthorized | forbidden | not-found | success → error
```
States: loading, unauthorized, forbidden, not-found, success, error

### Mutation (create/update/delete)
```
idle → pending → success | failure
```
States: idle, pending, success, failure

### Offline-Sensitive Operation
```
online → success | offline
```
States: online, offline

### Simple Action (copy to clipboard, toggle)
```
idle → success | error
```
States: idle, success, error

### Rule
If an operation has 2 failure modes, model 2 failure states. If it has 5, model 5. Don't force a 10-state model on a 2-state problem.

## Mutations

### Full Mutation Lifecycle
```
1. Validate input (client + server)
2. Set pending state
3. Send request
4. On success:
   a. Update local UI
   b. Invalidate relevant cache entries
   c. Show success feedback
5. On failure:
   a. Show error with actionable message
   b. Offer retry (if idempotent)
   c. Log error for monitoring
6. Return to idle state
```

### Optimistic Updates
- Update UI immediately before server confirms
- Store previous state for rollback
- Reconcile on server response
- Rollback on failure

### Cache Invalidation After Mutations
After a successful mutation:
- Invalidate the specific cache entry
- Or invalidate related cache entries
- Or refetch the affected query

**This is where most bugs occur.** Don't skip cache invalidation.

## Cache Architecture

### Cache Correctness Questions
Before caching, answer:
- Is this data public or private?
- Does it depend on the user?
- Does it depend on the tenant/organization?
- Does it depend on permissions?
- When does it expire?
- How is it invalidated?

### Cache Isolation
**NEVER** allow:
- User A to receive User B's cached data
- Stale data after permission changes
- Cached responses that bypass authorization

### Cache Scopes
- **Route-level**: cached per route (Next.js page cache)
- **Component-level**: cached per component (React Cache, SvelteKit load)
- **Request-level**: cached per request (dedup)
- **Global**: cached across requests (global store)

## Data Fetching Patterns

### Server-Side (Preferred)
- Server Components (React/Next.js)
- Load functions (SvelteKit)
- Static generation (Astro)

### Client-Side
- Server-state libraries (TanStack Query, SWR)
- Framework data loading (SvelteKit universal load)
- Direct fetch with `useEffect` (last resort)

### When to Use Client-Side Fetching
- Data depends on client-only state
- Real-time updates required
- Polling / WebSocket connections
- Data that doesn't affect initial render

## Hydration and Data

### Avoiding Mismatches
- Don't use `Date.now()`, `Math.random()`, `window`, `document` during SSR
- Server-rendered HTML must match initial client render
- Use `useEffect` for client-only values
- Use framework-specific solutions (Next.js dynamic import, SvelteKit browser-only)

## Anti-Patterns

### CRITICAL
- Duplicated state (server + client + global copies)
- Cache isolation failures (user data leaking across users)

### HIGH
- Global state for everything
- Missing cache invalidation after mutations
- No optimistic updates for critical UX paths
- Missing error states for async operations

### MEDIUM
- Over-fetching (fetching everything, using little)
- No loading states for perceived performance
- Inconsistent state update patterns

### LOW
- State in wrong scope (global when local suffices)
- Missing type safety for state shapes
