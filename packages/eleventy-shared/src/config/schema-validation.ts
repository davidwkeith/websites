import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

/**
 * JSON Schema validating top-level Schema.org JSON-LD structure.
 */
const rootSchema = ajv.compile({
  type: "object",
  required: ["@context", "@type"],
  properties: {
    "@context": { type: "string", const: "https://schema.org" },
    "@type": { type: "string", minLength: 1 },
  },
});

/**
 * JSON Schema validating nested typed objects (must have non-empty @type).
 */
const nestedTypeSchema = ajv.compile({
  type: "object",
  required: ["@type"],
  properties: {
    "@type": { type: "string", minLength: 1 },
  },
});

/**
 * Recursively finds all nested objects that contain an @type property.
 */
function findNestedTypedObjects(
  obj: Record<string, unknown>,
  path: string,
): Array<{ path: string; value: Record<string, unknown> }> {
  const results: Array<{ path: string; value: Record<string, unknown> }> = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key === "@context" || key === "@type") continue;
    const currentPath = `${path}/${key}`;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = value as Record<string, unknown>;
      if ("@type" in nested) {
        results.push({ path: currentPath, value: nested });
      }
      results.push(...findNestedTypedObjects(nested, currentPath));
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const nested = item as Record<string, unknown>;
          const itemPath = `${currentPath}/${i}`;
          if ("@type" in nested) {
            results.push({ path: itemPath, value: nested });
          }
          results.push(...findNestedTypedObjects(nested, itemPath));
        }
      });
    }
  }
  return results;
}

/**
 * Registers the `getSchema` JavaScript function for build-time
 * Schema.org JSON-LD validation using ajv.
 */
export function registerSchemaValidation(eleventyConfig: any): void {
  eleventyConfig.addJavaScriptFunction("getSchema", (schema: unknown) => {
    const errors: string[] = [];

    if (!rootSchema(schema)) {
      for (const err of rootSchema.errors ?? []) {
        errors.push(`${err.instancePath || "/"}: ${err.message}`);
      }
    }

    if (schema && typeof schema === "object" && !Array.isArray(schema)) {
      for (const { path, value } of findNestedTypedObjects(
        schema as Record<string, unknown>,
        "",
      )) {
        if (!nestedTypeSchema(value)) {
          for (const err of nestedTypeSchema.errors ?? []) {
            errors.push(`${path}${err.instancePath}: ${err.message}`);
          }
        }
      }
    }

    if (errors.length > 0) {
      console.error("Schema.org JSON-LD validation errors:");
      errors.forEach((msg) => console.error(`  - ${msg}`));
      throw new Error(
        "Invalid Schema.org JSON-LD detected. See console for details.",
      );
    }

    return JSON.stringify(schema);
  });
}
