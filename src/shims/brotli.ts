// Complete standalone brotli package mock
// Does NOT import from brotli to avoid circular ESM issues

export function decompress(buffer: Uint8Array | ArrayBuffer | number[]): Uint8Array {
  // For PDF generation, brotli decompression is rarely needed
  // Return buffer as-is
  if (buffer instanceof Uint8Array) {
    return buffer;
  }
  if (buffer instanceof ArrayBuffer) {
    return new Uint8Array(buffer);
  }
  return new Uint8Array(buffer);
}

export function compress(buffer: Uint8Array | ArrayBuffer | number[], options?: any): Uint8Array {
  if (buffer instanceof Uint8Array) {
    return buffer;
  }
  if (buffer instanceof ArrayBuffer) {
    return new Uint8Array(buffer);
  }
  return new Uint8Array(buffer);
}

// Default export
const brotli = { decompress, compress };
export default brotli;
