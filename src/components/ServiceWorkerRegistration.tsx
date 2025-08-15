import { useEffect, useState } from 'react';
import { useNotifications } from '@/components/EnhancedNotifications';

export const ServiceWorkerRegistration = () => {
  const { addNotification } = useNotifications();
  const [updateShown, setUpdateShown] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker (no update notifications)
      navigator.serviceWorker.register('/sw-advanced.js')
        .then((registration) => {
          console.log('SW registered successfully:', registration);
          // No update handling - silent updates only
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });

      // Handle online/offline status (simplified)
      const handleOnline = () => {
        if (!navigator.onLine) return;
        addNotification({
          type: 'success',
          title: 'متصل بالإنترنت',
          description: 'تم استعادة الاتصال.',
          duration: 2000
        });
      };

      const handleOffline = () => {
        addNotification({
          type: 'warning',
          title: 'غير متصل',
          description: 'انقطع الاتصال بالإنترنت.',
          duration: 3000
        });
      };

      // Only add listeners once
      let onlineListenerAdded = false;
      if (!onlineListenerAdded) {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        onlineListenerAdded = true;
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [addNotification, updateShown]);

  return null;
};