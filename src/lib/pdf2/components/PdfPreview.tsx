/**
 * PDF PREVIEW COMPONENT
 * 
 * Renders PDF preview using data URL in an iframe.
 */

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Loader2, AlertCircle, Download, RefreshCw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { generatePdfDataUrl, type DocDefinition } from '../core';
import { downloadPdfBlob, generatePdfBlob } from '../core';

export interface PdfPreviewProps {
  /** Document definition to render */
  docDefinition: DocDefinition;
  /** Preview height */
  height?: number | string;
  /** Show download button */
  showDownload?: boolean;
  /** Filename for download */
  filename?: string;
  /** Additional class name */
  className?: string;
  /** On error callback */
  onError?: (error: Error) => void;
  /** On load callback */
  onLoad?: () => void;
}

export interface PdfPreviewRef {
  refresh: () => void;
  download: () => Promise<void>;
}

type LoadingState = 'idle' | 'loading' | 'ready' | 'error';

export const PdfPreview = forwardRef<PdfPreviewRef, PdfPreviewProps>(
  function PdfPreview(
    {
      docDefinition,
      height = 500,
      showDownload = true,
      filename = 'document.pdf',
      className,
      onError,
      onLoad,
    },
    ref
  ) {
    const [state, setState] = useState<LoadingState>('idle');
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generatePreview = useCallback(async () => {
      setState('loading');
      setError(null);
      setDataUrl(null);

      try {
        const url = await generatePdfDataUrl(docDefinition, { timeout: 60000 });
        setDataUrl(url);
        setState('ready');
        onLoad?.();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'فشل توليد المعاينة';
        setError(errorMsg);
        setState('error');
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      }
    }, [docDefinition, onError, onLoad]);

    const handleDownload = useCallback(async () => {
      try {
        const blob = await generatePdfBlob(docDefinition);
        downloadPdfBlob(blob, filename);
      } catch (err) {
        console.error('[PDF Preview] Download failed:', err);
      }
    }, [docDefinition, filename]);

    const handleFullscreen = useCallback(() => {
      if (dataUrl) {
        window.open(dataUrl, '_blank');
      }
    }, [dataUrl]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      refresh: generatePreview,
      download: handleDownload,
    }));

    // Generate on mount and when docDefinition changes
    useEffect(() => {
      generatePreview();
    }, [generatePreview]);

    return (
      <div className={cn('relative rounded-lg border bg-muted/30 overflow-hidden', className)}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-background/50">
          <span className="text-sm text-muted-foreground">معاينة PDF</span>
          <div className="flex items-center gap-2">
            {state === 'ready' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="h-8 w-8 p-0"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                {showDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={generatePreview}
              disabled={state === 'loading'}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={cn('h-4 w-4', state === 'loading' && 'animate-spin')} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div style={{ height }} className="relative">
          {/* Loading */}
          {state === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">جاري توليد المعاينة...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center p-6">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <div className="space-y-1">
                  <p className="font-medium text-destructive">فشل توليد المعاينة</p>
                  <p className="text-sm text-muted-foreground max-w-[300px]">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={generatePreview}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}

          {/* Preview iframe */}
          {state === 'ready' && dataUrl && (
            <iframe
              src={dataUrl}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          )}
        </div>
      </div>
    );
  }
);

export default PdfPreview;
