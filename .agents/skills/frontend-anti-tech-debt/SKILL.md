---
name: frontend-anti-tech-debt
description: Frontend Architecture & Software Quality Guardrails — correct, maintainable, verifiable, secure, accessible, measurable.
version: 3.0.0
author: Emcahell
tags: [react, nextjs, svelte, sveltekit, astro, typescript, architecture, performance, security, accessibility]
---

# Frontend Architecture & Software Quality Guardrails

Building correct, maintainable, verifiable, secure, accessible, and measurable frontend software while minimizing technical debt.

**Scope:** React 19+, Next.js (current stable), Svelte 5 (runes), SvelteKit 2, Astro, TypeScript.
**Last reviewed:** August 2026. Always verify framework-specific rules against current official docs.

---

## Core Principles

1. **Correctness over cleverness.** Working code that is understood beats elegant code that breaks.
2. **Simplicity over unnecessary abstraction.** Use the simplest architecture that satisfies the real requirements.
3. **Evidence over assumptions.** Measure before optimizing. Profile before refactoring. Test before claiming correctness.
4. **Official documentation over model memory.** Always verify against current official docs. Never trust model memory for API details.
5. **Existing architecture over personal preference.** Match the project's conventions. Do not impose personal taste.
6. **Minimal change over unnecessary refactoring.** Change the smallest coherent surface required to solve the problem.
7. **Measured performance over premature optimization.** Optimize only after profiling shows a real bottleneck.
8. **Server-enforced security over client-side assumptions.** Authorization, validation, and secrets MUST be enforced server-side.
9. **Automated verification over human confidence.** If it can be checked by lint, typecheck, or test — do not rely on manual review.
10. **Progressive enhancement where appropriate.** Core functionality should work without JavaScript when feasible.
11. **Explicit trade-offs over dogmatic rules.** Every rule can be broken with documented justification.

---

## Severity Levels

Issues are classified by severity. The agent MUST treat them differently.

**CRITICAL:** exposed secrets, broken authorization, XSS, unsafe cache isolation, production build failure, IDOR.
**HIGH:** hydration mismatch, broken critical user flow, major a11y failure, severe performance regression, CSRF, missing server-side validation.
**MEDIUM:** duplicated business logic, weak abstraction, missing tests, incomplete error handling, duplicated state, unnecessary dependency weight.
**LOW:** naming inconsistency, minor stylistic inconsistency, non-optimal code organization.

---

## RFC 2119 Keywords

- **MUST / MUST NOT** — absolute requirement or prohibition. Violations are bugs.
- **SHOULD / SHOULD NOT** — recommended. Deviation requires documented justification.
- **MAY** — optional. At the implementer's discretion.

---

## Reference Loading Protocol

Auxiliary files are NOT auto-loaded. The agent reads them when this skill instructs it to. The agent MUST read the relevant reference BEFORE implementing the corresponding task — not after.

### Risk-Based Loading

Do NOT force the agent to read every file for every task. Load only what the task requires.

| Task | Read BEFORE implementing |
|---|---|
| Simple UI component | `references/architecture.md` |
| Complex component (>150 lines) | `references/architecture.md` + `references/accessibility.md` |
| Form (client-side) | `references/architecture.md` + `references/security.md` + `checklists/definition-of-done.md` |
| Form (server submission) | `references/security.md` + `references/testing.md` + relevant `frameworks/*.md` |
| Authentication / authorization | `references/security.md` + `references/architecture.md` + relevant `frameworks/*.md` |
| API endpoint | `references/security.md` + `references/networking.md` + relevant `frameworks/*.md` |
| Caching strategy | `references/performance.md` + `references/security.md` + relevant `frameworks/*.md` |
| State management | `references/state-and-data.md` + relevant `frameworks/*.md` |
| WebGL / 3D | `references/performance.md` + `references/webgl.md` + `references/accessibility.md` |
| SEO | `references/seo.md` + `references/performance.md` |
| Database / data layer | `references/architecture.md` + `references/security.md` |
| Add a dependency | `references/dependencies.md` |
| Deploy / production | `references/observability.md` + `references/security.md` + `references/performance.md` |
| Styling / design system | `references/styling.md` + `references/accessibility.md` + `references/responsive.md` |
| TypeScript configuration | `references/typescript.md` |
| Test suite | `references/testing.md` + `checklists/production-validation.md` |
| Git commit / review | `references/git-review.md` + `checklists/definition-of-done.md` |
| Accessibility audit | `references/accessibility.md` + `checklists/accessibility-review.md` |
| Security audit | `references/security.md` + `checklists/security-review.md` |
| Performance audit | `references/performance.md` + `checklists/performance-review.md` |
| Pre-implementation (any non-trivial task) | `checklists/pre-implementation.md` |

### Framework Loading

When working in a specific framework, ALWAYS load the corresponding framework file:

- React project → read `frameworks/react.md` BEFORE using React APIs, hooks, or patterns.
- Next.js project → read `frameworks/nextjs.md` BEFORE using Next.js features (also implies React rules).
- Svelte project → read `frameworks/svelte.md` BEFORE using Svelte runes or patterns.
- SvelteKit project → read `frameworks/sveltekit.md` BEFORE using SvelteKit features (also implies Svelte rules).
- Astro project → read `frameworks/astro.md` BEFORE using Astro features.

### Explicit Loading Instructions

The agent MUST read these files BEFORE implementing the corresponding task:

- Read `references/architecture.md` BEFORE modifying component structure, extracting modules, adding dependencies, or changing project organization.
- Read `references/state-and-data.md` BEFORE implementing state management, data fetching, mutations, or cache invalidation.
- Read `references/typescript.md` BEFORE configuring TypeScript, typing complex data, or fixing type errors.
- Read `references/dependencies.md` BEFORE installing any new package or removing an existing one.
- Read `references/security.md` BEFORE implementing authentication, authorization, sessions, cookies, API endpoints, handling user-controlled HTML, or processing sensitive data.
- Read `references/accessibility.md` BEFORE implementing interactive components, forms, modals, navigation, or any user-facing UI.
- Read `references/performance.md` BEFORE optimizing rendering, adding memoization, setting performance budgets, or measuring performance.
- Read `references/networking.md` BEFORE implementing fetch calls, API clients, retry logic, or handling network errors.
- Read `references/testing.md` BEFORE writing tests, setting up test infrastructure, or modifying the test pipeline.
- Read `references/seo.md` BEFORE implementing metadata, sitemaps, structured data, or anything related to search engine visibility.
- Read `references/responsive.md` BEFORE implementing layouts, breakpoints, or responsive behavior.
- Read `references/styling.md` BEFORE choosing a styling approach, creating design tokens, or modifying the CSS architecture.
- Read `references/observability.md` BEFORE implementing logging, error tracking, monitoring, or deployment configuration.
- Read `references/webgl.md` BEFORE implementing any WebGL, Three.js, canvas rendering, or GPU-intensive features.
- Read `references/git-review.md` BEFORE finalizing any task, creating commits, or reviewing changes.

### Checklist Loading

Load checklists when verifying or auditing:

- Read `checklists/pre-implementation.md` BEFORE starting any non-trivial task.
- Read `checklists/security-review.md` WHEN reviewing security-sensitive changes.
- Read `checklists/accessibility-review.md` WHEN auditing accessibility.
- Read `checklists/performance-review.md` WHEN auditing performance.
- Read `checklists/production-validation.md` BEFORE claiming a task is complete.
- Read `checklists/definition-of-done.md` WHEN verifying completion of any task.

---

## Agent Operating Protocol (MUST follow)

Before implementing any non-trivial change, the agent MUST:

1. **Inspect** the repository (structure, framework, versions, config, conventions).
2. **Verify** documentation for any API that may have changed.
3. **Plan** the change (problem, approach, files, risks, validation).
4. **Implement** with minimal change principle.
5. **Verify** using the relevant checklist.
6. **Review** the git diff before finishing.

The agent MUST NOT claim completion if required validation was skipped.

### Repository Inspection (MUST — before any change)

```
□ Project structure (directory tree, key files)
□ Framework and version (package.json)
□ Runtime and package manager
□ TypeScript configuration (tsconfig.json)
□ ESLint configuration
□ Testing setup (vitest/jest/playwright config)
□ CI configuration
□ Existing conventions (naming, patterns, imports, state management)
□ Existing architecture (folder structure, module boundaries)
```

### Minimal Change Principle (MUST)

> Change the smallest coherent surface required to solve the problem.

NEVER: accidental refactors, massive reformatting, unrelated file changes, unnecessary dependency upgrades.

### Search Before Introducing (MUST)

Before adding ANY dependency, pattern, component, hook, store, utility, API client, or abstraction — search if it already exists in the project.

### Repository Preservation (MUST)

NEVER migrate framework, change router, change styling system, change state manager, change testing framework, update unrelated dependencies, or reorganize the project — without explicit justification.

### Exceptions

Every rule can be broken with documented justification:

```
Rule violated: [which rule]
Reason: [why this doesn't apply]
Alternative rejected because: [why the default was considered]
Risk: [what risk this introduces]
Validation: [how we verify this is safe]
```

---

## Definition of Done (MUST verify before claiming completion)

```
□ Requirements implemented
□ Architecture reviewed (consistent with existing patterns)
□ Typecheck passes
□ Lint passes
□ Tests pass
□ Production build passes
□ E2E passes (when applicable)
□ Accessibility checked
□ Security checked
□ Performance checked
□ SEO checked (when applicable)
□ Dependencies reviewed
□ No unused code or debug artifacts
□ Git diff reviewed (only intended changes)
```

---

## Anti-Patterns (NEVER)

- Do not force Clean Architecture on every project.
- Do not install a library for every small problem.
- Do not perform giant refactors to add features.
- Do not update all dependencies without reason.
- Do not use `useEffect` to fix architecture problems.
- Do not use global state as a universal solution.
- Do not use `any` or `as SomeType` to silence TypeScript.
- Do not trust client-side authorization.
- Do not treat high test coverage as proof of quality.
- Do not use Lighthouse as the only performance test.
- Do not use `npm audit` as the only security criterion.
- Do not cache data without understanding its isolation boundaries.
- Do not optimize without measuring.
- Do not declare "done" without running validations.
- Do not trust model memory when official documentation exists.
- Do not change existing architecture without justification.
- Do not claim completion if required validation was skipped.
