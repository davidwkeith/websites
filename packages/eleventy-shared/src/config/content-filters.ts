/**
 * Content utility filters for text processing.
 */
export function registerContentFilters(eleventyConfig: any): void {
  /**
   * Strips HTML and truncates content at a word boundary.
   */
  eleventyConfig.addFilter("excerpt", (content: string) => {
    if (!content) return "";
    const text = content
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length <= 155) return text;
    const truncated = text.slice(0, 155);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + "…";
  });

  /**
   * Estimates reading time based on word count (200 wpm).
   */
  eleventyConfig.addFilter("readingTime", (content: string) => {
    if (!content) return "1 min read";
    const textOnly = content.replace(/<[^>]+>/g, "");
    const wordCount = textOnly
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  });
}
