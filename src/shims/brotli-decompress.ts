// ESM interop shim for `brotli/decompress(.js)`.
// Some packages import the subpath and expect a *default* export.
// The underlying `brotli` package is CommonJS and typically doesn't provide ESM default exports.

// NOTE: We intentionally import from the real package entry.
// Vite can synthesize named exports for CJS in most cases.
// If not, we still fall back to `.default` / property access.
import * as brotli from "brotli";

const decompressFn = (brotli as any).decompress ?? (brotli as any).default?.decompress;

export default decompressFn;
export const decompress = decompressFn;
