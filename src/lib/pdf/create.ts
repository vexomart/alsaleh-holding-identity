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
import { blobToDataUrl } from './core/download';
import { downloadPdfGuaranteed } from './download-engine';
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

  let downloadOk = false;
  if (options.download) {
    const normalized = blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' });
    if (normalized.type !== 'application/pdf' || normalized.size <= 10_000) {
      throw new Error('PDF blob invalid: type/size');
    }
    const result = downloadPdfGuaranteed({ blob: normalized, filename });
    if (result.ok === false) {
      console.error('[PDF] Download failed:', result.error);
      throw new Error('DOWNLOAD failed');
    }
    downloadOk = true;
  }

  if (options.uploadPath && (!options.download || downloadOk)) {
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

  let downloadOk = false;
  if (options.download) {
    const normalized = blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' });
    if (normalized.type !== 'application/pdf' || normalized.size <= 10_000) {
      throw new Error('PDF blob invalid: type/size');
    }
    const result = downloadPdfGuaranteed({ blob: normalized, filename });
    if (result.ok === false) {
      console.error('[PDF] Download failed:', result.error);
      throw new Error('DOWNLOAD failed');
    }
    downloadOk = true;
  }

  if (options.uploadPath && (!options.download || downloadOk)) {
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

