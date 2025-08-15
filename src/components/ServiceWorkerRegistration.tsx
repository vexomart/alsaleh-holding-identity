import { useEffect } from 'react';
import { useNotifications } from '@/components/EnhancedNotifications';

export const ServiceWorkerRegistration = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw-advanced.js')
        .then((registration) => {
          console.log('SW registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  addNotification({
                    type: 'info',
                    title: 'تحديث متاح',
                    description: 'تحديث جديد متاح للموقع. سيتم تطبيقه عند إعادة تحميل الصفحة.',
                    action: {
                      label: 'إعادة تحميل',
                      onClick: () => window.location.reload()
                    },
                    duration: 0
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });

      // Listen for SW messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          addNotification({
            type: 'success',
            title: 'تم التحديث بنجاح',
            description: 'تم تحديث الموقع وتحسين الأداء.',
            duration: 3000
          });
        }
      });

      // Handle online/offline status
      const updateOnlineStatus = () => {
        if (navigator.onLine) {
          addNotification({
            type: 'success',
            title: 'العودة للاتصال',
            description: 'تم استعادة الاتصال بالإنترنت.',
            duration: 3000
          });
        } else {
          addNotification({
            type: 'warning',
            title: 'انقطع الاتصال',
            description: 'تم فقدان الاتصال بالإنترنت. سيعمل الموقع بالوضع المتاح.',
            duration: 5000
          });
        }
      };

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    }
  }, [addNotification]);

  return null;
};