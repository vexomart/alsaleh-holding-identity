import { useEffect } from 'react';

export const AnalyticsProvider = () => {
  useEffect(() => {
    // Google Analytics 4 (replace with your actual GA4 measurement ID)
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual ID
    
    // Add Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        anonymize_ip: true,
        cookie_flags: 'secure;samesite=strict'
      });
    `;
    document.head.appendChild(script2);

    // Add Google Search Console verification (replace with your actual meta tag)
    const addMetaTag = (name: string, content: string) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Add verification meta tags (replace with actual verification codes)
    addMetaTag('google-site-verification', 'your-google-verification-code');
    addMetaTag('msvalidate.01', 'your-bing-verification-code');

    return () => {
      // Cleanup scripts
      const scripts = document.querySelectorAll('script[src*="googletagmanager"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return null;
};