/**
 * RealtimeIndicator - V3 Connection Status
 * Modern Design - Shows real-time sync status
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/v3/modern-theme.css';

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
      color: 'hsl(var(--modern-warning))',
      bgColor: 'hsl(var(--modern-warning-bg))',
      animate: true,
    },
    connected: {
      icon: Wifi,
      label: isRTL ? 'متصل' : 'Connected',
      color: 'hsl(var(--modern-success))',
      bgColor: 'hsl(var(--modern-success-bg))',
      animate: false,
    },
    disconnected: {
      icon: WifiOff,
      label: isRTL ? 'غير متصل' : 'Disconnected',
      color: 'hsl(var(--modern-text-muted))',
      bgColor: 'hsl(var(--modern-bg-elevated))',
      animate: false,
    },
    error: {
      icon: AlertCircle,
      label: isRTL ? 'خطأ في الاتصال' : 'Connection Error',
      color: 'hsl(var(--modern-error))',
      bgColor: 'hsl(var(--modern-error-bg))',
      animate: false,
    },
  };

  const config = statusConfig[connectionStatus];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
        className
      )}
      style={{
        background: config.bgColor,
      }}
    >
      <motion.div
        animate={config.animate ? { rotate: 360 } : {}}
        transition={config.animate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        <Icon 
          className="w-3.5 h-3.5"
          style={{ color: config.color }}
        />
      </motion.div>
      
      <span 
        className="text-xs font-medium flex-1"
        style={{ color: config.color }}
      >
        {config.label}
      </span>

      <AnimatePresence>
        {isConnected && eventCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-full"
            style={{ background: 'hsl(var(--modern-success))' }}
          >
            {eventCount > 99 ? '99+' : eventCount}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

RealtimeIndicator.displayName = 'RealtimeIndicator';
