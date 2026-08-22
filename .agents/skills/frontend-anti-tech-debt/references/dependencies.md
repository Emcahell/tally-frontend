# Dependencies Reference

Read this BEFORE installing any new package or removing an existing one.

---

## Before Adding ANY Package (MUST evaluate)

```
□ Does the framework already solve this?
□ Does the project already have a solution?
□ Is the package maintained? (last release, open issues, contributors)
□ Is it secure? (known vulnerabilities, dependency chain)
□ What is the bundle cost? (size, tree-shakeable?)
□ What is the license? (compatible with project?)
□ Is it stable? (major version, API stability?)
□ Is it compatible? (peer deps, framework version)
□ What is the maintenance cost? (will we maintain a fork?)
```

**Rule:** A new dependency MUST have a reason. NOT: "install library because easier."

---

## Dependency Security (SHOULD)

- Run `npm audit` / equivalent regularly.
- Classify by: severity, exploitability, production exposure, affected dependency, availability of fix.
- Block CRITICAL/HIGH vulnerabilities that actually affect the system.
- Do NOT treat `npm audit` as binary pass/fail — assess context.

---

## Lockfile (MUST)

Commit the lockfile. Review `npm audit` and deprecation warnings regularly.
