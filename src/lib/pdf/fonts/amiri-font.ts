/**
 * Amiri Arabic Font - Base64 encoded for PDF embedding
 * 
 * Amiri is a classical Arabic typeface designed by Khaled Hosny
 * It has excellent Arabic shaping and ligature support
 * 
 * Source: https://github.com/aliftype/amiri
 * License: OFL (Open Font License)
 */

// We'll load the font from a reliable CDN that serves the actual font files
// Google Fonts provides Amiri with proper Arabic support

export const AMIRI_FONT_URLS = {
  regular: 'https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUp.ttf',
  bold: 'https://fonts.gstatic.com/s/amiri/v27/J7acnpd8CGxBHp2VkZY.ttf',
  italic: 'https://fonts.gstatic.com/s/amiri/v27/J7afnpd8CGxBHpUrtLY.ttf',
  boldItalic: 'https://fonts.gstatic.com/s/amiri/v27/J7aanpd8CGxBHpUrjAo9zp4.ttf',
};

// Alternative: Cairo font (more modern look)
export const CAIRO_FONT_URLS = {
  regular: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpcWmhzfH5l.ttf',
  bold: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpyWGhzfH5l.ttf',
  light: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmowWmhzfH5l.ttf',
  semibold: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmo8W2hzfH5l.ttf',
};

// Noto Sans Arabic (excellent Unicode coverage)
export const NOTO_SANS_ARABIC_URLS = {
  regular: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyfunvsYNDV.ttf',
  bold: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCf-mufunvsYNDV.ttf',
};

// Function to fetch and convert font to base64
export async function fetchFontAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('Error fetching font:', error);
    throw error;
  }
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
