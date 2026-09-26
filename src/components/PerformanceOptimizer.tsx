import { useEffect, useCallback } from 'react';

export const PerformanceOptimizer = () => {
  const optimizePerformance = useCallback(() => {
    // تحسين الخطوط مع DNS Prefetch
    const fontOptimizations = [
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ];

    fontOptimizations.forEach(({ rel, href, crossOrigin }) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossOrigin) link.crossOrigin = crossOrigin;
        document.head.appendChild(link);
      }
    });

    // تحسين تحميل الصور
    const optimizeImages = () => {
      const images = document.querySelectorAll('img:not([loading])') as NodeListOf<HTMLImageElement>;
      images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
      });
    };

    // تقليل الحركات للأجهزة الضعيفة
    const reduceAnimations = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                             (navigator as any).deviceMemory <= 2 ||
                             /Android.*Chrome\/[1-8][0-9]/.test(navigator.userAgent);
      
      if (mediaQuery.matches || isLowEndDevice) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.body.classList.add('reduce-animations');
      }
    };

    // تحسين التمرير
    const optimizeScrolling = () => {
      if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
      }
    };

    // تنظيف DOM من العناصر المخفية
    const cleanupDOM = () => {
      const hiddenElements = document.querySelectorAll('[style*="display: none"], .hidden') as NodeListOf<HTMLElement>;
      hiddenElements.forEach(el => {
        if (el.offsetParent === null && !el.querySelector('script, style')) {
          el.remove();
        }
      });
    };

    // تحسين memory management
    const optimizeMemory = () => {
      // تنظيف event listeners القديمة
      const garbageCollect = (window as Window & { gc?: () => void }).gc;
      if (typeof garbageCollect === 'function') {
        setTimeout(garbageCollect, 5000);
      }
    };

    // تشغيل التحسينات
    optimizeImages();
    reduceAnimations();
    optimizeScrolling();
    
    // تشغيل التحسينات الأخرى بعد تحميل الصفحة
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        cleanupDOM();
        optimizeMemory();
      });
    } else {
      setTimeout(() => {
        cleanupDOM();
        optimizeMemory();
      }, 3000);
    }

  }, []);

  useEffect(() => {
    optimizePerformance();

    // إضافة performance observer لمراقبة الأداء
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint' && entry.startTime > 3000) {
            console.warn('LCP بطيء:', entry.startTime);
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (e) {
        console.warn('Performance Observer غير مدعوم');
      }
    }

    // تحسين periodic للصور الجديدة
    const imageObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node instanceof Element) {
            const images = node.querySelectorAll('img:not([loading])') as NodeListOf<HTMLImageElement>;
            images.forEach(img => {
              img.loading = 'lazy';
              img.decoding = 'async';
            });
          }
        });
      });
    });

    imageObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      imageObserver.disconnect();
    };
  }, [optimizePerformance]);

  return null;
};