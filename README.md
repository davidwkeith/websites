# dwk.io monorepo

Static sites built with [Eleventy](https://www.11ty.dev/) and deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/) with [Static Assets](https://developers.cloudflare.com/workers/static-assets/).

## Structure

```
packages/eleventy-shared/        Shared Eleventy plugin, Worker utilities, and post-build tools
sites/dwk.io/                    Personal portfolio — dwk.io
sites/pulletsforever.com/        Blog — pulletsforever.com
sites/crontab.dwk.io/            Cron schedule reference — crontab.dwk.io
sites/thekeithfamily.us/         Family site — thekeithfamily.us
sites/davidandshawna.us/         Family site — davidandshawna.us
```

## Setup

Requires Node 22+ (see `.nvmrc`).

```sh
npm install
```

This installs all dependencies for all sites and the shared package via npm workspaces. Sites can also install `@dwk/eleventy-shared` from npm for standalone development.

## Development

Each site is a git submodule with its own commands — run them from the site directory:

```sh
cd sites/dwk.io
npm start           # Dev server
npm run build       # Production build
npm test            # Worker tests

cd sites/pulletsforever.com
npm start           # Dev server
npm run build       # Production build

cd sites/crontab.dwk.io
npm start           # Dev server
npm run build       # Production build
```

## Shared Package

[`@dwk/eleventy-shared`](https://www.npmjs.com/package/@dwk/eleventy-shared) is published on npm and provides three entry points:

- **Eleventy plugin** (`@dwk/eleventy-shared`) — virtual templates for `.well-known/gpc.json`, `security.txt`, `sitemap.xml`, `humans.txt`, `robots.txt`, and `404.html`, plus opt-in templates for `webfinger`, `host-meta`, `nostr.json`, `did.json`, `atproto-did`, and `dnt-policy.txt`. Config includes TypeScript extensions, HTML minification, date filters, shortcodes, and CSS/JS bundles.
- **Worker utilities** (`@dwk/eleventy-shared/worker`) — common security headers, redirect handling, path matching, and `createWorkerHandler()` factory for standard Worker request pipelines.
- **Post-build utilities** (`@dwk/eleventy-shared/postbuild`) — SRI hash injection for local stylesheets/scripts and OpenPGP signing for `security.txt`.

Sites configure the plugin with their own URLs, permalinks, and feature flags. See each site's `eleventy.config.ts`.

## security.txt Signing

Sites can sign `/.well-known/security.txt` with an OpenPGP cleartext signature per [RFC 9116 Section 2.3](https://www.rfc-editor.org/rfc/rfc9116#section-2.3). To enable, set in `.env` or CI:

```sh
GPG_PRIVATE_KEY="-----BEGIN PGP PRIVATE KEY BLOCK-----
...
-----END PGP PRIVATE KEY BLOCK-----"

# Only needed if the key is passphrase-protected
GPG_PASSPHRASE="your-passphrase"
```

If `GPG_PRIVATE_KEY` is not set, the build succeeds with an unsigned `security.txt`. An Ed25519 key is recommended (small enough for Cloudflare's 5KB secret limit).
