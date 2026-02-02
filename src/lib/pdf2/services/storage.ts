/**
 * PDF STORAGE SERVICE
 * 
 * Upload PDFs to Supabase storage and generate shareable links.
 */

import { supabase } from '@/integrations/supabase/client';

const BUCKET_NAME = 'documents';

export interface StorageResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadOptions {
  /** Folder path within the bucket */
  folder?: string;
  /** Make file publicly accessible */
  publicAccess?: boolean;
  /** Custom filename (without extension) */
  filename?: string;
  /** Metadata to store with the file */
  metadata?: Record<string, string>;
}

/**
 * Generate unique filename
 */
function generateFilename(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}.pdf`;
}

/**
 * Upload PDF blob to storage
 */
export async function uploadPdfToStorage(
  blob: Blob,
  options: UploadOptions = {}
): Promise<StorageResult> {
  const {
    folder = 'pdfs',
    publicAccess = false,
    filename,
    metadata,
  } = options;

  try {
    // Generate path
    const fileName = filename 
      ? `${filename}.pdf` 
      : generateFilename('document');
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    console.log(`[PDF Storage] Uploading to ${filePath}...`);

    // Upload to storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('[PDF Storage] Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get URL
    let url: string;
    if (publicAccess) {
      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);
      url = publicData.publicUrl;
    } else {
      const { data: signedData, error: signError } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(data.path, 86400); // 24 hours

      if (signError) {
        console.error('[PDF Storage] Signed URL error:', signError);
        return { success: false, error: signError.message };
      }
      url = signedData.signedUrl;
    }

    console.log(`[PDF Storage] ✅ Uploaded successfully: ${url}`);

    return {
      success: true,
      url,
      path: data.path,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PDF Storage] Exception:', error);
    return { success: false, error: message };
  }
}

/**
 * Get signed URL for existing file
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 86400
): Promise<StorageResult> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl, path: filePath };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Delete PDF from storage
 */
export async function deletePdfFromStorage(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('[PDF Storage] Delete error:', error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * List PDFs in a folder
 */
export async function listPdfs(folder: string = 'pdfs'): Promise<{
  success: boolean;
  files?: Array<{ name: string; path: string; created_at: string }>;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const files = data
      .filter(f => f.name.endsWith('.pdf'))
      .map(f => ({
        name: f.name,
        path: `${folder}/${f.name}`,
        created_at: f.created_at || '',
      }));

    return { success: true, files };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
