import markdownIt from "markdown-it";

/**
 * Base markdown-it configuration with image renderer override.
 *
 * Sets up markdown-it with html, breaks, and linkify enabled.
 * Overrides the image renderer to delegate to the shared `image`
 * shortcode for responsive image processing.
 */
export function registerMarkdown(eleventyConfig: any): void {
  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
    }).use((md: markdownIt) => {
      md.renderer.rules.image = (tokens, idx) => {
        const token = tokens[idx];
        const src = token.attrGet("src");
        const alt = token.attrGet("alt");
        const classes = token.attrGet("class");
        const imageShortcode = eleventyConfig.getFilter("image") as (
          ...args: (string | null | undefined)[]
        ) => string;
        return imageShortcode(src, alt, classes);
      };
    }),
  );
}
