/**
 * Shared date filters.
 *
 * htmlDateString: YYYY-MM-DD format.
 * readableDate: Human-readable US English format.
 */
export function registerDateFilters(eleventyConfig: any): void {
  eleventyConfig.addFilter("htmlDateString", (dateObj: Date) => {
    return dateObj.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("readableDate", (dateObj: Date) => {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
}
