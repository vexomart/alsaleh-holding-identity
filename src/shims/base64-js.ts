// Vite/ESM interop shim for `base64-js`.
// بعض الحزم (خصوصًا المرتبطة بالـ PDF) قد تستورد `base64-js` كـ default import.
// مكتبة base64-js لا تُصدّر default في ESM بشكل مباشر، لذا نوحّد السلوك هنا.

// IMPORTANT: Import the real module via subpath to bypass the Vite alias above.
import * as base64 from "base64-js/index.js";

// Re-export named exports
export const toByteArray = (base64 as any).toByteArray as typeof import("base64-js").toByteArray;
export const fromByteArray = (base64 as any).fromByteArray as typeof import("base64-js").fromByteArray;

// Provide a default export for consumers expecting `default`
const defaultExport = {
  toByteArray,
  fromByteArray,
};

export default defaultExport;
