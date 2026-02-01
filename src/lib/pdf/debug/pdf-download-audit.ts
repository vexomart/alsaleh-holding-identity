/**
 * Strict PDF Download Audit
 *
 * Stages (strict): click | generate | blob | download | upload
 * - لا يوجد silent catch
 * - أي فشل يجب أن يظهر في console + toast مع المرحلة
 */

import { toast } from 'sonner';
import { initPdf } from '@/lib/pdf/core';
import { createInvoicePDFLocal, createContractPDFLocal, uploadPdf } from '@/lib/pdf';
import { downloadPdfGuaranteed, type DownloadMethod } from '@/lib/pdf/download-engine';

export type DownloadAuditKind = 'invoice' | 'contract';
export type DownloadAuditStage = 'click' | 'generate' | 'blob' | 'download' | 'upload';

export type DownloadAuditReport =
  | { ok: true; method: DownloadMethod; filename: string }
  | { ok: false; stage: DownloadAuditStage; error: unknown };

function errorToMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function normalizePdfBlob(blob: Blob): Blob {
  if (blob.type === 'application/pdf') return blob;
  return new Blob([blob], { type: 'application/pdf' });
}

function assertValidPdfBlob(blob: Blob): void {
  if (blob.type !== 'application/pdf') {
    throw new Error(`PDF blob invalid: type (${blob.type || 'empty'})`);
  }
  if (blob.size <= 10_000) {
    throw new Error(`PDF blob invalid: size (${blob.size})`);
  }
}

/**
 * Runs strict audit and triggers guaranteed download.
 *
 * NOTE: upload is intentionally optional and never blocks download.
 */
export async function runDownloadAudit(
  kind: DownloadAuditKind,
  dto: any,
  options?: { uploadPath?: string }
): Promise<DownloadAuditReport> {
  let stage: DownloadAuditStage = 'click';

  console.group('[PDF] DOWNLOAD AUDIT');
  console.log('kind:', kind);
  console.log('route:', window.location.pathname);

  try {
    stage = 'click';
    console.log('CLICK OK');

    // Ensure fonts initialized before generation
    await initPdf();

    stage = 'generate';
    const local = kind === 'invoice'
      ? await createInvoicePDFLocal(dto)
      : await createContractPDFLocal(dto);

    stage = 'blob';
    const blob = normalizePdfBlob(local.blob);
    assertValidPdfBlob(blob);
    console.log('BLOB OK', { type: blob.type, size: blob.size });

    stage = 'download';
    const dl = downloadPdfGuaranteed({ blob, filename: local.filename });
    if (dl.ok === false) throw dl.error;
    console.log('DOWNLOAD OK', { method: dl.method });

    // Optional upload: ONLY after download success, never blocking
    if (options?.uploadPath) {
      stage = 'upload';
      uploadPdf(blob, options.uploadPath)
        .then(({ url }) => {
          console.log('[PDF] Upload OK:', url);
        })
        .catch((err) => {
          console.error('[PDF] Upload failed (non-blocking):', err);
          toast.warning('تم تحميل PDF محلياً، لكن فشل رفعه إلى التخزين');
        });
    }

    console.groupEnd();
    return { ok: true, method: dl.method, filename: local.filename };
  } catch (error) {
    console.error('[PDF] DOWNLOAD AUDIT FAILED', { stage, error });
    toast.error(`فشل تنزيل PDF (${stage}): ${errorToMessage(error)}`);
    console.groupEnd();
    return { ok: false, stage, error };
  }
}

// Dev-only global exposure
if (import.meta.env.DEV) {
  (window as any).runDownloadAudit = runDownloadAudit;
}
