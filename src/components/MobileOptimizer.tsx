import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

export const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  useEffect(() => {
    // تحسينات خاصة بالجوال
    if (Capacitor.isNativePlatform()) {
      // إضافة كلاسات للتطبيق الأصلي
      document.body.classList.add('native-app', 'mobile-optimized');
      
      // تحسين الخط للجوال
      document.body.style.fontSize = '16px';
      document.body.style.lineHeight = '1.6';
      
      // منع التكبير والتصغير
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    // تحسينات للويب على الجوال
    if (window.innerWidth <= 768) {
      document.body.classList.add('mobile-web');
      
      // تحسين اللمس
      document.addEventListener('touchstart', function() {}, {passive: true});
      document.addEventListener('touchmove', function() {}, {passive: true});
    }
    
    // تحسين الأداء للأجهزة الضعيفة
    if (navigator.hardwareConcurrency <= 2) {
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
};