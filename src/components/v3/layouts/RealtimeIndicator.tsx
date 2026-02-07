/**
 * RealtimeIndicator - V3 Connection Status
 * Shows real-time sync status in sidebar footer
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealtimeIndicatorProps {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  eventCount?: number;
  className?: string;
}

export const RealtimeIndicator: React.FC<RealtimeIndicatorProps> = ({
  isConnected,
  connectionStatus,
  eventCount = 0,
  className,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const statusConfig = {
    connecting: {
      icon: RefreshCw,
      label: isRTL ? 'جاري الاتصال...' : 'Connecting...',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
      animate: true,
    },
    connected: {
      icon: Wifi,
      label: isRTL ? 'متصل' : 'Connected',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      animate: false,
    },
    disconnected: {
      icon: WifiOff,
      label: isRTL ? 'غير متصل' : 'Disconnected',
      color: 'text-slate-400',
      bgColor: 'bg-slate-100',
      animate: false,
    },
    error: {
      icon: AlertCircle,
      label: isRTL ? 'خطأ في الاتصال' : 'Connection Error',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      animate: false,
    },
  };

  const config = statusConfig[connectionStatus];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
        config.bgColor,
        className
      )}
    >
      <motion.div
        animate={config.animate ? { rotate: 360 } : {}}
        transition={config.animate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        <Icon className={cn('w-4 h-4', config.color)} />
      </motion.div>
      
      <span className={cn('text-xs font-medium flex-1', config.color)}>
        {config.label}
      </span>

      <AnimatePresence>
        {isConnected && eventCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full"
          >
            {eventCount > 99 ? '99+' : eventCount}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

RealtimeIndicator.displayName = 'RealtimeIndicator';
