// ESM shim for `brotli/decompress(.js)`.
// Provides a mock decompression function to satisfy @react-pdf/renderer's import.
// The actual brotli decompression is rarely needed for PDF generation with embedded fonts.

function decompress(buffer: Uint8Array): Uint8Array {
  // For PDF generation with Cairo fonts, brotli decompression is typically not required.
  // If actual decompression is needed, this would need a proper implementation.
  console.warn("[brotli-shim] decompress called - returning input buffer as-is");
  return buffer;
}

export default decompress;
export { decompress };
