import { useEffect, useState } from 'react';
import { useNotifications } from '@/components/EnhancedNotifications';

export const ServiceWorkerRegistration = () => {
  const { addNotification } = useNotifications();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const updateServiceWorker = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ action: 'skipWaiting' });
      setWaitingWorker(null);
      
      // Show updating notification
      addNotification({
        type: 'info',
        title: 'جارٍ التحديث...',
        description: 'يتم تطبيق التحديث الآن.',
        duration: 2000
      });
    }
  };

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
                  setWaitingWorker(newWorker);
                  addNotification({
                    type: 'info',
                    title: 'تحديث متاح',
                    description: 'يتوفر تحديث جديد للموقع مع تحسينات في الأداء.',
                    action: {
                      label: 'تحديث الآن',
                      onClick: updateServiceWorker
                    },
                    duration: 0
                  });
                }
              });
            }
          });

          // Listen for controlling change (new SW activated)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            // New SW has taken control, reload the page
            addNotification({
              type: 'success',
              title: 'تم التحديث بنجاح',
              description: 'تم تطبيق التحديث. سيتم إعادة تحميل الصفحة.',
              duration: 1000
            });
            
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
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