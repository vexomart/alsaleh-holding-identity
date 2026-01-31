/**
 * Invoice PDF Generator Component
 * 
 * Renders an invisible invoice template and generates PDF from it
 * using html2canvas + jsPDF for proper Arabic RTL support
 */

import React, { useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { InvoiceTemplate, type InvoiceTemplateData } from './InvoiceTemplate';
import { downloadPDFFromElement, generatePDFFromElement } from '@/lib/pdf/html-pdf-generator';

// Re-export the type for external use
export type { InvoiceTemplateData } from './InvoiceTemplate';

export interface InvoicePDFGeneratorProps {
  data: InvoiceTemplateData;
  onGenerate?: () => void;
  onComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
  filename?: string;
  download?: boolean;
  children: (props: { 
    generate: () => Promise<void>; 
    isGenerating: boolean 
  }) => React.ReactNode;
}

export function InvoicePDFGenerator({
  data,
  onGenerate,
  onComplete,
  onError,
  filename = 'invoice.pdf',
  download = true,
  children,
}: InvoicePDFGeneratorProps) {
  const templateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const generate = useCallback(async () => {
    try {
      setIsGenerating(true);
      onGenerate?.();
      
      // Show the template (offscreen) for rendering
      setShowTemplate(true);
      
      // Wait for React to render and fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!templateRef.current) {
        throw new Error('Template element not found');
      }

      if (download) {
        await downloadPDFFromElement(templateRef.current, { 
          filename,
          scale: 2,
        });
      } else {
        const blob = await generatePDFFromElement(templateRef.current, {
          scale: 2,
        });
        onComplete?.(blob);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      onError?.(error as Error);
    } finally {
      setShowTemplate(false);
      setIsGenerating(false);
    }
  }, [data, download, filename, onGenerate, onComplete, onError]);

  return (
    <>
      {children({ generate, isGenerating })}
      
      {/* Hidden template for PDF generation */}
      {showTemplate && createPortal(
        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            zIndex: -1,
          }}
        >
          <InvoiceTemplate ref={templateRef} data={data} />
        </div>,
        document.body
      )}
    </>
  );
}

/**
 * Direct function to generate invoice PDF (for use in hooks)
 */
export async function generateInvoicePDFDirect(
  data: InvoiceTemplateData,
  options: { filename?: string; download?: boolean } = {}
): Promise<Blob | void> {
  const { filename = 'invoice.pdf', download: shouldDownload = true } = options;
  
  // Create a container for the template
  const container = document.createElement('div');
  container.style.cssText = 'position: fixed; left: -9999px; top: 0; z-index: -1;';
  document.body.appendChild(container);
  
  // Render template
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(container);
  
  let templateElement: HTMLDivElement | null = null;
  
  await new Promise<void>((resolve) => {
    const TemplateWithRef = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      
      React.useEffect(() => {
        if (ref.current) {
          templateElement = ref.current;
          // Wait for fonts and rendering
          setTimeout(resolve, 500);
        }
      }, []);
      
      return <InvoiceTemplate ref={ref} data={data} />;
    };
    
    root.render(<TemplateWithRef />);
  });
  
  if (!templateElement) {
    root.unmount();
    container.remove();
    throw new Error('Failed to render invoice template');
  }
  
  try {
    if (shouldDownload) {
      await downloadPDFFromElement(templateElement, { filename, scale: 2 });
      return;
    } else {
      return await generatePDFFromElement(templateElement, { scale: 2 });
    }
  } finally {
    root.unmount();
    container.remove();
  }
}
