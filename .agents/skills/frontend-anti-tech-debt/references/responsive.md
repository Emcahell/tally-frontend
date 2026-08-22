# Responsive Design Reference

Read this BEFORE implementing layouts, breakpoints, or responsive behavior.

---

## Validate (SHOULD)

- Mobile, tablet, desktop, large desktop when applicable.

## AVOID

- Fixed widths
- Accidental overflow
- Breakpoint explosion
- Viewport-specific hacks

## PREFER

- Fluid layouts
- Container queries where appropriate
- Content-driven breakpoints
- `clamp()` for fluid typography and spacing

## Common Breakpoints (reference, not law)

- Mobile: < 640px
- Tablet: 640px – 1024px
- Desktop: 1024px – 1440px
- Large: > 1440px

Adapt to actual content needs — breakpoints should be driven by content, not devices.
