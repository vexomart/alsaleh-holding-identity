// Standalone decompress shim - NO imports from brotli

function decompress(buffer: Uint8Array | ArrayBuffer | number[]): Uint8Array {
  if (buffer instanceof Uint8Array) {
    return buffer;
  }
  if (buffer instanceof ArrayBuffer) {
    return new Uint8Array(buffer);
  }
  return new Uint8Array(buffer);
}

export default decompress;
export { decompress };
