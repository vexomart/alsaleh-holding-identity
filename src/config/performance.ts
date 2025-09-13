// تكوين الأداء الشامل
export const performanceConfig = {
  // أهداف Lighthouse
  targets: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 95,
    pwa: 90
  },

  // تحسين الصور
  imageOptimization: {
    formats: ['webp', 'avif', 'jpg', 'png'],
    quality: {
      webp: 85,
      avif: 80,
      jpg: 85,
      png: 90
    },
    sizes: [320, 640, 768, 1024, 1280, 1920],
    loading: 'lazy' as const,
    decoding: 'async' as const
  },

  // تحسين الخطوط
  fontOptimization: {
    display: 'swap' as const,
    preload: [
      'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap'
    ],
    fallbacks: ['Tahoma', 'Arial', 'sans-serif']
  },

  // تقسيم الكود
  codeSplitting: {
    enabled: true,
    chunks: {
      vendor: ['react', 'react-dom', '@tanstack/react-query'],
      admin: ['admin/**/*'],
      client: ['client/**/*'],
      auth: ['auth/**/*']
    },
    dynamicImports: true
  },

  // ضغط الملفات
  compression: {
    gzip: {
      enabled: true,
      level: 6,
      threshold: 1024
    },
    brotli: {
      enabled: true,
      quality: 6,
      threshold: 1024
    }
  },

  // Service Worker
  serviceWorker: {
    enabled: true,
    cacheStrategy: {
      pages: 'NetworkFirst',
      static: 'CacheFirst',
      api: 'NetworkOnly',
      images: 'CacheFirst'
    },
    precache: [
      '/',
      '/about',
      '/contact',
      '/services',
      '/offline.html'
    ]
  },

  // تحسين CSS
  css: {
    purge: true,
    minify: true,
    critical: {
      enabled: true,
      inline: true,
      threshold: 14000 // 14KB
    }
  },

  // تحسين JavaScript
  javascript: {
    minify: true,
    treeshake: true,
    deadCodeElimination: true,
    modulePreload: true
  },

  // Resource Hints
  resourceHints: {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    dnsPrefetch: [
      'https://api.whatsapp.com',
      'https://wa.me'
    ],
    prefetch: [
      '/about',
      '/services',
      '/contact'
    ]
  },

  // تحسين التحميل
  loading: {
    lazyComponents: true,
    lazyImages: true,
    lazyRoutes: true,
    skeleton: true,
    progressIndicator: true
  },

  // تحسين الذاكرة
  memory: {
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    cleanupInterval: 5 * 60 * 1000, // 5 دقائق
    queryCache: {
      staleTime: 5 * 60 * 1000, // 5 دقائق
      cacheTime: 10 * 60 * 1000 // 10 دقائق
    }
  },

  // تحسين الشبكة
  network: {
    timeout: 10000, // 10 ثوان
    retries: 3,
    concurrency: 6,
    http2: true,
    keepAlive: true
  }
};

// دالة إنشاء srcset للصور المتجاوبة
export const generateSrcSet = (src: string, sizes: number[] = performanceConfig.imageOptimization.sizes) => {
  return sizes.map(size => `${src}?w=${size}&q=85 ${size}w`).join(', ');
};

// دالة تحسين تحميل الصور
export const optimizeImageLoading = (element: HTMLImageElement) => {
  // تطبيق lazy loading
  element.loading = 'lazy';
  element.decoding = 'async';
  
  // إضافة placeholder
  if (!element.src.includes('placeholder')) {
    const placeholder = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">جارٍ التحميل...</text>
      </svg>
    `)}`;
    
    const originalSrc = element.src;
    element.src = placeholder;
    
    // تحميل الصورة الفعلية
    const img = new Image();
    img.onload = () => {
      element.src = originalSrc;
    };
    img.src = originalSrc;
  }
};

// دالة مراقبة الأداء
export const monitorPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // مراقبة Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            console.log('LCP:', entry.startTime);
            break;
          case 'first-input':
            console.log('FID:', (entry as any).processingStart - entry.startTime);
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              console.log('CLS:', (entry as any).value);
            }
            break;
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }
};

// دالة تحسين الخطوط
export const optimizeFontLoading = () => {
  if (typeof document !== 'undefined') {
    // تحميل الخطوط مسبقاً
    performanceConfig.fontOptimization.preload.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = font;
      document.head.appendChild(link);
    });
  }
};

// دالة تنظيف الذاكرة
export const cleanupMemory = () => {
  if (typeof window !== 'undefined') {
    // تنظيف event listeners غير المستخدمة
    const elements = document.querySelectorAll('[data-cleanup]');
    elements.forEach(element => {
      const handlers = (element as HTMLElement).dataset.handlers?.split(',') || [];
      handlers.forEach(handler => {
        element.removeEventListener(handler, () => {});
      });
    });

    // تنظيف timers
    window.clearTimeout(0);
    window.clearInterval(0);
  }
};