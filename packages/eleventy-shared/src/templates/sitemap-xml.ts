import type { SharedPluginOptions } from "../types.ts";

/**
 * XML Sitemap.
 * Iterates collections.all, skips drafts.
 *
 * @see https://www.sitemaps.org/protocol.html
 */
export function registerSitemapXml(
  eleventyConfig: any,
  options: SharedPluginOptions,
): void {
  const baseUrl = options.url;
  const permalink = options.sitemap?.permalink ?? "/sitemap.xml";

  eleventyConfig.addTemplate(
    "shared-sitemap.11ty.js",
    {
      render(data: any) {
        const pages = (data.collections?.all ?? []).filter(
          (page: any) => !page.data?.draft,
        );

        const urls = pages
          .map((page: any) => {
            const loc = new URL(page.url, baseUrl).href;
            const lastmod = new Date(page.date ?? Date.now()).toISOString();
            const changefreq = page.data?.changeFreq ?? "yearly";
            return [
              "  <url>",
              `    <loc>${loc}</loc>`,
              `    <lastmod>${lastmod}</lastmod>`,
              `    <changefreq>${changefreq}</changefreq>`,
              "  </url>",
            ].join("\n");
          })
          .join("\n");

        return [
          '<?xml version="1.0" encoding="utf-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          urls,
          "</urlset>",
        ].join("\n");
      },
    },
    {
      permalink,
      eleventyExcludeFromCollections: true,
    },
  );
}
