/**
 * CacheBuster - يمسح كل الكاش و Service Workers ويعيد تحميل الصفحة
 * يظهر كزر صغير في أسفل الصفحة
 */

import { useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

export function CacheBuster() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [clearing, setClearing] = useState(false);

  const handleClearCache = async () => {
    setClearing(true);
    const toastId = toast.loading(isRTL ? 'جاري مسح الكاش...' : 'Clearing cache...');

    try {
      // 1. Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
        console.log('[CacheBuster] Unregistered', registrations.length, 'service workers');
      }

      // 2. Clear all caches
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
        console.log('[CacheBuster] Cleared', keys.length, 'caches');
      }

      // 3. Clear localStorage marker to allow fresh SW reset logic
      localStorage.removeItem('sw_reset_done_v3_2026_02_02');

      toast.success(isRTL ? 'تم مسح الكاش! جاري إعادة التحميل...' : 'Cache cleared! Reloading...', { id: toastId });

      // 4. Hard reload
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error('[CacheBuster] Error:', err);
      toast.error(isRTL ? 'فشل مسح الكاش' : 'Failed to clear cache', { id: toastId });
      setClearing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClearCache}
      disabled={clearing}
      className="gap-2 text-xs text-muted-foreground hover:text-foreground"
    >
      {clearing ? (
        <RefreshCw className="h-3 w-3 animate-spin" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
      {isRTL ? 'مسح الكاش' : 'Clear Cache'}
    </Button>
  );
}
