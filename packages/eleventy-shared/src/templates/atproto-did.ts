import type { SharedPluginOptions } from "../types.ts";

/**
 * AT Protocol DID for Bluesky handle verification.
 *
 * @see https://atproto.com/specs/handle
 */
export function registerAtprotoDid(eleventyConfig: any, options: SharedPluginOptions): void {
  eleventyConfig.addTemplate(
    "shared-atproto-did.11ty.js",
    {
      render() {
        return options.atprotoDid;
      },
    },
    {
      permalink: "/.well-known/atproto-did",
      eleventyExcludeFromCollections: true,
      eleventyAllowMissingExtension: true,
    },
  );
}
