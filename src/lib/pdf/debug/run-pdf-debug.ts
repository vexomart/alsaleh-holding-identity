/**
 * Strict PDF Debug Runner
 *
 * هدفه: تحديد مرحلة الفشل بدقة، وتأكيد أن التحميل المحلي يعمل 100% حتى لو فشل الرفع.
 *
 * Stages:
 * - init
 * - fonts
 * - docDefinition
 * - getBlob
 * - download
 * - upload (optional)
 */

import { toast } from 'sonner';
import {
  initPdf,
  areFontsInitialized,
  getFontDiagnostics,
} from '@/lib/pdf/core';
import {
  createInvoicePDFLocal,
  createContractPDFLocal,
  uploadPdf,
} from '@/lib/pdf';

import { downloadPdfGuaranteed } from '@/lib/pdf/download-engine';

export type PdfDebugKind = 'invoice' | 'contract';

export type PdfDebugStage = 'init' | 'fonts' | 'docDefinition' | 'getBlob' | 'download' | 'upload';

export interface PdfDebugReport {
  ok: boolean;
  stage: PdfDebugStage;
  filename?: string;
  uploadUrl?: string;
  error?: string;
}

function errorToMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function getLanguageAndDir(): { lang: string; dir: string } {
  const el = document.documentElement;
  return {
    lang: el.getAttribute('lang') || 'unknown',
    dir: el.getAttribute('dir') || 'unknown',
  };
}

function normalizePdfBlob(blob: Blob): Blob {
  // pdfmake should return application/pdf, لكن نُطبِّع للاحتياط
  if (blob.type === 'application/pdf') return blob;
  return new Blob([blob], { type: 'application/pdf' });
}

function assertValidPdfBlob(blob: Blob): void {
  if (blob.type !== 'application/pdf') throw new Error(`PDF blob invalid: type (${blob.type || 'empty'})`);
  if (blob.size <= 10_000) throw new Error(`PDF blob invalid: size (${blob.size})`);
}

export async function runPdfDebug(
  kind: PdfDebugKind,
  dto: any,
  options?: { uploadPath?: string }
): Promise<PdfDebugReport> {
  const route = window.location.pathname;
  const { lang, dir } = getLanguageAndDir();

  console.group('[PDF] DEBUG');
  console.log('kind:', kind);
  console.log('route:', route);
  console.log('language:', { lang, dir });

  const diagBefore = getFontDiagnostics();
  console.log('pdf core init state:', { fontsInitialized: areFontsInitialized() });
  console.log('Cairo VFS presence:', {
    vfsKeys: diagBefore.vfsKeys,
    cairoRegularSize: diagBefore.cairoRegularSize,
    cairoBoldSize: diagBefore.cairoBoldSize,
    registeredFonts: diagBefore.registeredFonts,
  });

  let stage: PdfDebugStage = 'init';

  try {
    stage = 'init';
    await initPdf();

    stage = 'fonts';
    // initPdf() سيقوم بـ assertFontsReady داخلياً؛ لو فشل نريد رسالة عربية واضحة
    const diag = getFontDiagnostics();
    const cairoOk = diag.cairoRegularSize > 10_000 && diag.cairoBoldSize > 10_000;
    if (!cairoOk) {
      throw new Error('خط Cairo غير محمّل — لا يمكن توليد PDF');
    }

    stage = 'docDefinition';
    const local = kind === 'invoice'
      ? await createInvoicePDFLocal(dto)
      : await createContractPDFLocal(dto);

    stage = 'getBlob';
    const blob = normalizePdfBlob(local.blob);
    assertValidPdfBlob(blob);
    const filename = local.filename;
    console.log('local generation OK:', { filename, blobType: blob.type, blobSize: blob.size });

    stage = 'download';
    const dl = downloadPdfGuaranteed({ blob, filename });
    if (dl.ok === false) throw dl.error;
    console.log('download triggered via:', dl.method);

    // Optional upload must never block download
    if (options?.uploadPath) {
      stage = 'upload';
      uploadPdf(blob, options.uploadPath)
        .then(({ url }) => {
          console.log('[PDF] Upload OK:', url);
          toast.success('تم رفع ملف PDF إلى التخزين');
        })
        .catch((err) => {
          console.error('[PDF] Upload failed (non-blocking):', err);
          toast.warning('تم تحميل PDF محلياً، لكن فشل رفعه إلى التخزين');
        });
    }

    console.groupEnd();
    return { ok: true, stage, filename };
  } catch (err) {
    const message = errorToMessage(err);
    console.error('[PDF] DEBUG FAILED:', { stage, err });
    toast.error(`فشل إنشاء PDF: ${message}`);
    console.groupEnd();
    return { ok: false, stage, error: message };
  }
}

