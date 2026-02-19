/**
 * Shared shortcodes.
 *
 * currentBuildDate: ISO timestamp of the current build.
 * expiryDate: ISO timestamp one year from now.
 */
export function registerShortcodes(eleventyConfig: any): void {
  eleventyConfig.addShortcode("currentBuildDate", () =>
    new Date().toISOString(),
  );

  eleventyConfig.addShortcode("expiryDate", () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString();
  });
}
