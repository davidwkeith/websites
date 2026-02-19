# dwk.io monorepo

Static sites built with [Eleventy](https://www.11ty.dev/) and deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/) with [Static Assets](https://developers.cloudflare.com/workers/static-assets/).

## Structure

```
packages/eleventy-shared/        Shared Eleventy plugin and Worker utilities
sites/dwk.io/                    Personal portfolio — dwk.io
sites/pulletsforever.com/        Blog — pulletsforever.com
```

## Setup

Requires Node 22+ (see `.nvmrc`).

```sh
npm install
```

This installs all dependencies for both sites and the shared package via npm workspaces.

## Development

Each site has its own commands — run them from the site directory:

```sh
cd sites/dwk.io
npm start           # Dev server
npm run build       # Production build
npm test            # Worker tests

cd sites/pulletsforever.com
npm start           # Dev server
npm run build       # Production build
```

## Shared Package

`@dwk/eleventy-shared` provides:

- **Eleventy plugin** — virtual templates for `.well-known/gpc.json`, `security.txt`, `sitemap.xml`, `humans.txt`, `robots.txt`, and `404.html`, plus config for TypeScript extensions, HTML minification, date filters, shortcodes, and CSS/JS bundles
- **Worker utilities** — common security headers, redirect handling, and path matching

Sites configure the plugin with their own URLs, permalinks, and feature flags. See each site's `eleventy.config.ts`.

## security.txt Signing

Both sites can sign `/.well-known/security.txt` with an OpenPGP cleartext signature per [RFC 9116 Section 2.3](https://www.rfc-editor.org/rfc/rfc9116#section-2.3). To enable, set in `.env` or CI:

```sh
GPG_PRIVATE_KEY="-----BEGIN PGP PRIVATE KEY BLOCK-----
...
-----END PGP PRIVATE KEY BLOCK-----"

# Only needed if the key is passphrase-protected
GPG_PASSPHRASE="your-passphrase"
```

If `GPG_PRIVATE_KEY` is not set, the build succeeds with an unsigned `security.txt`. An Ed25519 key is recommended (small enough for Cloudflare's 5KB secret limit).
