# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Monorepo containing multiple Eleventy (11ty) v3 static sites and a shared infrastructure package. All sites deploy as Cloudflare Workers with Static Assets.

## Structure

```
packages/eleventy-shared/   Shared Eleventy plugin + Worker utilities (@dwk/eleventy-shared, published on npm)
sites/dwk.io/               Personal portfolio site
sites/pulletsforever.com/    Blog
sites/crontab.dwk.io/       Cron schedule reference site
sites/thekeithfamily.us/     Family site
sites/davidandshawna.us/     Family site
```

Each site is a git submodule. npm workspaces link everything — `npm install` from the root. Sites can also install `@dwk/eleventy-shared` from npm for standalone development.

**Submodule workflow:** When committing changes that touch submodules, commit inside each submodule first, then commit the monorepo to update submodule pointers. Push submodules before pushing the monorepo.

## Tech Stack

- **Eleventy 3.x** with TypeScript, ES modules, and WebC components
- **Node 22+** — native TypeScript via `--experimental-strip-types` (no build step)
- **Cloudflare Workers** — `run_worker_first: true`, static assets via `env.ASSETS.fetch()`
- **Vitest** for Worker tests (`@cloudflare/vitest-pool-workers`)

## Shared Package (`@dwk/eleventy-shared`)

Published on [npm](https://www.npmjs.com/package/@dwk/eleventy-shared). Source is TypeScript; ships compiled JS with declarations (`npm run build` compiles `src/` → `dist/`). Three entry points:

- `@dwk/eleventy-shared` — Eleventy plugin registering virtual templates and config. Sites pass options for URLs, permalinks, and feature flags.
  - **Default templates:** GPC, security.txt, sitemap, humans.txt, robots.txt, 404.
  - **Opt-in `.well-known` templates:** webfinger, host-meta, nostr.json, did.json, atproto-did, dnt-policy.txt — each registers only when its config option is provided.
  - **Config:** TypeScript extensions, HTML minification (production only), date filters, shortcodes (`currentBuildDate`, `expiryDate`), CSS/JS bundles.
- `@dwk/eleventy-shared/worker` — Worker utilities: `COMMON_SECURITY_HEADERS`, `matchesPattern()`, `applyHeaderRules()`, `handleRedirects()`, `handleWwwRedirect()`, `createWorkerHandler()`, plus `Redirect` and `HeaderRule` types. `createWorkerHandler()` is a factory that chains www redirect → path redirects → optional `before` middleware → static asset fetch → header rules.
- `@dwk/eleventy-shared/postbuild` — Post-build utilities: `addSriHashes()` injects SHA-384 integrity attributes on local stylesheets/scripts; `signSecurityTxt()` applies OpenPGP cleartext signatures per RFC 9116.

## Common Patterns

- `.11ty.ts` templates for JSON, XML, and plain-text outputs (avoids WebC HTML escaping issues). Registered via `addExtension("11ty.ts", { key: "11ty.js" })`.
- `.ts` data files in `src/_data/` (registered via `addDataExtension("ts", ...)`).
- WebC for HTML components and layouts; Nunjucks also used in pulletsforever.com.
- Extensionless outputs (e.g., `webfinger`, `host-meta`) require `eleventyAllowMissingExtension: true` in front matter.
- Passthrough copy of `node_modules/` assets uses `createRequire(import.meta.url).resolve()` for workspace-safe resolution.
