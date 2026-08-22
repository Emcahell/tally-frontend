---
name: frontend-anti-tech-debt-nextjs
description: "Next.js specific anti-technical-debt rules: App Router, Server Components, caching, actions, metadata, images"
framework: nextjs
version: current
---

# Next.js Anti-Technical-Debt Rules

> **CRITICAL: Verify against installed version.** Next.js changes behavior across major versions. The agent MUST detect the installed version and read official docs for THAT version before applying version-specific rules.

## Version Detection

```bash
node -e "console.log(require('next/package.json').version)"
```

- Next.js 13-14: App Router stable, Server Components, Server Actions (experimental → stable)
- Next.js 15: Cache Components, `use cache`, fetch caching changes
- Next.js 16+: `next lint` removed from CLI, `priority` → `preload` on Image, continued caching model changes

**The agent MUST NOT assume behavioral defaults — always verify the installed version's documentation.**

## App Router

### Route Conventions
- `page.tsx` — route UI
- `layout.tsx` — shared layout (persists across navigation)
- `loading.tsx` — Suspense boundary
- `error.tsx` — error boundary
- `not-found.tsx` — 404 UI
- `route.ts` — API route (server only)
- `template.tsx` — like layout but re-mounts on navigation
- `default.tsx` — parallel routes fallback

### File-based Routing
- Use `app/` directory (App Router), NOT `pages/` (Pages Router)
- Colocate: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` in the same route folder
- Use route groups `(name)` for organization without affecting URL
- Use `[slug]` for dynamic segments, `[[...slug]]` for catch-all

## Server and Client Components

### Server Components (Default)
- Everything in `app/` is a Server Component by default — this is correct, keep it
- Server Components run ONLY on the server — no `useState`, `useEffect`, event handlers, or browser APIs
- They CAN: `async/await`, direct DB queries, file system access, secret access

### Client Components
- Mark with `"use client"` at the top of the file
- `"use client"` is an **architectural boundary**, not a convenience directive
- Before adding `"use client"`, the agent MUST verify it needs: state, events, browser APIs, real interactivity
- Prefer isolating client components as leaf components — avoid `"use client"` on layout or page wrappers
- Client Components CAN import Server Components (as children/props), but NOT vice versa

### Server Actions
- Define with `"use server"` directive
- Use for mutations — form submissions, data writes
- Always validate inputs server-side (Zod recommended)
- Server Actions are type-safe — define clear input/output types
- Do NOT use Server Actions for data fetching — use Server Components or route handlers

## Fetching and Caching

### Fetch Behavior (Version-Dependent)
- **Next.js 13-14**: `fetch()` in Server Components is cached by default
- **Next.js 15+**: Fetch caching behavior changed — `cache: 'force-cache'` is no longer the default in all contexts
- **The agent MUST verify the installed version's fetch caching behavior before applying caching rules**

### Cache Components / `use cache` (Next.js 15+)
- Next.js 15+ introduced Cache Components with `"use cache"` directive
- This is a more fine-grained caching mechanism than fetch-level caching
- The agent MUST check if the project uses Cache Components before assuming fetch-only caching

### Data Fetching Patterns
- **Server Components**: `async/await` directly — React deduplicates requests
- **Client Components**: use a library for server state (TanStack Query, SWR) or Server Actions
- For truly dynamic data: use appropriate cache invalidation strategies, not blanket `no-store`

### Cache Invalidation
- `revalidatePath(path)` — revalidate specific path
- `revalidateTag(tag)` — revalidate by tag
- `unstable_cache` / `"use cache"` — for fine-grained caching
- Never assume data is fresh — verify the caching strategy for the version in use

## Server Actions and Mutations

- Use `"use server"` for server-side mutation logic
- Always validate inputs with Zod on the server
- Handle errors explicitly — return structured error objects, not thrown exceptions
- Use `useActionState` (React 19+) for form state management
- Use `useFormStatus` for pending state in form submit buttons
- Optimistic updates: update UI immediately, reconcile on server response

## Metadata API

```typescript
// layout.tsx or page.tsx
export const metadata: Metadata = {
  title: { template: '%s | Site', default: 'Site' },
  description: '...',
  openGraph: { ... },
}
```

- Use `generateMetadata()` for dynamic metadata
- Metadata is server-only — safe for secrets/conditional logic
- Use `generateStaticParams()` for static generation of dynamic routes

## Images

- Use `next/image` for optimized images
- **Next.js 15**: `priority` for LCP images
- **Next.js 16+**: `priority` is deprecated in favor of `preload` — check installed version
- Always provide `width` and `height` or use `fill` with container sizing
- Use `sizes` attribute for responsive images
- Remote images require `next.config.js` image configuration

## Routing and Navigation

- Use `next/link` for client-side navigation — never raw `<a href>`
- Use `useRouter()` for programmatic navigation
- Use `usePathname()`, `useSearchParams()` for current route state
- Parallel routes: `@slot` for simultaneous route rendering
- Intercepting routes: `(..)` convention for modals/overlays

## Middleware

- Run at the edge before request completion
- Use for: authentication, redirects, rewrites, geolocation
- Keep middleware lightweight — it runs on every matched request
- Use `NextResponse` for responses, `request.nextUrl` for URL manipulation

## Deployment

- Vercel: zero-config, but verify `next.config.js` compatibility
- Self-hosted: `next start` after `next build`
- Docker: multi-stage builds recommended
- Edge Runtime: use for latency-sensitive middleware/routes
- ISR: `revalidate` option for static pages that update periodically

## Anti-Patterns (Next.js Specific)

### CRITICAL
- Using `"use client"` on layouts or high-level wrappers
- Fetching data in Client Components when Server Components suffice
- Hardcoded secrets in Client Components or `next.config.js` (exposed to client)

### HIGH
- Using Pages Router (`pages/`) for new projects
- `next lint` in scripts (removed in Next.js 16+ — use project's lint script)
- Importing SvelteKit conventions (`$types`) into Next.js projects
- Using Astro packages (`@astrojs/*`) in Next.js projects
- Ignoring version-specific behavioral differences

### MEDIUM
- Over-fetching in Server Components (fetch everything, use little)
- Using `any` for API response types
- Missing `loading.tsx` for slow routes
- Missing `error.tsx` boundaries

### LOW
- Inconsistent route organization
- Missing `not-found.tsx` for custom 404
