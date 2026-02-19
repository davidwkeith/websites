import type { SharedPluginOptions } from "../types.ts";

/**
 * humans.txt per humanstxt.org.
 * Receives Eleventy data cascade for generator and package version.
 *
 * @see https://humanstxt.org
 */
export function registerHumansTxt(
  eleventyConfig: any,
  options: SharedPluginOptions,
): void {
  const commitHash = options.humans?.commitHash;

  eleventyConfig.addTemplate(
    "shared-humans-txt.11ty.js",
    {
      render(data: any) {
        const buildDate =
          new Intl.DateTimeFormat("en-US", {
            dateStyle: "full",
            timeStyle: "short",
            timeZone: "UTC",
          }).format(new Date()) + " UTC";

        const generator = data.eleventy?.generator ?? "Eleventy";
        const pkgVersion = data.pkg?.version ?? "unknown";

        const lines = [
          "/* TEAM */",
          "\tDavid W. Keith @dwk.io",
          "",
          "/* THANKS */",
          "\tThanks to the Eleventy team for creating such a great static site generator.",
          "\tThanks to the WebC team for creating such a great templating language.",
          "\tThanks to the contributors of the projects I use on this site.",
          "\tThanks to the contributors of the projects I have used in the past.",
          "\tThanks to my family and friends for their support.",
          "",
          "/* SITE */",
          `Build Date: ${buildDate}`,
          `Generator: ${generator}`,
          `Package Version: ${pkgVersion}`,
        ];

        if (commitHash) {
          lines.push(`Commit Hash: ${commitHash}`);
        }

        return lines.join("\n");
      },
    },
    {
      permalink: "/humans.txt",
      eleventyExcludeFromCollections: true,
    },
  );
}
