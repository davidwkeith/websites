import childProcess from "node:child_process";
import type { SharedPluginOptions } from "./types.ts";
import { registerGpcJson } from "./templates/gpc-json.ts";
import { registerSecurityTxt } from "./templates/security-txt.ts";
import { registerSitemapXml } from "./templates/sitemap-xml.ts";
import { registerHumansTxt } from "./templates/humans-txt.ts";
import { registerRobotsTxt } from "./templates/robots-txt.ts";
import { registerFourOhFour } from "./templates/four-oh-four.ts";
import { registerHostMeta } from "./templates/host-meta.ts";
import { registerWebfinger } from "./templates/webfinger.ts";
import { registerNostrJson } from "./templates/nostr-json.ts";
import { registerDidJson } from "./templates/did-json.ts";
import { registerAtprotoDid } from "./templates/atproto-did.ts";
import { registerDntPolicy } from "./templates/dnt-policy.ts";
import { registerTypescript } from "./config/typescript.ts";
import { registerHtmlMinifier } from "./config/html-minifier.ts";
import { registerDateFilters } from "./config/date-filters.ts";
import { registerShortcodes } from "./config/shortcodes.ts";
import { registerBundles } from "./config/bundles.ts";

export type { SharedPluginOptions } from "./types.ts";

/**
 * Returns the short git commit hash of HEAD.
 */
export function getCommitHash(): string {
  return childProcess.execSync("git rev-parse --short HEAD").toString().trim();
}

/**
 * Shared Eleventy plugin for dwk.io sites.
 *
 * Registers virtual templates and common config patterns.
 * Each template uses the options object via closure rather than
 * reading from the global data cascade.
 */
export default function sharedPlugin(
  eleventyConfig: any,
  options: SharedPluginOptions,
): void {
  // Config registrations
  if (!options.disableConfig?.typescript) {
    registerTypescript(eleventyConfig);
  }
  if (!options.disableConfig?.htmlMinifier) {
    registerHtmlMinifier(eleventyConfig);
  }
  if (!options.disableConfig?.dateFilters) {
    registerDateFilters(eleventyConfig);
  }
  if (!options.disableConfig?.shortcodes) {
    registerShortcodes(eleventyConfig);
  }
  if (!options.disableConfig?.bundles) {
    registerBundles(eleventyConfig);
  }

  // Virtual template registrations
  if (!options.disable?.gpc) {
    registerGpcJson(eleventyConfig);
  }
  if (!options.disable?.securityTxt) {
    registerSecurityTxt(eleventyConfig, options);
  }
  if (!options.disable?.sitemap) {
    registerSitemapXml(eleventyConfig, options);
  }
  if (!options.disable?.humansTxt) {
    registerHumansTxt(eleventyConfig, options);
  }
  if (!options.disable?.robotsTxt) {
    registerRobotsTxt(eleventyConfig, options);
  }
  if (!options.disable?.fourOhFour) {
    registerFourOhFour(eleventyConfig, options);
  }

  // Opt-in .well-known templates (registered when their option is provided)
  if (options.webfinger) {
    registerWebfinger(eleventyConfig, options);
    // host-meta defaults to true when webfinger is set
    if (options.hostMeta !== false) {
      registerHostMeta(eleventyConfig, options);
    }
  } else if (options.hostMeta) {
    registerHostMeta(eleventyConfig, options);
  }
  if (options.nostr) {
    registerNostrJson(eleventyConfig, options);
  }
  if (options.didDocument) {
    registerDidJson(eleventyConfig, options);
  }
  if (options.atprotoDid) {
    registerAtprotoDid(eleventyConfig, options);
  }
  if (options.dntPolicy) {
    registerDntPolicy(eleventyConfig, options);
  }
}
