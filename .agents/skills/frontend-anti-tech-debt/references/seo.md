# SEO Reference

Read this BEFORE implementing metadata, sitemaps, structured data, or anything related to search engine visibility.

---

## Per-Page Evaluation (SHOULD — for public pages)

Each public page SHOULD evaluate:
- `<title>` and `<meta description>`
- Canonical URL
- Robots directives (when needed)
- Sitemap and robots.txt
- Open Graph / social metadata
- Structured data (JSON-LD where applicable)
- Heading hierarchy (single `<h1>`, logical nesting)
- Internal linking
- 404 page
- Redirects (avoid chains)
- Localization / hreflang (when applicable)

## Do NOT Apply SEO To

- Private dashboards
- Authenticated pages
- Content that should not be indexed

## Framework-Specific

- **Next.js:** use `metadata` export or `generateMetadata`.
- **SvelteKit:** use `<svelte:head>` or `<head>` in layout.
- **Astro:** use `<head>` in layout. `@astrojs/sitemap` integration.
