# Security Review Checklist

Load this WHEN reviewing security-sensitive changes.

---

```
□ No secrets in client bundle
□ No secrets in Git history
□ No secrets in logs or error messages
□ No secrets hardcoded in source
□ XSS: no unsanitized dangerouslySetInnerHTML / {html}
□ XSS: URLs validated (no javascript: schemes)
□ Authorization enforced server-side (not client-only)
□ Object-level authorization verified (user owns resource)
□ CSRF protection on state-changing operations
□ Server-side input validation on all endpoints
□ Session cookies: httpOnly, secure, sameSite
□ Auth tokens not in localStorage
□ Security headers set (CSP, X-Content-Type-Options, etc.)
□ .env files not committed
□ Source maps reviewed for sensitive data
□ No PII in logs
```
