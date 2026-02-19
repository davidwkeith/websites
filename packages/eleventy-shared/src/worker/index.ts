export type { Redirect, HeaderRule, WorkerHandlerConfig } from "./types.ts";

/**
 * Common security headers applied to all responses.
 */
export const COMMON_SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer-when-downgrade",
  "Strict-Transport-Security":
    "max-age=31536000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

/**
 * Match a pathname against a pattern.
 * Supports exact matches, catch-all "/*", and prefix wildcards "/path/*".
 */
export function matchesPattern(pathname: string, pattern: string): boolean {
  if (pattern === "/*") return true;
  if (pattern.endsWith("/*")) {
    return pathname.startsWith(pattern.slice(0, -1));
  }
  return pathname === pattern;
}

/**
 * Apply matching header rules to a Headers object.
 */
export function applyHeaderRules(
  headers: Headers,
  pathname: string,
  rules: import("./types.ts").HeaderRule[],
): void {
  for (const rule of rules) {
    if (matchesPattern(pathname, rule.source)) {
      for (const [key, value] of Object.entries(rule.headers)) {
        headers.set(key, value);
      }
    }
  }
}

/**
 * Handle redirects. Returns a redirect Response if matched, or null.
 */
export function handleRedirects(
  url: URL,
  redirects: import("./types.ts").Redirect[],
): Response | null {
  for (const redirect of redirects) {
    if (url.pathname === redirect.source) {
      return Response.redirect(
        new URL(redirect.destination, url.origin).href,
        redirect.code,
      );
    }
  }
  return null;
}

/**
 * Handle www-to-apex redirect. Returns a redirect Response if matched, or null.
 */
export function handleWwwRedirect(
  url: URL,
  apexHostname: string,
): Response | null {
  if (url.hostname === `www.${apexHostname}`) {
    url.hostname = apexHostname;
    return Response.redirect(url.href, 301);
  }
  return null;
}

/**
 * Create a standard Cloudflare Worker fetch handler.
 *
 * Handles: www redirect → path redirects → optional `before` hook → asset fetch → header rules.
 */
export function createWorkerHandler(
  config: import("./types.ts").WorkerHandlerConfig,
): (request: Request, env: any, ctx: any) => Promise<Response> {
  return async (request, env, _ctx) => {
    const url = new URL(request.url);

    // Canonical hostname redirect
    if (config.hostname) {
      const wwwRedirect = handleWwwRedirect(url, config.hostname);
      if (wwwRedirect) return wwwRedirect;
    }

    // Path redirects
    if (config.redirects) {
      const redirect = handleRedirects(url, config.redirects);
      if (redirect) return redirect;
    }

    // Pre-fetch middleware
    if (config.before) {
      const earlyResponse = await config.before(request, url, env);
      if (earlyResponse) return earlyResponse;
    }

    // Fetch static asset
    const response = await env.ASSETS.fetch(request);

    // Apply header rules
    if (config.headerRules?.length) {
      const headers = new Headers(response.headers);
      applyHeaderRules(headers, url.pathname, config.headerRules);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  };
}
