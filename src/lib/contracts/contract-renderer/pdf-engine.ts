/**
 * Finance Contract PDF Generation Engine
 * محرك توليد PDF لعقود التمويل
 * Browser-based implementation using print/iframe
 */

import { FinanceContractData, ContractRenderOptions, ContractValidationResult } from './types';
import { renderContractHTML } from './template';

/**
 * Generate contract PDF using browser print
 * توليد PDF باستخدام طباعة المتصفح
 */
export async function generateContractPdf(
  data: FinanceContractData,
  options?: Partial<ContractRenderOptions>
): Promise<Blob> {
  const html = renderContractHTML(data, options);
  
  return new Promise((resolve, reject) => {
    // Create hidden iframe for rendering
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      reject(new Error('Could not access iframe document'));
      return;
    }
    
    // Write HTML content
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
    // Wait for fonts and images to load
    setTimeout(async () => {
      try {
        // Use html2canvas if available, otherwise fallback to print
        if (typeof (window as any).html2canvas !== 'undefined') {
          const canvas = await (window as any).html2canvas(iframeDoc.body, {
            scale: 2,
            useCORS: true,
            logging: false,
          });
          
          canvas.toBlob((blob: Blob | null) => {
            document.body.removeChild(iframe);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate PDF blob'));
            }
          }, 'application/pdf');
        } else {
          // Fallback: return HTML as blob for print
          const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
          document.body.removeChild(iframe);
          resolve(blob);
        }
      } catch (error) {
        document.body.removeChild(iframe);
        reject(error);
      }
    }, 1500); // Wait for fonts
  });
}

/**
 * Open contract for printing
 * فتح العقد للطباعة
 */
export function printContract(
  data: FinanceContractData,
  options?: Partial<ContractRenderOptions>
): void {
  const html = renderContractHTML(data, options);
  
  // Open new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    // Fallback: use iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-9999px';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 1000);
    }
    return;
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

/**
 * Preview contract in new window
 * معاينة العقد في نافذة جديدة
 */
export function previewContract(
  data: FinanceContractData,
  options?: Partial<ContractRenderOptions>
): Window | null {
  const html = renderContractHTML(data, { ...options, previewMode: true });
  
  const previewWindow = window.open('', '_blank', 'width=900,height=700');
  if (!previewWindow) {
    console.error('Could not open preview window');
    return null;
  }
  
  previewWindow.document.write(html);
  previewWindow.document.close();
  
  return previewWindow;
}

/**
 * Download contract as HTML (for guaranteed download)
 * تحميل العقد كـ HTML
 */
export function downloadContractHTML(
  data: FinanceContractData,
  options?: Partial<ContractRenderOptions>
): void {
  const html = renderContractHTML(data, options);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `عقد-تمويل-${data.contractNumber}.html`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Get contract HTML string
 * الحصول على HTML العقد كنص
 */
export function getContractHTML(
  data: FinanceContractData,
  options?: Partial<ContractRenderOptions>
): string {
  return renderContractHTML(data, options);
}
