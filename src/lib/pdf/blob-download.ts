/**
 * Reliable browser download helper
 *
 * Some browsers block pdfmake's internal download when it's triggered
 * after async work. This helper forces a download via an <a download>
 * link using a Blob URL.
 */

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after a short delay to allow the download to start.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
