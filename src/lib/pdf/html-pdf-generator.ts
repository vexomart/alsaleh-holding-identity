/**
 * HTML to PDF Generator with Arabic RTL Support
 * 
 * Uses html2canvas + jsPDF to properly render Arabic text
 * This approach ensures correct character shaping as the browser handles rendering
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface HTMLToPDFOptions {
  filename?: string;
  scale?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
}

/**
 * Generate PDF from an HTML element
 * The element must be visible and in the DOM at the time of generation
 */
export async function generatePDFFromElement(
  element: HTMLElement,
  options: HTMLToPDFOptions = {}
): Promise<Blob> {
  const {
    scale = 2,
    format = 'a4',
    orientation = 'portrait',
    margin = 10,
  } = options;

  // A4 dimensions in mm
  const pageWidth = format === 'a4' ? 210 : 215.9;
  const pageHeight = format === 'a4' ? 297 : 279.4;

  // Render element to canvas
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff',
  });

  // Calculate dimensions
  const imgWidth = pageWidth - (margin * 2);
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageHeightUsable = pageHeight - (margin * 2);

  // Create PDF
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format,
  });

  const imgData = canvas.toDataURL('image/png');
  let heightLeft = imgHeight;
  let position = margin;

  // Add first page
  pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeightUsable;

  // Add subsequent pages if content exceeds one page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeightUsable;
  }

  return pdf.output('blob');
}

/**
 * Generate and download PDF from HTML element
 */
export async function downloadPDFFromElement(
  element: HTMLElement,
  options: HTMLToPDFOptions = {}
): Promise<void> {
  const { filename = 'document.pdf' } = options;

  const blob = await generatePDFFromElement(element, options);
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF data URL from HTML element
 */
export async function getPDFDataUrlFromElement(
  element: HTMLElement,
  options: HTMLToPDFOptions = {}
): Promise<string> {
  const blob = await generatePDFFromElement(element, options);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
