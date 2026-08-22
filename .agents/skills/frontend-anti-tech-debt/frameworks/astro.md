# Astro Framework Rules

Read this BEFORE using Astro features.

---

## Islands Architecture (MUST understand)

Astro pages are static HTML by default. Interactive components are hydrated as "islands."

- **Static by default, interactive by exception.**
- `client:load` — hydrate immediately (critical interactive components).
- `client:idle` — hydrate when browser idle.
- `client:visible` — hydrate when entering viewport.
- `client:media` — hydrate on CSS media query match.
- `client:only` — skip SSR, client only.

Default to `client:idle` or `client:visible` for non-critical. Use `client:load` only for components that MUST be interactive immediately.

NEVER hydrate everything with `client:load` — defeats the purpose.

## Component Frameworks (SHOULD)

- Choose ONE primary framework for interactive islands.
- Astro components (`.astro`) are for static layout — no client JS.

## Data Loading (SHOULD)

- `Astro.glob()` or `import.meta.glob` for local content.
- `fetch()` in frontmatter for API data (build/SSR time, not client).
- Content collections for structured content.

## Performance (SHOULD)

- Astro generates minimal client JS by default — this is its core strength.
- Do NOT undermine this by adding heavy client frameworks unnecessarily.
- Content-heavy sites: Astro alone is often sufficient (zero client JS).

## Styling (SHOULD)

- Scoped styles in `<style>` tag.
- Supports Tailwind, CSS Modules.
- Global styles via `<style is:global>`.

## SEO (SHOULD)

- Static HTML by default — excellent for SEO.
- `@astrojs/sitemap` for sitemap generation.
- `@astrojs/rss` for RSS feeds.
