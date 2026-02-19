import type { SharedPluginOptions } from "../types.ts";

/**
 * Nostr NIP-05 identity verification.
 *
 * @see https://github.com/nostr-protocol/nips/blob/master/05.md
 */
export function registerNostrJson(eleventyConfig: any, options: SharedPluginOptions): void {
  const { handle, pubkey } = options.nostr!;

  eleventyConfig.addTemplate(
    "shared-nostr.11ty.js",
    {
      render() {
        return JSON.stringify({
          names: {
            [handle]: pubkey,
            _: pubkey,
          },
          relays: {},
        }, null, 2);
      },
    },
    {
      permalink: "/.well-known/nostr.json",
      eleventyExcludeFromCollections: true,
    },
  );
}
