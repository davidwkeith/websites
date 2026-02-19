import { pathToFileURL } from "node:url";

/**
 * Register .11ty.ts as equivalent to .11ty.js for TypeScript templates,
 * and .ts data files with native type stripping.
 */
export function registerTypescript(eleventyConfig: any): void {
  eleventyConfig.addExtension("11ty.ts", { key: "11ty.js" });

  eleventyConfig.addDataExtension("ts", {
    read: false,
    parser: async (filePath: string) => {
      const mod = await import(pathToFileURL(filePath).href);
      return mod.default ?? mod;
    },
  });
}
