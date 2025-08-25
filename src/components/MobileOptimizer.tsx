import React from 'react';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

export const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
  // تحسينات أساسية بدون hooks لتجنب مشاكل dispatcher
  React.useLayoutEffect(() => {
    // تحسينات خاصة بالجوال
    document.body.classList.add('mobile-optimized');
    
    // تحسين الخط للجوال
    document.body.style.fontSize = '16px';
    document.body.style.lineHeight = '1.6';
    
    // منع التكبير والتصغير
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // تحسينات للويب على الجوال
    if (window.innerWidth <= 768) {
      document.body.classList.add('mobile-web');
    }
    
    // تحسين الأداء للأجهزة الضعيفة
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      document.body.classList.add('low-performance');
    }

    return () => {
      document.body.classList.remove('mobile-optimized', 'mobile-web', 'low-performance');
    };
  }, []);

  return (
    <div className="mobile-container w-full min-h-screen">
      {children}
    </div>
  );
};