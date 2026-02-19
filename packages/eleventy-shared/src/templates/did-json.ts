import type { SharedPluginOptions } from "../types.ts";

/**
 * W3C Decentralized Identifier (DID) document using the did:web method.
 *
 * @see https://www.w3.org/TR/did-1.1/
 * @see https://w3c-ccg.github.io/did-method-web/
 */
export function registerDidJson(eleventyConfig: any, options: SharedPluginOptions): void {
  const hostname = new URL(options.url).hostname;
  const did = `did:web:${hostname}`;
  const services = options.didDocument!.services;

  eleventyConfig.addTemplate(
    "shared-did.11ty.js",
    {
      render() {
        return JSON.stringify({
          "@context": [
            "https://www.w3.org/ns/did/v1",
            "https://w3id.org/security/suites/ed25519-2020/v1",
          ],
          id: did,
          service: services.map((s) => ({
            id: `${did}#${s.id}`,
            type: s.type,
            serviceEndpoint: s.endpoint,
          })),
        }, null, 2);
      },
    },
    {
      permalink: "/.well-known/did.json",
      eleventyExcludeFromCollections: true,
    },
  );
}
