// Shim for brotli to fix ESM default export issue
// The brotli package is CommonJS and doesn't have a default export
import * as brotli from 'brotli';

export const decompress = (brotli as any).decompress;
export const compress = (brotli as any).compress;
export default brotli;
