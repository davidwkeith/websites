import Image from "@11ty/eleventy-img";

/**
 * Shared image shortcodes for responsive images and OG metadata.
 */
export function registerImages(eleventyConfig: any): void {
  /**
   * Generates an optimized Open Graph image URL.
   */
  eleventyConfig.addShortcode("ogImage", async (src: string) => {
    if (!src) return "";
    const metadata = await Image(src, {
      widths: [1200],
      formats: ["jpeg"],
      outputDir: "./_site/img/og/",
      urlPath: "/img/og/",
      filenameFormat: (
        _id: string,
        _src: string,
        width: number,
        format: string,
      ) => `${_id}-${width}.${format}`,
    });
    return metadata.jpeg[0].url;
  });

  /**
   * Generates a responsive <picture> element with optimized images.
   */
  eleventyConfig.addShortcode(
    "image",
    async (src: string, alt: string, classes?: string) => {
      if (!src) {
        throw new Error("Image shortcode requires a 'src' attribute.");
      }
      if (!alt) {
        console.warn(`Image "${src}" is missing alt text.`);
      }

      const metadata = await Image(src, {
        widths: [400, 800, 1200, 1600],
        formats: ["webp", "jpeg"],
        outputDir: "./_site/img/",
        urlPath: "/img/",
        defaultAttributes: {
          loading: "lazy",
          decoding: "async",
        },
      });

      const imageAttributes: Record<string, string> = {
        alt,
        sizes: "(min-width: 1024px) 100vw, 50vw",
        loading: "lazy",
        decoding: "async",
      };

      if (classes) {
        imageAttributes.class = classes;
      }

      return Image.generateHTML(metadata, imageAttributes);
    },
  );
}
