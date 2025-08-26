import { useEffect } from 'react';

export const TemplateVariableBlocker = () => {
  useEffect(() => {
    // Check current URL for template variables
    const checkTemplateVariables = () => {
      const currentUrl = window.location.href;
      const currentPath = window.location.pathname;
      
      // Check for various template variable patterns
      const templatePatterns = [
        /\{\{.*?\}\}/g,           // {{ variable }}
        /%7B%7B.*?%7D%7D/gi,     // URL encoded {{ variable }}
        /\{%.*?%\}/g,            // {% tag %}
        /%7B%.*?%%7D/gi,         // URL encoded {% tag %}
      ];
      
      const hasTemplateVars = templatePatterns.some(pattern => 
        pattern.test(currentUrl) || pattern.test(currentPath)
      );
      
      if (hasTemplateVars) {
        // Add noindex meta tag
        const robotsMeta = document.querySelector('meta[name="robots"]');
        if (robotsMeta) {
          robotsMeta.setAttribute('content', 'noindex, nofollow');
        } else {
          const meta = document.createElement('meta');
          meta.name = 'robots';
          meta.content = 'noindex, nofollow';
          document.head.appendChild(meta);
        }
        
        // Block access by redirecting to 404
        console.warn('Template variables detected in URL, redirecting to 404');
        window.location.replace('/404.html');
        return;
      }
    };

    // Check on initial load
    checkTemplateVariables();
    
    // Monitor for URL changes (for SPAs)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(checkTemplateVariables, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(checkTemplateVariables, 0);
    };
    
    window.addEventListener('popstate', checkTemplateVariables);
    
    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', checkTemplateVariables);
    };
  }, []);

  return null;
};