/**
 * PDF DOWNLOAD BUTTON COMPONENT
 * 
 * Button with loading state for downloading PDFs.
 */

import React, { useState, useCallback } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { generatePdfBlob, downloadPdfBlob, type DocDefinition } from '../core';

type DownloadState = 'idle' | 'generating' | 'success' | 'error';

export interface PdfDownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Document definition to generate */
  docDefinition: DocDefinition;
  /** Filename for download */
  filename: string;
  /** Button label */
  label?: string;
  /** Show success state briefly */
  showSuccess?: boolean;
  /** On download complete */
  onComplete?: (success: boolean) => void;
}

export function PdfDownloadButton({
  docDefinition,
  filename,
  label = 'تحميل PDF',
  showSuccess = true,
  onComplete,
  className,
  disabled,
  variant = 'outline',
  size = 'default',
  ...props
}: PdfDownloadButtonProps) {
  const [state, setState] = useState<DownloadState>('idle');

  const handleDownload = useCallback(async () => {
    if (state === 'generating') return;

    setState('generating');

    try {
      console.log('[PDF Download] Starting generation...');
      const blob = await generatePdfBlob(docDefinition, { timeout: 60000, retries: 1 });
      
      console.log('[PDF Download] Blob ready, downloading...');
      const result = downloadPdfBlob(blob, filename);

      if (result.success) {
        setState('success');
        if (showSuccess) {
          toast.success('تم تحميل الملف بنجاح');
        }
        onComplete?.(true);
        
        // Reset to idle after brief delay
        setTimeout(() => setState('idle'), 2000);
      } else {
        throw new Error(result.error || 'DOWNLOAD_FAILED');
      }
    } catch (error) {
      console.error('[PDF Download] Failed:', error);
      setState('error');
      
      const message = error instanceof Error ? error.message : 'فشل تحميل الملف';
      toast.error(message.includes('TIMEOUT') 
        ? 'استغرق التوليد وقتاً طويلاً — جرب مرة أخرى'
        : 'فشل تحميل الملف'
      );
      
      onComplete?.(false);
      
      // Reset to idle after brief delay
      setTimeout(() => setState('idle'), 2000);
    }
  }, [docDefinition, filename, showSuccess, onComplete, state]);

  const getIcon = () => {
    switch (state) {
      case 'generating':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (state) {
      case 'generating':
        return 'جاري التحميل...';
      case 'success':
        return 'تم التحميل';
      case 'error':
        return 'فشل التحميل';
      default:
        return label;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      disabled={disabled || state === 'generating'}
      onClick={handleDownload}
      {...props}
    >
      {getIcon()}
      {getLabel()}
    </Button>
  );
}

export default PdfDownloadButton;
