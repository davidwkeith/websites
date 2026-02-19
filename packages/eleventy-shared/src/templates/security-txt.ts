import type { SharedPluginOptions } from "../types.ts";

/**
 * security.txt per RFC 9116.
 * Uses plugin options via closure for Contact, Canonical, Preferred-Languages.
 *
 * @see https://securitytxt.org
 */
export function registerSecurityTxt(
  eleventyConfig: any,
  options: SharedPluginOptions,
): void {
  const { securityContact, url, language } = options;

  eleventyConfig.addTemplate(
    "shared-security-txt.11ty.js",
    {
      render() {
        const expires = new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ).toISOString();
        const canonical = new URL("/.well-known/security.txt", url).href;
        return [
          `Contact: ${securityContact}`,
          `Expires: ${expires}`,
          `Preferred-Languages: ${language}`,
          `Canonical: ${canonical}`,
        ].join("\n");
      },
    },
    {
      permalink: "/.well-known/security.txt",
      eleventyExcludeFromCollections: true,
    },
  );
}
