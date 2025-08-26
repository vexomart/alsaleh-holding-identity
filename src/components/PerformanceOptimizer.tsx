import React, { useEffect, useCallback } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Enable fast refresh indicators
    if (import.meta.env.DEV) {
      console.log('🚀 Performance optimizer loaded');
    }

    // Preload critical resources
    const preloadLinks = [
      '/src/assets/hero-bg.jpg',
      'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700&display=swap'
    ];
    
    preloadLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = href.includes('fonts') ? 'style' : 'image';
      link.href = href;
      document.head.appendChild(link);
    });

    // Optimize animations for low-end devices
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || navigator.hardwareConcurrency <= 2) {
      document.body.classList.add('reduce-animations');
    }

    // Reduce prefetching in development for faster updates
    if (import.meta.env.PROD) {
      const prefetchPages = [
        '/current-offers',
        '/about',
        '/contact'
      ];

      const prefetchOnIdle = () => {
        prefetchPages.forEach(path => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = path;
          document.head.appendChild(link);
        });
      };

      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(prefetchOnIdle);
      } else {
        setTimeout(prefetchOnIdle, 2000);
      }
    }

    // Optimize images loading with intersection observer for better performance
    const optimizeImages = () => {
      const images = document.querySelectorAll('img:not([data-optimized])');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (!img.loading) {
                img.loading = 'lazy';
              }
              img.setAttribute('data-optimized', 'true');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
          const htmlImg = img as HTMLImageElement;
          if (!htmlImg.loading) {
            htmlImg.loading = 'lazy';
          }
          htmlImg.setAttribute('data-optimized', 'true');
        });
      }
    };

    // Initial optimization
    optimizeImages();

    // Re-optimize when new images are added
    const observer = new MutationObserver(() => {
      optimizeImages();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
};