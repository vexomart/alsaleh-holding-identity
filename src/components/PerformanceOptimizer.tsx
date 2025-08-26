import React, { useEffect } from 'react';

export const PerformanceOptimizer = () => {
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

    // تحسين التحديث السريع في التطوير
    if (import.meta.env.DEV) {
      // تقليل عمليات DOM في وضع التطوير
      return;
    }

    // Prefetch important pages on idle (reduced list for better performance)
    const prefetchPages = [
      '/current-offers',
      '/about'
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
      requestIdleCallback(prefetchOnIdle, { timeout: 5000 });
    } else {
      setTimeout(prefetchOnIdle, 3000);
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
};