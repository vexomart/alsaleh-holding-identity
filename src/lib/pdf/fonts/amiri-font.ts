/**
 * Amiri Arabic Font - Base64 encoded for PDF embedding
 * 
 * Amiri is a classical Arabic typeface designed by Khaled Hosny
 * It has excellent Arabic shaping and ligature support
 * 
 * Source: https://github.com/aliftype/amiri
 * License: OFL (Open Font License)
 */

// Use jsDelivr CDN which serves fonts with CORS headers enabled
// This allows fetching fonts directly from the browser

export const AMIRI_FONT_URLS = {
  regular: 'https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.19/files/amiri-arabic-400-normal.woff',
  bold: 'https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.19/files/amiri-arabic-700-normal.woff',
  italic: 'https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.19/files/amiri-arabic-400-italic.woff',
  boldItalic: 'https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.19/files/amiri-arabic-700-italic.woff',
};

// Alternative: Cairo font (more modern look) via jsDelivr
export const CAIRO_FONT_URLS = {
  regular: 'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5.0.19/files/cairo-arabic-400-normal.woff',
  bold: 'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5.0.19/files/cairo-arabic-700-normal.woff',
  light: 'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5.0.19/files/cairo-arabic-300-normal.woff',
  semibold: 'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5.0.19/files/cairo-arabic-600-normal.woff',
};

// Noto Sans Arabic (excellent Unicode coverage) via jsDelivr  
export const NOTO_SANS_ARABIC_URLS = {
  regular: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-arabic@5.0.19/files/noto-sans-arabic-arabic-400-normal.woff',
  bold: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-arabic@5.0.19/files/noto-sans-arabic-arabic-700-normal.woff',
};

// Function to fetch and convert font to base64 with retry logic
export async function fetchFontAsBase64(url: string, retries: number = 3): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        cache: 'force-cache',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText || 'Unknown error'}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      return btoa(binary);
    } catch (error) {
      lastError = error as Error;
      console.warn(`Font fetch attempt ${attempt}/${retries} failed for ${url}:`, error);
      
      if (attempt < retries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  }
  
  console.error('Error fetching font after all retries:', lastError);
  throw new Error(`Failed to fetch font from ${url}: ${lastError?.message || 'Network error'}`);
}

// Font cache to avoid re-fetching
const fontCache: Map<string, string> = new Map();

export async function loadArabicFont(fontFamily: 'amiri' | 'cairo' | 'noto' = 'amiri'): Promise<{
  normal: string;
  bold: string;
  italics: string;
  bolditalics: string;
}> {
  const cacheKey = `${fontFamily}-fonts`;
  
  // Return cached fonts if available
  if (fontCache.has(`${fontFamily}-normal`)) {
    return {
      normal: fontCache.get(`${fontFamily}-normal`)!,
      bold: fontCache.get(`${fontFamily}-bold`)!,
      italics: fontCache.get(`${fontFamily}-italics`)!,
      bolditalics: fontCache.get(`${fontFamily}-bolditalics`)!,
    };
  }

  let urls: typeof AMIRI_FONT_URLS;
  
  switch (fontFamily) {
    case 'cairo':
      urls = {
        regular: CAIRO_FONT_URLS.regular,
        bold: CAIRO_FONT_URLS.bold,
        italic: CAIRO_FONT_URLS.regular, // Cairo doesn't have italic
        boldItalic: CAIRO_FONT_URLS.bold,
      };
      break;
    case 'noto':
      urls = {
        regular: NOTO_SANS_ARABIC_URLS.regular,
        bold: NOTO_SANS_ARABIC_URLS.bold,
        italic: NOTO_SANS_ARABIC_URLS.regular,
        boldItalic: NOTO_SANS_ARABIC_URLS.bold,
      };
      break;
    case 'amiri':
    default:
      urls = AMIRI_FONT_URLS;
  }

  // Fetch all font variants in parallel
  const [normal, bold, italics, bolditalics] = await Promise.all([
    fetchFontAsBase64(urls.regular),
    fetchFontAsBase64(urls.bold),
    fetchFontAsBase64(urls.italic),
    fetchFontAsBase64(urls.boldItalic),
  ]);

  // Cache the fonts
  fontCache.set(`${fontFamily}-normal`, normal);
  fontCache.set(`${fontFamily}-bold`, bold);
  fontCache.set(`${fontFamily}-italics`, italics);
  fontCache.set(`${fontFamily}-bolditalics`, bolditalics);

  return { normal, bold, italics, bolditalics };
}
