---
name: frontend-anti-tech-debt-performance
description: "Performance budgets, Core Web Vitals, bundle analysis, hydration, WebGL/3D, memory lifecycle"
---

# Performance Principles

## Core Web Vitals (Official Reference Targets)

These are the **official** Google thresholds at p75:

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

**These are the ONLY normative targets.** Everything below is heuristic.

## Performance Budgets (Non-Normative Heuristics)

The following are **starting heuristics, NOT universal rules**. Every project should:

1. **Establish a baseline** — measure current performance
2. **Measure** — identify what matters for YOUR users
3. **Set project-specific budgets** — based on actual needs
4. **Define regression thresholds** — alert on meaningful changes

### Starting Heuristics (Use as Reference, Not Law)

| Project Type | Initial JS (gzip) | Notes |
|---|---|---|
| Marketing / content site | < 100KB | Static-first, minimal JS |
| Dashboard / SPA | < 250KB | Rich interactivity expected |
| E-commerce | < 150KB | Balance between interactivity and speed |
| 3D / WebGL app | < 300KB | Heavy runtime expected |
| Mobile-first app | < 100KB | Network constraints |

**These numbers are project-specific starting points, not web standards.** The CWV thresholds above are the only normative targets.

## Performance Measurement

### Distinguish Between
- **Development performance** — dev server, unoptimized, HMR
- **Production performance** — built, minified, served
- **Lab performance** — Lighthouse, WebPageTest (controlled environment)
- **Field performance** — real users, CrUX, RUM (actual conditions)

### Rule
**NEVER accept** "it feels fast" as evidence. Measure.

### Tools
- Lighthouse (lab, local)
- WebPageTest (lab, remote locations)
- Chrome DevTools Performance tab (profiling)
- React DevTools Profiler (component-level)
- Bundle analyzer (webpack, vite, rollup)
- CrUX / PageSpeed Insights (field data)

## Hydration

### Hydration Mismatches
Hydration occurs when client-side React attaches event handlers to server-rendered HTML. Mismatches cause:
- Console warnings
- Unnecessary re-renders
- Potential UI bugs

### Avoid Mismatches
Do NOT use during SSR without explicit strategy:
- `Date.now()` / `new Date()` — different on server vs client
- `Math.random()` — different values
- `window` / `document` — undefined on server
- `localStorage` / `sessionStorage` — unavailable on server
- `navigator` — different on server
- Locale-dependent rendering (date formats, number formats)
- Browser-specific APIs

### Solutions
- `useEffect` for client-only values (render placeholder on server)
- `suppressHydrationWarning` for intentional mismatches (e.g., `dangerouslySetInnerHTML`)
- Framework-specific solutions (Next.js `dynamic` with `{ ssr: false }`)

## Third-Party Code

Before adding ANY third-party code (analytics, maps, chat, ads, payments, social embeds, 3D libraries, tracking):

1. **Necessity** — is this truly needed?
2. **Performance impact** — bundle size, network requests, main thread work
3. **CSP compatibility** — can it work with Content Security Policy?
4. **Privacy** — does it comply with privacy requirements (GDPR, CCPA)?
5. **Failure behavior** — what happens if it fails to load?
6. **Maintenance** — is it actively maintained?

### Anti-Pattern
```typescript
// ❌ Adding analytics without considering impact
import { track } from 'heavy-analytics-sdk'; // 50KB
// ...used in 2 places
```

```typescript
// ✅ Lightweight alternative or conditional loading
if (typeof window !== 'undefined') {
  import('./lightweight-analytics').then(m => m.track(event));
}
```

## WebGL / 3D

### Lifecycle Rules
- **Lazy load** — don't initialize WebGL until needed
- **Fallback** — provide alternative content for unsupported browsers
- **Reduced motion** — respect `prefers-reduced-motion`
- **Pause when offscreen** — stop render loop when canvas not visible
- **Resource disposal** — clean up ALL GPU resources on unmount

### Resource Cleanup Checklist
```typescript
// On component unmount or scene change:
geometry.dispose();
material.dispose();
// Dispose textures
textures.forEach(t => t.dispose());
// Remove event listeners
canvas.removeEventListener('resize', onResize);
// Cancel animation frame
cancelAnimationFrame(rafId);
// Dispose renderer
renderer.dispose();
```

### Memory Management
- Monitor GPU memory usage
- Adapt to device pixel ratio (DPR)
- Degrade gracefully on mobile
- Handle unsupported browsers

## Memory / Resource Lifecycle

### Mandatory Cleanup
On component unmount or when resources are no longer needed:
- Event listeners
- IntersectionObserver / ResizeObserver / MutationObserver
- Timers (setTimeout, setInterval)
- Subscriptions (WebSocket, EventSource, RxJS)
- Object URLs (URL.createObjectURL)
- Workers
- GPU resources (WebGL contexts, textures, geometries)

### Why This Matters
SPA and 3D applications accumulate memory leaks without proper cleanup. Each leak compounds over time, eventually causing:
- Increased memory usage
- Sluggish performance
- Browser tab crashes
- Mobile device issues

## Image Optimization

- Use framework image components (`next/image`, `<Image>` in Astro)
- Serve modern formats (WebP, AVIF) with fallbacks
- Responsive images with `srcset` and `sizes`
- Lazy load below-fold images
- Avoid layout shift with explicit dimensions
- Consider CDN for image optimization

## Responsive Performance

- Test on real devices, not just dev tools throttling
- Mobile networks are slower and less reliable
- Consider data saver mode
- Reduce animation complexity on low-end devices
- Use `will-change` sparingly (it consumes GPU memory)
