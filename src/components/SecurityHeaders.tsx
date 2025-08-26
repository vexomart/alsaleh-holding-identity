import { useEffect } from 'react';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Add security meta tags if not already present
    const addMetaTag = (name: string, content: string) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Add security-related meta tags
    addMetaTag('referrer', 'strict-origin-when-cross-origin');
    addMetaTag('format-detection', 'telephone=no');
    addMetaTag('robots', window.location.pathname.includes('/auth') || 
                       window.location.pathname.includes('/login') || 
                       window.location.pathname.includes('/register') || 
                       window.location.pathname.includes('/profile') || 
                       window.location.pathname.includes('/consultation') ? 
                       'noindex, nofollow' : 'index, follow');

    // Add canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.href;
      document.head.appendChild(link);
    }

    // Preconnect to external domains for performance
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.whatsapp.com'
    ];

    preconnectDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });

    // Add DNS prefetch for better performance
    const dnsPrefetchDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Security: Disable right-click context menu on production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  return null;
};