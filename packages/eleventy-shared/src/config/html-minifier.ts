import { minify, type Options } from "html-minifier-terser";

const htmlMinifierOptions: Options = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
};

/**
 * Minify HTML output using html-minifier-terser.
 * Only runs in production (CF_PAGES or NODE_ENV=production).
 */
export function registerHtmlMinifier(eleventyConfig: any): void {
  const isProduction =
    !!process.env.CF_PAGES || process.env.NODE_ENV === "production";

  eleventyConfig.addTransform(
    "htmlmin",
    async function (this: any, content: string) {
      if (isProduction && (this.page.outputPath || "").endsWith(".html")) {
        return await minify(content, htmlMinifierOptions);
      }
      return content;
    },
  );
}
