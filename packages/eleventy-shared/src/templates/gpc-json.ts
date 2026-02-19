/**
 * Global Privacy Control (GPC) declaration.
 * No configuration needed — output is identical for all sites.
 *
 * @see https://www.w3.org/TR/gpc/
 */
export function registerGpcJson(eleventyConfig: any): void {
  eleventyConfig.addTemplate(
    "shared-gpc.11ty.js",
    {
      render() {
        return JSON.stringify(
          { gpc: true, lastUpdate: new Date().toISOString().slice(0, 10) },
          null,
          2,
        );
      },
    },
    {
      permalink: "/.well-known/gpc.json",
      eleventyExcludeFromCollections: true,
    },
  );
}
