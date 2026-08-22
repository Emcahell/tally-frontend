---
name: frontend-anti-tech-debt-security
description: "Security: authentication, authorization, CSRF, XSS, CSP, secrets, headers, supply chain"
---

# Security Principles

> **Server-enforced security over client-side assumptions.** Never trust the client for security decisions.

## Authentication

### Session Security
- Session fixation: regenerate session ID after login
- Session rotation: rotate periodically, especially on privilege escalation
- Expiration: set reasonable session lifetimes
- Logout invalidation: destroy session server-side on logout
- Cookie scope: set `HttpOnly`, `Secure`, `SameSite` appropriately
- Domain/path: restrict to minimum necessary scope

### Cookie Security
```
HttpOnly: true     // No JavaScript access
Secure: true       // HTTPS only
SameSite: Lax      // CSRF protection (Strict for sensitive ops)
Path: /            // Minimum necessary path
Max-Age: [合理]     // Reasonable expiration
```

### Token Security
- Never store tokens in `localStorage` (XSS vulnerable)
- Prefer `httpOnly` cookies for session tokens
- If using JWT: short expiration, rotate refresh tokens
- Validate tokens server-side — never trust client-decoded tokens

## Authorization

### Server-Side Enforcement
- **MUST** validate authorization on EVERY server request
- **MUST NOT** rely solely on client-side route guards
- **Deny by default** — only grant access that is explicitly permitted
- **Least privilege** — minimum permissions required

### Authorization Levels
- **Function-level**: can this user perform this action?
- **Object-level**: can this user access THIS specific resource?
- **Tenant-level**: is this data belonging to the user's organization?

### IDOR Protection
Insecure Direct Object Reference (IDOR) occurs when:
- User A can access User B's data by changing an ID in the URL
- API returns data without checking ownership

**Prevention:**
- Always verify resource ownership server-side
- Use indirect references when possible
- Validate tenant context

### OWASP Guidance
OWASP explicitly states that authentication and authorization are different concepts, and authorization checks MUST be performed server-side.

## Cross-Site Scripting (XSS)

### Defense Hierarchy (Most to Least Preferred)
1. **Don't render user HTML** — use text, Markdown, or structured data
2. **Use framework escaping** — React's JSX auto-escapes; don't bypass it
3. **If HTML is genuinely required:** sanitize with a vetted library
4. **Define allowed HTML policy** — whitelist elements and attributes

### Sanitization
If you MUST render user-controlled HTML:
```typescript
// 1. Define what's allowed
const ALLOWED_TAGS = ['p', 'b', 'i', 'em', 'strong', 'a'];
const ALLOWED_ATTR = ['href'];

// 2. Sanitize with a vetted library
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userHTML, {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
});
```

### Anti-Pattern
```typescript
// ❌ Rendering user HTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ❌ Sanitizing everything even when unnecessary
// (if user content is rendered as text, no sanitizer needed)
<p>{textContent}</p> // JSX auto-escapes — safe
```

### OWASP Note
There is no single defense against XSS. Defense depends on context. Use multiple layers.

## Cross-Site Request Forgery (CSRF)

- Protect state-changing operations with CSRF tokens
- Use framework-provided CSRF protection when available (Next.js, SvelteKit, etc.)
- SameSite cookies provide baseline CSRF protection
- Verify `Origin` / `Referer` headers for sensitive operations

## Content Security Policy (CSP)

### Hierarchy
1. **`frame-ancestors`** (CSP Level 2+) — modern replacement for `X-Frame-Options`
2. **`X-Frame-Options`** — legacy, keep for older browser compatibility

### Recommended Headers
```
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### CSP Directives
- `default-src 'self'` — fallback for all resource types
- `script-src 'self'` — only self-hosted scripts (avoid `unsafe-inline`, `unsafe-eval`)
- `style-src 'self' 'unsafe-inline'` — styles (inline often needed for frameworks)
- `img-src 'self' data: https:` — images
- `connect-src 'self'` — API endpoints

## Security Headers

| Header | Purpose | Modern Alternative |
|---|---|---|
| `X-Frame-Options` | Clickjacking protection | `frame-ancestors` in CSP |
| `X-Content-Type-Options` | MIME sniffing prevention | — |
| `Referrer-Policy` | Referrer information control | — |
| `Permissions-Policy` | Feature policy | — |
| `Strict-Transport-Security` | HTTPS enforcement | — |

## Secrets Management

### MUST NOT
- Secrets in client bundle (exposed to browser)
- Secrets in Git (even in .env committed by accident)
- Secrets in logs or error messages
- Secrets hardcoded in source

### MUST Verify
- `.env` and `.env.local` in `.gitignore`
- `.env.production` — not committed
- Build output — no secrets in compiled files
- Source maps — no secrets in map files
- Error reporting — no secrets in stack traces

### Environment Variables
- Server-only: variables that never reach the client
- Public: variables explicitly exposed to the client (`NEXT_PUBLIC_*` in Next.js)
- Validate on server startup — fail fast if required env vars are missing

## Input/Output Security

### SSRF (Server-Side Request Forgery)
- Validate and sanitize URLs before fetching
- Whitelist allowed domains for server-side requests
- Block internal/private IP ranges
- Use network-level controls when possible

### Open Redirects
- Validate redirect URLs against a whitelist
- Only redirect to same-origin paths by default
- If external redirects are needed, use an intermediate page

### File Upload
- Validate file type (MIME type + extension)
- Scan for malware
- Store outside web root
- Generate random filenames
- Set appropriate Content-Type headers
- Limit file size

### Path Traversal
- Never construct file paths from user input directly
- Use framework-provided file handling
- Validate paths against allowed directories

## Supply Chain Security

### Dependency Integrity
- Use lockfiles (package-lock.json, yarn.lock, pnpm-lock.yaml)
- Verify lockfile is committed
- Use `npm audit` / equivalent for known vulnerabilities
- Consider `socket.dev` or similar for deeper analysis

### Malicious Package Risk
- Review new dependencies before adding
- Check download counts, maintenance status, contributor history
- Be wary of typosquatting (package name similarity attacks)
- Pin dependency versions in critical applications

## Trusted Types (Advanced)

For applications with complex DOM manipulation:
- Enable Trusted Types policy
- Define allowed HTML templates
- Prevent DOM XSS through type enforcement

## CORS (Cross-Origin Resource Sharing)

- Set explicit allowed origins (not `*` for credentials)
- Limit methods to what's actually needed
- Limit headers to what's actually needed
- Consider credentials mode carefully
