import type { SharedPluginOptions } from "../types.ts";

/**
 * Host metadata for WebFinger discovery bootstrap.
 *
 * @see https://www.rfc-editor.org/rfc/rfc6415
 */
export function registerHostMeta(eleventyConfig: any, options: SharedPluginOptions): void {
  const origin = new URL(options.url).origin;

  eleventyConfig.addTemplate(
    "shared-host-meta.11ty.js",
    {
      render() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Link rel="lrdd" type="application/jrd+json" template="${origin}/.well-known/webfinger?resource={uri}"/>
</XRD>`;
      },
    },
    {
      permalink: "/.well-known/host-meta",
      eleventyExcludeFromCollections: true,
      eleventyAllowMissingExtension: true,
    },
  );
}
