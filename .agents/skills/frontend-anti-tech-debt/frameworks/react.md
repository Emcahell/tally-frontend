---
name: frontend-anti-tech-debt-react
description: "React specific anti-technical-debt rules: Compiler, hooks, rendering, state management, mutations"
framework: react
version: 19+
---

# React Anti-Technical-Debt Rules

## React Compiler

### Default Policy
React Compiler optimizes component rendering automatically. For new code:
- **SHOULD NOT** add `React.memo()` by default
- **SHOULD NOT** add `useMemo()` by default
- **SHOULD NOT** add `useCallback()` by default

### When Manual Memoization IS Acceptable
Use manual memoization when:
- React Compiler is **unavailable or disabled** in the project
- A documented **semantic/reference-stability** requirement exists (e.g., child component expects stable function reference)
- Profiling demonstrates a **measurable** performance issue
- An integration **explicitly requires** stable identity (some third-party libraries)

### For Existing Projects
- **Do NOT automatically remove** all existing memoization
- React recommends evaluating changes carefully before removing memoization
- Existing manual memoization is safe to keep — remove only when verified unnecessary via profiling

### Anti-Pattern
```typescript
// ❌ Reflexive memoization — adds complexity without benefit
const Component = React.memo(({ items, onSelect }) => {
  const sorted = useMemo(() => items.sort(), [items]);
  const handleClick = useCallback(() => onSelect(id), [onSelect, id]);
  return <List items={sorted} onClick={handleClick} />;
});
```

```typescript
// ✅ Let the Compiler handle it — only memoize with documented reason
const Component = ({ items, onSelect }) => {
  const sorted = items.sort();
  return <List items={sorted} onClick={() => onSelect(id)} />;
};
```

## Hooks Rules

### Core Hooks
- `useState` — local component state
- `useEffect` — side effects (see Data Fetching for when to use/not use)
- `useContext` — avoid for high-frequency updates (causes re-renders)
- `useRef` — mutable references, DOM access, values that don't trigger re-renders
- `useMemo` / `useCallback` — see Compiler section above
- `useReducer` — complex state logic or state transitions

### Custom Hooks
- Extract reusable logic into custom hooks
- Name with `use` prefix
- One responsibility per hook
- Don't nest custom hooks inside conditionals or loops

## Component Architecture

### File Structure
- One component per file (for non-trivial components)
- Colocate: component, styles, tests, types in same folder
- Export: named exports for components, type exports separately

### Component Size (Signal-Based, Not Hard Limit)
Line count alone is NOT a reliable indicator of complexity. Instead, assess:

**Signals that a component needs refactoring:**
- Multiple unrelated responsibilities
- More than 4-5 distinct hooks doing different things
- Complex conditional rendering (nested ternaries, switch statements in JSX)
- Duplicated logic that should be extracted
- Hard to write tests for
- Difficult to understand on first read

**When size IS a concern:**
- 0-150 lines: typically fine
- 150-250 lines: inspect for signals above — refactor if any apply
- 250+ lines: strong signal to investigate — justify in comment if intentional

**Exceptions:** Pure presentational components (long JSX trees) may legitimately be 200-300 lines without complexity issues. The limit matters for **logic-heavy** components.

## State Management

### Categories (by scope)
1. **Local state** — `useState`/`useReducer` for component-specific state
2. **Server state** — data from APIs/DB, managed by server or server-state library
3. **Cross-route client state** — genuinely shared client-only state (theme, notifications)

### Library Policy
Prefer existing project solution. Use framework/native capabilities when sufficient.

Introduce a library ONLY when:
- Requirements justify it
- Existing solution is insufficient
- Maintenance cost is acceptable
- Bundle/runtime cost is justified

**Common options (not defaults):**
- Server state: TanStack Query, SWR, or framework-native (Next.js Server Components, SvelteKit load)
- Global client state: Zustand, Redux Toolkit, Jotai, or context for simple cases
- Forms: React Hook Form + Zod, or native form handling with Server Actions

### Global State Rule
Global client state is ONLY for client-owned state that genuinely needs cross-route sharing. Examples: theme, UI preferences, notification queue.

**Do NOT put in global state:**
- Auth/session (may be server-derived in Next.js)
- Server data (use server-state management)
- Form state (use local state or form library)
- Route-specific data (use local state)

### Proportional State Modeling
Model states **relevant to the operation and its failure modes** — don't apply a universal state list.

| Operation Type | Relevant States |
|---|---|
| **GET collection** | loading / empty / success / error |
| **Authenticated GET** | loading / unauthorized / forbidden / not-found / success |
| **Mutation (create/update/delete)** | idle / pending / success / failure |
| **Offline-sensitive** | online / offline |
| **Simple action** (copy, toggle) | idle / success / error |

**Do NOT require** `404`, `403`, `offline`, `empty`, `stale` for every async operation — that's overengineering.

## Data Fetching

### Server Components (Preferred for Initial Data)
- Fetch directly with `async/await` in Server Components
- React deduplicates identical requests automatically
- No client-side loading states needed for initial render

### Client-Side Fetching
Use `useEffect` + fetch ONLY when:
- Data depends on client-only state (not available on server)
- Real-time updates required (WebSocket, SSE, polling)
- One-time fetch on mount that doesn't affect initial render

**Do NOT use `useEffect` + fetch as default data strategy** — prefer Server Components or framework data loading.

### Mutations
Define explicitly:
- **Validation** — input validation before sending
- **Pending** — loading state during mutation
- **Success** — post-mutation UI update
- **Failure** — error handling with user feedback
- **Retry** — safe retry for idempotent operations only
- **Optimistic update** — update UI before server confirmation (when appropriate)
- **Rollback** — revert optimistic update on failure
- **Cache invalidation** — update cached data after mutation

### Network Resilience
- Request cancellation with `AbortController` for component unmount
- Timeout for critical requests
- Duplicate request prevention (dedup in-flight requests)
- Race condition handling (latest response wins or cancel stale)
- Retry with exponential backoff for idempotent operations
- **NEVER retry non-idempotent mutations automatically** without explicit design

## Testing

### Philosophy
Test behavior, not implementation. Avoid tests that verify:
- Component exists
- Specific class names
- Implementation details (internal state, private methods)

### Prioritize
- Critical business logic
- Authentication and authorization
- Form submissions and validation
- Error handling and edge cases
- Loading states and transitions
- Navigation and routing
- Accessibility (automated where possible)

## Anti-Patterns (React Specific)

### CRITICAL
- Secrets in Client Components (exposed to browser)
- `dangerouslySetInnerHTML` without sanitization
- Unvalidated user input rendered as HTML

### HIGH
- `useEffect` as default data fetching strategy (prefer Server Components)
- Global state for everything (session, server data, route data)
- Reflexive memoization without profiling
- Missing error boundaries

### MEDIUM
- `any` types silencing TypeScript
- Components mixing UI and data fetching logic
- Missing loading/error states for async operations
- Over-engineered state management for simple needs

### LOW
- Inconsistent naming conventions
- Unnecessary abstraction layers
- Missing prop types documentation
