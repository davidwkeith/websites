/**
 * Configuration options for the shared Eleventy plugin.
 * Each site passes its specific values; templates access them via closure.
 */
export interface SharedPluginOptions {
  /** Full site URL as a string (e.g., "https://dwk.io") */
  url: string;

  /** BCP 47 language code (e.g., "en") */
  language: string;

  /** RFC 9116 security contact URI (e.g., "mailto:security@dwk.io") */
  securityContact: string;

  /** Sitemap configuration. */
  sitemap?: {
    /** Output permalink. Default: "/sitemap.xml" */
    permalink?: string;
  };

  /** robots.txt configuration. */
  robots?: {
    /** Output permalink. Default: "/robots.txt" */
    permalink?: string;
    /** Text inserted before the User-agent block (e.g., content signals comments). */
    preamble?: string;
    /** Directives within the User-agent block. Default: ["Disallow:"] */
    directives?: string[];
  };

  /** humans.txt configuration. */
  humans?: {
    /** Git commit hash to include in the SITE section. */
    commitHash?: string;
  };

  /** 404 page configuration. Omit to skip 404 template registration. */
  fourOhFour?: {
    /** Layout name (e.g., "base.webc" or "layouts/base.njk") */
    layout: string;
    /** Page title. Default: "404 Not Found" */
    title?: string;
  };

  /** WebFinger / Fediverse discovery. Opt-in: only registered when set. */
  webfinger?: {
    handle: string;
    instance: string;
  };

  /** Nostr NIP-05 identity verification. Opt-in: only registered when set. */
  nostr?: {
    handle: string;
    pubkey: string;
  };

  /** W3C DID document (did:web). Opt-in: only registered when set. */
  didDocument?: {
    services: Array<{ id: string; type: string; endpoint: string }>;
  };

  /** AT Protocol DID string for Bluesky handle verification. Opt-in. */
  atprotoDid?: string;

  /** Enable DNT compliance policy at /.well-known/dnt-policy.txt. */
  dntPolicy?: boolean;

  /** Enable host-meta for WebFinger bootstrap. Defaults to true when webfinger is set. */
  hostMeta?: boolean;

  /** Disable individual virtual templates. */
  disable?: {
    gpc?: boolean;
    securityTxt?: boolean;
    sitemap?: boolean;
    humansTxt?: boolean;
    robotsTxt?: boolean;
    fourOhFour?: boolean;
  };

  /** Disable individual config registrations. */
  disableConfig?: {
    typescript?: boolean;
    htmlMinifier?: boolean;
    dateFilters?: boolean;
    shortcodes?: boolean;
    bundles?: boolean;
    schemaValidation?: boolean;
  };
}
