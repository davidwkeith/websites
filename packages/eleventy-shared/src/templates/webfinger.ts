import type { SharedPluginOptions } from "../types.ts";

/**
 * WebFinger endpoint for Fediverse / Mastodon account discovery.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7033
 * @see https://docs.joinmastodon.org/spec/webfinger/
 */
export function registerWebfinger(eleventyConfig: any, options: SharedPluginOptions): void {
  const { handle, instance } = options.webfinger!;

  eleventyConfig.addTemplate(
    "shared-webfinger.11ty.js",
    {
      render() {
        return JSON.stringify({
          subject: `acct:${handle}@${instance}`,
          aliases: [
            `https://${instance}/@${handle}`,
            `https://${instance}/users/${handle}`,
          ],
          links: [
            {
              rel: "http://webfinger.net/rel/profile-page",
              type: "text/html",
              href: `https://${instance}/@${handle}`,
            },
            {
              rel: "self",
              type: "application/activity+json",
              href: `https://${instance}/users/${handle}`,
            },
            {
              rel: "http://ostatus.org/schema/1.0/subscribe",
              template: `https://${instance}/authorize_interaction?uri={uri}`,
            },
          ],
        }, null, 2);
      },
    },
    {
      permalink: "/.well-known/webfinger",
      eleventyExcludeFromCollections: true,
      eleventyAllowMissingExtension: true,
    },
  );
}
