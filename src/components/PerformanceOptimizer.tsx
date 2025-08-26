import React, { useEffect } from 'react';

const PerformanceOptimizer = React.memo(() => {
  useEffect(() => {
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

    // Prefetch important pages on idle (reduced list for better performance)
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

    // Optimize images loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });

  }, []);

  return null;
});

PerformanceOptimizer.displayName = 'PerformanceOptimizer';

export { PerformanceOptimizer };