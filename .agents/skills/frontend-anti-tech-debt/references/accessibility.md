# Accessibility Reference

Read this BEFORE implementing interactive components, forms, modals, navigation, or any user-facing UI.

---

## Semantic HTML First (MUST)

- Use native elements: `button`, `nav`, `label`, `table`, `dialog`, etc.
- NEVER use `div` + `onClick` for interactive elements without `role` and full keyboard support.
- Do NOT use ARIA to compensate for incorrect HTML when native HTML already solves the problem.

## Keyboard (MUST)

- Complete tab order (logical, no traps).
- Focus management for modals/dialogs (focus trap, restore on close, Escape to close).
- Visible focus indicators (never `outline: none` without replacement).
- No keyboard traps.

## Screen Readers (MUST)

- Accessible names for all interactive elements.
- Live regions for dynamic content updates.
- Form errors announced to screen readers.
- `aria-describedby` + `aria-invalid` for form errors.

## Visual (MUST)

- WCAG AA contrast minimum.
- Respect `prefers-reduced-motion`.
- Support zoom up to 200% without loss of content/functionality.
- Reflow at 320px width (no horizontal scroll for text content).
- Target sizes minimum 44x44px for interactive elements.

## Forms (MUST)

- Real `<label>` elements (not just placeholder text).
- Error messages linked to fields.
- Required fields indicated programmatically, not just visually.

## Automation (SHOULD)

- axe-core in CI. **[enforceable]**
- Lighthouse a11y where appropriate.
- Keyboard testing in E2E for critical flows.
- Automated a11y ≠ complete accessibility. Manual testing is still necessary.

---

## Visual QA

Code can be technically correct but visually poor. This section ensures frontend quality beyond logic.

### Design Intent
- Layout matches design specs (spacing, alignment, hierarchy)
- Typography is consistent (font sizes, weights, line heights)
- Color usage follows design system (not arbitrary values)
- Visual hierarchy guides user attention correctly

### Empty States
- Every data-dependent UI MUST have an empty state
- Empty states should be helpful, not just blank
- Include action or guidance when appropriate

### Error States
- Error messages should be specific and actionable
- Visual error indicators should be clear but not alarming
- Retry options should be obvious when applicable

### Loading States
- Skeleton screens preferred over spinners for content areas
- Progress indicators for operations > 3 seconds
- Loading states should match final content layout (prevent CLS)

### Responsive Visual QA
- Test at common breakpoints: 320px, 768px, 1024px, 1440px
- No horizontal scroll on text content
- Images scale properly
- Navigation adapts to screen size
- Touch targets meet minimum size on mobile

### Motion
- Respect `prefers-reduced-motion`
- Animations should enhance, not distract
- Transitions should be smooth (60fps target)
- No animation on elements that flash or strobe

### Anti-AI-Slop Indicators
- Consistent spacing (no random padding/margin values)
- Consistent border radius (not mixed within same UI)
- Consistent shadow/elevation (not random depths)
- Consistent component variants (not 5 slightly different button styles)
