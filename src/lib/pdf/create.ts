/**
 * High-level PDF creation wrappers
 *
 * Goals:
 * - Always generate Blob locally first
 * - If download requested, trigger download immediately
 * - Attempt upload (optional) without blocking download
 * - Never swallow errors
 */

import { toast } from 'sonner';
import { downloadBlob, blobToDataUrl } from './core/download';
import { uploadPdf as uploadPdfImpl } from './core/upload';
import {
  createInvoicePDFLocal,
  type CreateInvoicePDFOptions,
  createContractPDFLocal,
  type CreateContractPDFOptions,
} from './templates';

export type UploadableOptions = {
  uploadPath?: string;
};

export async function createInvoicePDF(
  invoice: Parameters<typeof createInvoicePDFLocal>[0],
  options: (CreateInvoicePDFOptions & UploadableOptions) = {}
): Promise<{ blob?: Blob; dataUrl?: string }> {
  const { blob, filename } = await createInvoicePDFLocal(invoice, options);

  if (options.download) {
    downloadBlob(blob, filename);
  }

  if (options.uploadPath) {
    // Non-blocking best-effort upload
    uploadPdfImpl(blob, options.uploadPath)
      .then(({ url }) => {
        console.log('[PDF] Upload OK:', url);
      })
      .catch((err) => {
        console.error('[PDF] Upload failed (non-blocking):', err);
        toast.warning('تم تحميل PDF محلياً، لكن فشل رفعه إلى التخزين');
      });
  }

  if (!options.download) {
    const dataUrl = await blobToDataUrl(blob);
    return { blob, dataUrl };
  }

  return { blob };
}

export async function createContractPDF(
  contract: Parameters<typeof createContractPDFLocal>[0],
  options: (CreateContractPDFOptions & UploadableOptions) = {}
): Promise<{ blob?: Blob; dataUrl?: string }> {
  const { blob, filename } = await createContractPDFLocal(contract, options);

  if (options.download) {
    downloadBlob(blob, filename);
  }

  if (options.uploadPath) {
    uploadPdfImpl(blob, options.uploadPath)
      .then(({ url }) => {
        console.log('[PDF] Upload OK:', url);
      })
      .catch((err) => {
        console.error('[PDF] Upload failed (non-blocking):', err);
        toast.warning('تم تحميل PDF محلياً، لكن فشل رفعه إلى التخزين');
      });
  }

  if (!options.download) {
    const dataUrl = await blobToDataUrl(blob);
    return { blob, dataUrl };
  }

  return { blob };
}

export { uploadPdfImpl as uploadPdf };
