// Vite/ESM interop shim for `unicode-trie`.
// بعض الحزم (خصوصًا المرتبطة بالـ PDF/الخطوط) قد تستورد `unicode-trie` كـ default import.
// لكن الحزمة قد لا تُصدّر default، مما يسبب:
// "does not provide an export named 'default'".

// IMPORTANT: Import the real module via subpath to bypass the Vite alias.
import * as unicodeTrie from "unicode-trie/index.js";

export * from "unicode-trie/index.js";

// Provide a tolerant default export:
// - If the module ever provides a default, use it.
// - Otherwise, return the module namespace (common expectation for CJS-to-ESM default interop).
const defaultExport = (unicodeTrie as any).default ?? (unicodeTrie as any);

export default defaultExport;
