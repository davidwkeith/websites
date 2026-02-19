import type { SharedPluginOptions } from "../types.ts";

/**
 * 404 error page.
 * Layout is site-specific, passed via plugin options.
 */
export function registerFourOhFour(
  eleventyConfig: any,
  options: SharedPluginOptions,
): void {
  const fourOhFour = options.fourOhFour;
  if (!fourOhFour) return;

  const layout = fourOhFour.layout;
  const title = fourOhFour.title ?? "404 Not Found";

  eleventyConfig.addTemplate(
    "shared-404.11ty.js",
    {
      render() {
        return '<h1>Content not found</h1>\n<p>Go <a href="/">home</a>.</p>';
      },
    },
    {
      permalink: "/404.html",
      layout,
      title,
      eleventyExcludeFromCollections: true,
    },
  );
}
