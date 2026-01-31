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

async function fetchAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch font (${res.status}) from ${url}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
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
