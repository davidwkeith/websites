import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Walk all HTML files in buildDir and add SHA-384 SRI integrity attributes
 * to local <link rel="stylesheet"> and <script> tags.
 *
 * Requires `cheerio` as a peer dependency.
 */
export async function addSriHashes(buildDir: string): Promise<void> {
  const cheerio = await import("cheerio");

  const files = await fs.readdir(buildDir, { recursive: true });
  const htmlFiles = files
    .filter((file): file is string => typeof file === "string" && file.endsWith(".html"))
    .map((file) => path.join(buildDir, file));

  for (const htmlFile of htmlFiles) {
    const html = await fs.readFile(htmlFile, "utf8");
    const $ = cheerio.load(html);

    const promises: Promise<void>[] = [];

    $('link[rel="stylesheet"], script').each((_i, el) => {
      const $el = $(el);
      const srcAttr = $el.attr("src") || $el.attr("href");
      if (srcAttr && !srcAttr.startsWith("http") && !srcAttr.startsWith("//")) {
        const assetPath = path.join(buildDir, srcAttr);
        promises.push(
          fs.readFile(assetPath)
            .then((content) => {
              const hash = crypto.createHash("sha384").update(content).digest("base64");
              $el.attr("integrity", `sha384-${hash}`);
              $el.attr("crossorigin", "anonymous");
            })
            .catch((e) => {
              console.warn(`SRI: Could not process ${assetPath}: ${(e as Error).message}`);
            }),
        );
      }
    });

    await Promise.all(promises);
    await fs.writeFile(htmlFile, $.html());
  }

  console.log("SRI: Successfully added integrity attributes to HTML files.");
}

interface SignOptions {
  /** If true, log what would be signed without writing. */
  dryRun?: boolean;
}

/**
 * Sign security.txt with an OpenPGP cleartext signature per RFC 9116 §2.3.
 *
 * Reads GPG_PRIVATE_KEY (and optionally GPG_PASSPHRASE) from environment.
 * Skips gracefully if GPG_PRIVATE_KEY is not set.
 *
 * Requires `openpgp` as a peer dependency.
 */
export async function signSecurityTxt(buildDir: string, options?: SignOptions): Promise<void> {
  const securityTxtPath = path.join(buildDir, ".well-known", "security.txt");
  const armoredKey = process.env.GPG_PRIVATE_KEY;

  if (!armoredKey) {
    console.warn("PGP: GPG_PRIVATE_KEY not set, skipping security.txt signing.");
    return;
  }

  const openpgp = await import("openpgp");
  const content = await fs.readFile(securityTxtPath, "utf8");

  let privateKey = await openpgp.readPrivateKey({ armoredKey });
  if (!privateKey.isDecrypted()) {
    const passphrase = process.env.GPG_PASSPHRASE;
    if (!passphrase) {
      throw new Error("PGP: Key is passphrase-protected but GPG_PASSPHRASE is not set.");
    }
    privateKey = await openpgp.decryptKey({ privateKey, passphrase });
  }

  if (options?.dryRun) {
    console.log("[sign] dry-run: would sign security.txt with key", privateKey.getKeyID().toHex());
    return;
  }

  const message = await openpgp.createCleartextMessage({ text: content });
  const signed = await openpgp.sign({ message, signingKeys: privateKey });

  await fs.writeFile(securityTxtPath, signed as string);
  console.log("PGP: Successfully signed security.txt.");
}
