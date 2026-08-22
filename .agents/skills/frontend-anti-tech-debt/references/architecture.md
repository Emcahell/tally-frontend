---
name: frontend-anti-tech-debt-architecture
description: "Architecture boundaries, complexity budget, dependency management, god-module prevention"
---

# Architecture Principles

## Dependency Boundaries

### Conceptual Dependency Direction
```
UI → Features/Application → Domain → Data/Infrastructure → External Systems
```

This is a **reference for large applications**, NOT a universal mandate. Apply when complexity and domain requirements justify it.

### Complexity-Appropriate Architecture
- **Small apps** (< 10 routes, simple state): feature-oriented cohesive modules are sufficient
- **Medium apps** (10-50 routes, moderate state): consider boundaries between features and shared infrastructure
- **Large apps** (50+ routes, complex state, multiple teams): enforce dependency direction

### Prohibitions (Universal)
- UI components MUST NOT contain: direct database access, secrets, authentication implementation, infrastructure concerns, complex business rules
- Business logic SHOULD be testable independently of the UI framework

## God Module Prevention

### Red Flags
- `utils.ts`, `helpers.ts`, `common.ts`, `misc.ts` growing past 200+ lines
- Single file importing from 10+ unrelated modules
- File that everyone changes but no one owns
- Catch-all modules that accumulate unrelated functions

### Action
When a shared module grows large:
1. Identify the cohesive groups within it
2. Split by domain/feature, not by file type
3. Each new module should have a clear owner and purpose

## Complexity Budget

**Use the simplest architecture that satisfies actual requirements.**

Do NOT introduce: factory, adapter, repository, service, provider, or other abstraction layers just because they sound "enterprise."

### Test: Is This Abstraction Necessary?
- Does it reduce complexity, or add indirection?
- Will it be used in more than 2-3 places?
- Does it make the code easier or harder to understand?
- Can a junior developer follow the flow?

If the answers suggest indirection without benefit, don't add the abstraction.

## Minimal Change Principle

> Change the smallest coherent surface required to solve the problem.

### Avoid
- Accidental refactors while implementing features
- Mass formatting changes (separate commit)
- Changing files unrelated to the task
- Unnecessary dependency upgrades

### Rule
The agent SHOULD NOT refactor existing code while implementing a new feature unless the refactoring is required for the feature to work correctly.

## Search Before Introducing

Before adding ANY of these:
- dependency / pattern / component / hook / store / utility / API client / abstraction

Search the existing codebase first:
- Does it already exist?
- Is there a similar pattern?
- Can the existing solution be extended?

## Exception Format

Every rule CAN be broken with justification. Use this format:

```
Rule violated: [which rule]
Reason: [why it needs to be broken]
Alternative rejected because: [why other approaches don't work]
Risk: [what could go wrong]
Validation: [how to verify the exception is safe]
```

## Dependency Management

### Before Installing Any Package
Check in order:
1. Does the framework already solve this?
2. Does the project already have a solution?
3. Is the package actively maintained?
4. Does it have known security vulnerabilities?
5. What is the bundle/runtime cost?
6. What is the license?
7. What is the maintenance burden?

### Rule
Every new dependency MUST have a documented reason. "Install library because easier" is NOT a reason.

### Dependency Boundaries
- Production dependencies: what ships to users
- Dev dependencies: tooling, testing, building
- Peer dependencies: provided by the host project

Do not mix these categories carelessly.

## ADR (Architecture Decision Records)

For non-trivial architectural decisions:

```markdown
## ADR-[N]: [Title]

**Problem:** What decision needs to be made?

**Options:**
1. [Option A]
2. [Option B]
3. [Option C]

**Decision:** [Chosen option]

**Reason:** [Why this option]

**Trade-offs:** [What we gain vs what we lose]

**Consequences:** [Expected impact]
```

Do NOT create ADRs for trivial decisions (naming, formatting, file organization).

## Migration Policy

When encountering a deprecated API or pattern:

1. **Detect** — identify the deprecation
2. **Verify** — check official documentation for replacement
3. **Assess** — evaluate impact and effort
4. **Plan** — create migration plan with rollback strategy
5. **Migrate** — implement changes incrementally
6. **Test** — verify behavior after migration
7. **Verify** — confirm deprecation warning is resolved

**NEVER upgrade everything at once.** Migrate incrementally, one module at a time.
