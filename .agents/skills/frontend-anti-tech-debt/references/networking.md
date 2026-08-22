# Networking Reference

Read this BEFORE implementing fetch calls, API clients, retry logic, or handling network errors.

---

## Fetch Patterns (SHOULD)

- Use framework-native data fetching when available (Server Components, SvelteKit load functions).
- For client-side fetching: TanStack Query / SWR (React) or `$effect` + `fetch` (Svelte).
- NEVER use manual `useEffect + fetch` with hand-rolled loading/error/data flags as default.

## Request Cancellation (SHOULD)

- Use `AbortController` for fetch requests that may become stale.
- Clean up on component unmount.
- Cancel duplicate in-flight requests when appropriate.

## Timeouts (SHOULD)

- Set reasonable timeouts for network requests.
- Use `AbortSignal.timeout(ms)` where supported.

## Retry (SHOULD)

- Exponential backoff for transient failures.
- NEVER automatically retry non-idempotent mutations without explicit design.
- Limit retry attempts (3-5 max).

## Race Conditions (MUST)

- Handle stale responses (request A completes after request B).
- Use request cancellation or response ordering.
- Do not assume the last request is the one that should win without verification.

## Offline Handling (SHOULD)

- Detect offline state.
- Queue mutations for retry when online.
- Show appropriate UI state.
