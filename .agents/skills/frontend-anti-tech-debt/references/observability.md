# Observability Reference

Read this BEFORE implementing logging, error tracking, monitoring, or deployment configuration.

---

## Required (SHOULD)

- Error tracking (Sentry, LogRocket, or equivalent)
- Structured logs (JSON, not freeform text)
- Request correlation (trace IDs)
- Performance monitoring
- Core Web Vitals tracking
- Deployment / version identifier in logs

## NEVER Log

- Passwords
- Tokens
- Session cookies
- Secrets
- Payment data
- Unnecessary PII
