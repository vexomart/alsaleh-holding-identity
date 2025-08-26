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
    
    // Check for template variables in URL and add noindex
    const hasTemplateVars = window.location.href.includes('{{') || 
                           window.location.href.includes('%7B%7B') ||
                           window.location.pathname.includes('{{') ||
                           window.location.pathname.includes('%7B%7B');
    
    // Check if current path should be noindexed
    const sensitivePathPattern = /(auth|login|register|profile|tickets|account|admin|consultation)/;
    const isSensitivePath = sensitivePathPattern.test(window.location.pathname);
    
    addMetaTag('robots', (isSensitivePath || hasTemplateVars) ? 'noindex, nofollow' : 'index, follow');

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

    // Security: Block access to template variable URLs
    const currentUrl = window.location.href;
    if (currentUrl.includes('{{') || currentUrl.includes('%7B%7B')) {
      // Redirect to 404 page for template variable URLs
      window.location.replace('/404.html');
      return;
    }

    // Security: Disable right-click context menu on production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };
      
      // Disable F12 and other developer tools shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          return false;
        }
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  return null;
};