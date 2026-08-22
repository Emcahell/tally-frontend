# Pre-Implementation Checklist

Load this BEFORE starting any non-trivial task.

---

## Repository Inspection

```
□ Project structure (directory tree, key files)
□ Framework and version (package.json)
□ Runtime and package manager
□ TypeScript configuration (tsconfig.json → strict, paths, aliases)
□ ESLint configuration
□ Testing setup (vitest/jest/playwright config)
□ CI configuration (.github/workflows / .gitlab-ci.yml)
□ Existing conventions (naming, patterns, imports, state management)
□ Existing architecture (folder structure, module boundaries)
```

## Planning (MUST for medium/large changes)

```
Problem:        What is actually broken or missing?
Affected areas: Which files, modules, routes are impacted?
Proposed arch:  What is the approach and why?
Files to modify: Exact list of files that will change.
Dependencies:   New packages needed? Justification for each.
Risks:          What could break? What are the failure modes?
Validation:     How will we verify this works correctly?
```

## Search Before Introducing

Before adding ANY of the following, search if it already exists:
- dependency, pattern, component, hook, store, utility, API client, abstraction

## Documentation Verification

For any API that may have changed, verify against official docs. Source hierarchy:
1. Official documentation
2. Official GitHub repository / issues
3. Official RFCs / changelogs
4. Established engineering sources
5. Community discussions

NEVER: random blog → memory → implementation.
