/**
 * PDF Download Diagnostics
 *
 * Single diagnostic wrapper to identify the exact stage of PDF failures.
 *
 * Stages:
 * - init
 * - font
 * - docDefinition
 * - getBlob
 * - download
 * - upload (non-blocking)
 */

import { toast } from 'sonner';
import { areFontsInitialized, getFontDiagnostics, initPdf } from '@/lib/pdf/core';
import { createInvoicePDFLocal, createContractPDFLocal } from '@/lib/pdf';
import { downloadBlob } from '@/lib/pdf/core';

export type PdfDiagnosticKind = 'invoice' | 'contract';

export interface PdfDiagnosticReport {
  ok: boolean;
  stage: 'init' | 'font' | 'docDefinition' | 'getBlob' | 'download' | 'upload';
  filename?: string;
  error?: string;
}

function getLanguageAndDir(): { lang: string; dir: string } {
  const el = document.documentElement;
  return {
    lang: el.getAttribute('lang') || 'unknown',
    dir: el.getAttribute('dir') || 'unknown',
  };
}

function errorToMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export async function runPdfDiagnostics(kind: PdfDiagnosticKind, payload: any): Promise<PdfDiagnosticReport> {
  const route = window.location.pathname;
  const { lang, dir } = getLanguageAndDir();

  console.group('[PDF] DIAGNOSTICS');
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

  let stage: PdfDiagnosticReport['stage'] = 'init';

  try {
    stage = 'init';
    await initPdf();

    stage = 'font';
    const diag = getFontDiagnostics();
    const cairoOk = diag.cairoRegularSize > 10_000 && diag.cairoBoldSize > 10_000;
    if (!cairoOk) {
      throw new Error('Cairo fonts missing from VFS');
    }

    stage = 'docDefinition';
    const local = kind === 'invoice'
      ? await createInvoicePDFLocal(payload)
      : await createContractPDFLocal(payload);

    stage = 'getBlob';
    const { blob, filename } = local;
    console.log('local generation OK:', { filename, blobType: blob.type, blobSize: blob.size });

    stage = 'download';
    // Force reliable download (anchor + objectURL)
    downloadBlob(blob, filename);

    console.log('download triggered');
    console.groupEnd();
    return { ok: true, stage, filename };
  } catch (err) {
    const message = errorToMessage(err);
    console.error('[PDF] DIAGNOSTICS FAILED:', { stage, err });
    toast.error(`فشل إنشاء PDF: ${message}`);
    console.groupEnd();
    return { ok: false, stage, error: message };
  }
}
