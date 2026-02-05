/**
 * MobileOptimizer - تحسينات خاصة بالجوال
 */

import * as React from 'react';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

export function MobileOptimizer({ children }: MobileOptimizerProps) {
  React.useEffect(() => {
    // تحسينات خاصة بالجوال - Capacitor يتم استيراده ديناميكياً لتجنب مشاكل الويب
    const initCapacitor = async () => {
      try {
        const capacitorModule = await import('@capacitor/core');
        const Capacitor = capacitorModule.Capacitor;
        if (Capacitor && typeof Capacitor.isNativePlatform === 'function' && Capacitor.isNativePlatform()) {
          document.body.classList.add('native-app', 'mobile-optimized');
          document.body.style.fontSize = '16px';
          document.body.style.lineHeight = '1.6';
          
          const viewport = document.querySelector('meta[name=viewport]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
          }
        }
      } catch (e) {
        // Capacitor not available - safe to ignore in web environment
        console.debug('[MobileOptimizer] Capacitor not available');
      }
    };

    initCapacitor();

    // تحسينات للويب على الجوال
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      document.body.classList.add('mobile-web');
    }
    
    // تحسين الأداء للأجهزة الضعيفة
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      document.body.classList.add('low-performance');
    }

    return () => {
      document.body.classList.remove('native-app', 'mobile-optimized', 'mobile-web', 'low-performance');
    };
  }, []);

  return (
    <div className="mobile-container w-full min-h-screen">
      {children}
    </div>
  );
}
