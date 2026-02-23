# @dwk/eleventy-shared

Shared [Eleventy](https://www.11ty.dev/) plugin, [Cloudflare Worker](https://developers.cloudflare.com/workers/) utilities, and post-build tools.

Requires **Node 18+**. Ships compiled JavaScript with TypeScript declarations.

## Install

```sh
npm install @dwk/eleventy-shared
```

## Entry Points

### `@dwk/eleventy-shared` — Eleventy Plugin

Registers virtual templates and common config for Eleventy 3.x sites.

**Default templates:** `/.well-known/gpc.json`, `security.txt`, `sitemap.xml`, `humans.txt`, `robots.txt`, `404.html`.

**Opt-in templates** (registered when config provided): `webfinger`, `host-meta`, `nostr.json`, `did.json`, `atproto-did`, `dnt-policy.txt`.

**Config registrations** (individually disablable): TypeScript extensions, HTML minification, date filters, shortcodes, CSS/JS bundles, schema validation, images, markdown, content filters. PostCSS is opt-in.

```ts
import sharedPlugin from "@dwk/eleventy-shared";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(sharedPlugin, {
    url: "https://example.com",
    language: "en",
    securityContact: "mailto:security@example.com",
  });
};
```

See `SharedPluginOptions` in [`src/types.ts`](./src/types.ts) for all options.

### `@dwk/eleventy-shared/worker` — Worker Utilities

Cloudflare Worker request pipeline: www redirect, path redirects, middleware hook, static asset fetch, response header rules.

```ts
import { createWorkerHandler } from "@dwk/eleventy-shared/worker";

export default {
  fetch: createWorkerHandler({
    hostname: "example.com",
    redirects: [{ source: "/old", destination: "/new", code: 301 }],
  }),
};
```

Exports: `createWorkerHandler()`, `COMMON_SECURITY_HEADERS`, `matchesPattern()`, `applyHeaderRules()`, `handleRedirects()`, `handleWwwRedirect()`, `Redirect`, `HeaderRule`, `WorkerHandlerConfig`.

### `@dwk/eleventy-shared/postbuild` — Post-Build Utilities

```ts
import { addSriHashes, signSecurityTxt } from "@dwk/eleventy-shared/postbuild";

await addSriHashes("./_site");    // SHA-384 integrity on <link>/<script>
await signSecurityTxt("./_site"); // OpenPGP cleartext signature (reads GPG_PRIVATE_KEY env)
```

## Peer Dependencies

All peer dependencies are optional. Install only what you use:

| Peer | Used by |
|------|---------|
| `@11ty/eleventy-img` | Plugin — image shortcodes |
| `html-minifier-terser` | Plugin — HTML minification |
| `markdown-it` | Plugin — markdown config |
| `cheerio` | Postbuild — SRI hashes |
| `openpgp` | Postbuild — security.txt signing |
| `postcss`, `postcss-load-config` | Plugin — opt-in PostCSS transform |

## License

[ISC](./LICENSE)
