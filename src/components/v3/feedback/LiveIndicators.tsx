/**
 * Live Data Indicator
 * Shows real-time data refresh status
 * With pulse animation for active connections
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { PulseDot } from './ModernSkeleton';
import '@/styles/v3/modern-theme.css';

interface LiveDataIndicatorProps {
  isLive?: boolean;
  isLoading?: boolean;
  lastUpdate?: Date | null;
  onRefresh?: () => void;
  showTime?: boolean;
  className?: string;
}

export const LiveDataIndicator: React.FC<LiveDataIndicatorProps> = ({
  isLive = true,
  isLoading = false,
  lastUpdate,
  onRefresh,
  showTime = true,
  className,
}) => {
  const [timeAgo, setTimeAgo] = React.useState('');

  // Update time ago every minute
  React.useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - lastUpdate.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 10) {
        setTimeAgo('الآن');
      } else if (seconds < 60) {
        setTimeAgo(`منذ ${seconds} ثانية`);
      } else if (minutes < 60) {
        setTimeAgo(`منذ ${minutes} دقيقة`);
      } else {
        setTimeAgo(`منذ ${hours} ساعة`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div 
      className={cn(
        'flex items-center gap-2 text-xs',
        className
      )}
    >
      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        {isLive ? (
          <>
            <PulseDot size="sm" color="success" />
            <span 
              className="font-medium"
              style={{ color: 'hsl(var(--modern-success))' }}
            >
              مباشر
            </span>
          </>
        ) : (
          <>
            <WifiOff size={12} style={{ color: 'hsl(var(--modern-text-muted))' }} />
            <span style={{ color: 'hsl(var(--modern-text-muted))' }}>
              غير متصل
            </span>
          </>
        )}
      </div>

      {/* Time ago */}
      {showTime && lastUpdate && (
        <span 
          className="opacity-60"
          style={{ color: 'hsl(var(--modern-text-muted))' }}
        >
          • {timeAgo}
        </span>
      )}

      {/* Refresh button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={cn(
            'p-1 rounded-md transition-all',
            isLoading ? 'opacity-50' : 'hover:bg-black/5'
          )}
          title="تحديث"
        >
          <RefreshCw 
            size={12} 
            className={cn(isLoading && 'animate-spin')}
            style={{ color: 'hsl(var(--modern-text-muted))' }}
          />
        </button>
      )}
    </div>
  );
};

/**
 * Data Update Flash
 * Shows a brief flash animation when data updates
 */

interface DataUpdateFlashProps {
  children: React.ReactNode;
  updateKey: string | number;
  className?: string;
}

export const DataUpdateFlash: React.FC<DataUpdateFlashProps> = ({
  children,
  updateKey,
  className,
}) => {
  return (
    <motion.div
      key={updateKey}
      initial={{ backgroundColor: 'hsl(var(--modern-success) / 0.1)' }}
      animate={{ backgroundColor: 'transparent' }}
      transition={{ duration: 1 }}
      className={cn('rounded-lg', className)}
    >
      {children}
    </motion.div>
  );
};

/**
 * Optimistic State Indicator
 * Shows pending state while waiting for server confirmation
 */

interface OptimisticIndicatorProps {
  isPending: boolean;
  children: React.ReactNode;
  className?: string;
}

export const OptimisticIndicator: React.FC<OptimisticIndicatorProps> = ({
  isPending,
  children,
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center rounded-lg"
            style={{
              background: 'hsl(var(--modern-bg-card) / 0.8)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ 
                  borderColor: 'hsl(var(--modern-brand-primary) / 0.3)',
                  borderTopColor: 'hsl(var(--modern-brand-primary))',
                }}
              />
              <span 
                className="text-xs font-medium"
                style={{ color: 'hsl(var(--modern-text-secondary))' }}
              >
                جاري الحفظ...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Auto-Refresh Wrapper
 * Automatically refreshes data at intervals
 */

interface AutoRefreshProps {
  children: React.ReactNode;
  onRefresh: () => void;
  interval?: number; // in milliseconds
  enabled?: boolean;
  showIndicator?: boolean;
}

export const AutoRefresh: React.FC<AutoRefreshProps> = ({
  children,
  onRefresh,
  interval = 30000, // 30 seconds default
  enabled = true,
  showIndicator = true,
}) => {
  const [countdown, setCountdown] = React.useState(interval / 1000);
  const [lastRefresh, setLastRefresh] = React.useState(new Date());

  React.useEffect(() => {
    if (!enabled) return;

    const refreshInterval = setInterval(() => {
      onRefresh();
      setLastRefresh(new Date());
      setCountdown(interval / 1000);
    }, interval);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
    };
  }, [enabled, interval, onRefresh]);

  return (
    <div className="relative">
      {children}
      
      {showIndicator && enabled && (
        <div 
          className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full"
          style={{
            background: 'hsl(var(--modern-bg-elevated))',
            color: 'hsl(var(--modern-text-muted))',
          }}
        >
          تحديث تلقائي: {countdown}ث
        </div>
      )}
    </div>
  );
};
