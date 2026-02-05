 import { useEffect, type ReactNode } from 'react';

interface MobileOptimizerProps {
   children: ReactNode;
}

 export const MobileOptimizer = ({ children }: MobileOptimizerProps) => {
  useEffect(() => {
     // تحسينات خاصة بالجوال - مع التحقق من توفر Capacitor
     const initCapacitor = async () => {
       try {
         const { Capacitor } = await import('@capacitor/core');
         if (Capacitor.isNativePlatform()) {
           document.body.classList.add('native-app', 'mobile-optimized');
           document.body.style.fontSize = '16px';
           document.body.style.lineHeight = '1.6';
           
           const viewport = document.querySelector('meta[name=viewport]');
           if (viewport) {
             viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
           }
         }
       } catch {
         // Capacitor not available in this environment
      }
     };
 
     initCapacitor();

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