import type { SharedPluginOptions } from "../types.ts";

/**
 * robots.txt per robotstxt.org.
 * Supports configurable preamble, directives, and permalink.
 *
 * @see https://www.robotstxt.org/
 */
export function registerRobotsTxt(
  eleventyConfig: any,
  options: SharedPluginOptions,
): void {
  const baseUrl = options.url;
  const permalink = options.robots?.permalink ?? "/robots.txt";
  const preamble = options.robots?.preamble ?? "";
  const directives = options.robots?.directives ?? ["Disallow:"];
  const sitemapPermalink = options.sitemap?.permalink ?? "/sitemap.xml";

  eleventyConfig.addTemplate(
    "shared-robots-txt.11ty.js",
    {
      render() {
        const sitemapUrl = new URL(sitemapPermalink, baseUrl).href;
        const parts: string[] = [];

        if (preamble) {
          parts.push(preamble);
          parts.push("");
        }

        parts.push("User-agent: *");
        for (const d of directives) {
          parts.push(d);
        }
        parts.push("");
        parts.push(`Sitemap: ${sitemapUrl}`);

        return parts.join("\n");
      },
    },
    {
      permalink,
      eleventyExcludeFromCollections: true,
    },
  );
}
