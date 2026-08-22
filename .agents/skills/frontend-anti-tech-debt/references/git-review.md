# Git Review Reference

Read this BEFORE finalizing any task, creating commits, or reviewing changes.

---

## Pre-Commit Review (MUST)

```bash
git status        # Check modified, new, deleted files
git diff          # Review all changes
git diff --cached # Review staged changes
```

## Review Checklist

- Modified files — are all intended?
- New files — are all necessary?
- Deleted files — were any accidentally removed?
- Dependencies — any unexpected additions/removals?
- Generated files — any build artifacts accidentally included?
- Debug logs — any console.log, debugger, or temporary code?
- Secrets — any credentials, tokens, or sensitive data?
- Accidental changes — formatting noise, unrelated modifications?
- TODO temporales — any temporary hacks left behind?

## Commit Convention (SHOULD)

Use conventional commits: `type: description`
- Types: feat, fix, docs, refactor, test, chore, perf, ci
- Keep commits focused — one logical change per commit
