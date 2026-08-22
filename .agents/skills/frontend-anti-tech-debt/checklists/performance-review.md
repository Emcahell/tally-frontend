# Performance Review Checklist

Load this WHEN auditing performance.

---

```
□ LCP ≤ 2.5s (or documented exception)
□ INP ≤ 200ms (or documented exception)
□ CLS ≤ 0.1 (or documented exception)
□ Bundle budget met for project type
□ No unnecessary dependencies added
□ Images: webp/avif, explicit dimensions, lazy loading
□ Code splitting: route-level automatic, dynamic imports for heavy UI
□ No render loops running when offscreen (WebGL)
□ Memory: event listeners cleaned up on unmount
□ Memory: observers cleaned up on unmount
□ Memory: timers cleaned up on unmount
□ Memory: subscriptions cleaned up on unmount
□ Third-party code: evaluated for performance cost
□ Production build tested (not just dev server)
□ Field performance measured (not just lab)
```
