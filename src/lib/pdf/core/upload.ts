/**
 * PDF Upload helper (optional)
 *
 * IMPORTANT: Upload must never block local download.
 * This module provides a best-effort upload that callers can run in the background.
 */

import { supabase } from '@/integrations/supabase/client';

export interface UploadPdfResult {
  url: string;
  path: string;
}

/**
 * Upload a PDF blob to backend storage.
 *
 * NOTE: This assumes a bucket exists. If it doesn't, this will throw.
 * Callers MUST catch and treat as non-blocking.
 */
export async function uploadPdf(blob: Blob, path: string): Promise<UploadPdfResult> {
  const bucket = 'pdf';

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, blob, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  const url = data?.publicUrl;

  if (!url) {
    throw new Error('Failed to obtain uploaded PDF URL');
  }

  return { url, path };
}
