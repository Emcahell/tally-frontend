# WebGL / 3D Reference

Read this BEFORE implementing any WebGL, Three.js, canvas rendering, or GPU-intensive features.

---

## Rules (SHOULD)

- Lazy load — do not initialize WebGL too early.
- Provide fallback for unsupported browsers.
- Respect `prefers-reduced-motion`.
- Pause rendering when canvas is offscreen (IntersectionObserver).
- Adapt to device pixel ratio (DPR).
- Degrade gracefully on mobile (reduce quality, disable effects).

## Resource Disposal (MUST)

NEVER leave a render loop running when the canvas is not visible.

Clean up on unmount:
- Textures
- Geometry
- Materials
- Event listeners
- GPU buffers
- WebGL contexts

## Memory Lifecycle (MUST — for SPAs and 3D)

MUST clean up on component unmount / page navigation:
- Event listeners
- IntersectionObserver / MutationObserver / ResizeObserver
- Timers (setInterval, setTimeout)
- Subscriptions (WebSocket, EventSource)
- Workers
- Object URLs (URL.createObjectURL)
- GPU resources

Memory leaks accumulate silently — particularly important for SPAs and WebGL.
