# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Monorepo containing multiple Eleventy (11ty) v3 static sites and a shared infrastructure package. All sites deploy as Cloudflare Workers with Static Assets.

## Structure

```
packages/eleventy-shared/   Shared Eleventy plugin + Worker utilities (@dwk/eleventy-shared)
sites/dwk.io/               Personal portfolio site
sites/pulletsforever.com/    Blog
```

npm workspaces link everything — `npm install` from the root.

## Tech Stack

- **Eleventy 3.x** with TypeScript, ES modules, and WebC components
- **Node 22+** — native TypeScript via `--experimental-strip-types` (no build step)
- **Cloudflare Workers** — `run_worker_first: true`, static assets via `env.ASSETS.fetch()`
- **Vitest** for Worker tests (`@cloudflare/vitest-pool-workers`)

## Shared Package (`@dwk/eleventy-shared`)

Exports `.ts` files directly (no compile step). Two entry points:

- `@dwk/eleventy-shared` — Eleventy plugin registering virtual templates (GPC, security.txt, sitemap, humans.txt, robots.txt, 404) and config (TypeScript extensions, HTML minification, date filters, shortcodes, CSS/JS bundles). Sites pass options for URLs, permalinks, and feature flags.
- `@dwk/eleventy-shared/worker` — Worker utilities: `COMMON_SECURITY_HEADERS`, `matchesPattern()`, `applyHeaderRules()`, `handleRedirects()`, `handleWwwRedirect()`, plus `Redirect` and `HeaderRule` types.

## Common Patterns

- `.11ty.ts` templates for JSON, XML, and plain-text outputs (avoids WebC HTML escaping issues). Registered via `addExtension("11ty.ts", { key: "11ty.js" })`.
- `.ts` data files in `src/_data/` (registered via `addDataExtension("ts", ...)`).
- WebC for HTML components and layouts; Nunjucks also used in pulletsforever.com.
- Extensionless outputs (e.g., `webfinger`, `host-meta`) require `eleventyAllowMissingExtension: true` in front matter.
- Passthrough copy of `node_modules/` assets uses `createRequire(import.meta.url).resolve()` for workspace-safe resolution.
