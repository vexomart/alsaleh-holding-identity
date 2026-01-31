/**
 * Embedded Cairo TTF loader for pdfmake
 *
 * Requirement: use TTF fonts embedded into pdfmake VFS (no system fonts).
 *
 * We ship the TTF files inside the repo (src/assets/fonts) and load them
 * at runtime, converting to base64 and registering them into pdfMake.vfs.
 */

import cairoRegularUrl from '@/assets/fonts/Cairo-Regular.ttf?url';
import cairoBoldUrl from '@/assets/fonts/Cairo-Bold.ttf?url';

function bytesToHex(bytes: Uint8Array, max: number = bytes.length): string {
  const slice = bytes.slice(0, Math.min(bytes.length, max));
  return Array.from(slice)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

function readFontSignature(first4: Uint8Array): {
  kind: 'TTF' | 'OTF' | 'UNKNOWN';
  hex: string;
  ascii: string;
} {
  const hex = bytesToHex(first4, 4);
  const ascii = String.fromCharCode(...Array.from(first4));

  // TrueType: 00 01 00 00
  if (first4.length >= 4 && first4[0] === 0x00 && first4[1] === 0x01 && first4[2] === 0x00 && first4[3] === 0x00) {
    return { kind: 'TTF', hex, ascii: '"\\x00\\x01\\x00\\x00"' };
  }

  // OpenType: "OTTO"
  if (ascii === 'OTTO') {
    return { kind: 'OTF', hex, ascii: 'OTTO' };
  }

  return { kind: 'UNKNOWN', hex, ascii };
}

async function fetchAsBase64(url: string): Promise<string> {
  console.log('[PDF FONT] Fetching font:', url);
  const res = await fetch(url);
  console.log('[PDF FONT] Font fetch status:', res.status, res.statusText);
  if (!res.ok) {
    throw new Error(`Failed to fetch font (${res.status}) from ${url}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const signatureBytes = bytes.slice(0, 4);
  const sig = readFontSignature(signatureBytes);
  console.log('[PDF FONT] First 4 bytes (hex):', sig.hex);
  console.log('[PDF FONT] Signature (ascii/kind):', sig.ascii, sig.kind);

  if (sig.kind === 'UNKNOWN') {
    // Common failure: 404 HTML encoded as base64 (often starts with "<!DO")
    const first64Ascii = String.fromCharCode(...Array.from(bytes.slice(0, Math.min(bytes.length, 64))));
    console.error('[PDF FONT] Invalid font signature. First bytes preview:', first64Ascii);
    throw new Error('Invalid font file (not TTF/OTF). Fix font path.');
  }

  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function loadCairoTTFAsVfs(): Promise<{ regular: string; bold: string }> {
  const [regular, bold] = await Promise.all([
    fetchAsBase64(cairoRegularUrl),
    fetchAsBase64(cairoBoldUrl),
  ]);
  return { regular, bold };
}
