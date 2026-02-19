/**
 * PostCSS transform for CSS output files.
 *
 * Loads plugins from the site's postcss.config.js via postcss-load-config.
 * Dependencies are lazy-loaded so sites that don't enable this feature
 * don't need postcss or postcss-load-config installed.
 *
 * Opt-in: enable with `enableConfig: { postcss: true }`.
 */
export function registerPostcss(eleventyConfig: any): void {
  eleventyConfig.addTransform(
    "postcss",
    async function (this: { page: { outputPath: string } }, content: string) {
      if (this.page.outputPath && this.page.outputPath.endsWith(".css")) {
        const { default: postcss } = await import("postcss");
        const { default: postcssLoadConfig } = await import("postcss-load-config");
        const { plugins, options } = await postcssLoadConfig();
        const result = await postcss(plugins).process(content, options);
        return result.css;
      }
      return content;
    },
  );
}
