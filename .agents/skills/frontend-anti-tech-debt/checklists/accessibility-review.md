# Accessibility Review Checklist

Load this WHEN auditing accessibility.

---

```
□ Semantic HTML used (button, nav, label, table, dialog)
□ No div+onClick without role and keyboard support
□ Complete tab order (logical, no traps)
□ Focus management for modals (trap, restore, Escape)
□ Visible focus indicators (no outline:none without replacement)
□ Accessible names for all interactive elements
□ Form labels are real <label> elements
□ Error messages linked to fields (aria-describedby)
□ Required fields indicated programmatically
□ WCAG AA contrast minimum
□ prefers-reduced-motion respected
□ Zoom up to 200% supported
□ Reflow at 320px (no horizontal scroll for text)
□ Target sizes minimum 44x44px
□ Live regions for dynamic content
□ axe-core passes in CI
□ Keyboard testing in E2E for critical flows
```
