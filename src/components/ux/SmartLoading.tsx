/**
 * Smart Loading States
 * Context-aware loading indicators
 * iOS-style with meaningful messages
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCcw, Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/* =========================================
   Messages
   ========================================= */

const loadingMessages = {
  ar: {
    default: 'جارٍ التحميل...',
    data: 'جارٍ تحميل البيانات...',
    saving: 'جارٍ الحفظ...',
    processing: 'جارٍ المعالجة...',
    uploading: 'جارٍ الرفع...',
    syncing: 'جارٍ المزامنة...',
    connecting: 'جارٍ الاتصال...',
    authenticating: 'جارٍ التحقق من الهوية...',
    searching: 'جارٍ البحث...',
    updating: 'جارٍ التحديث...',
    deleting: 'جارٍ الحذف...',
    generating: 'جارٍ الإنشاء...',
    sending: 'جارٍ الإرسال...',
    downloading: 'جارٍ التنزيل...',
  },
  en: {
    default: 'Loading...',
    data: 'Loading data...',
    saving: 'Saving...',
    processing: 'Processing...',
    uploading: 'Uploading...',
    syncing: 'Syncing...',
    connecting: 'Connecting...',
    authenticating: 'Authenticating...',
    searching: 'Searching...',
    updating: 'Updating...',
    deleting: 'Deleting...',
    generating: 'Generating...',
    sending: 'Sending...',
    downloading: 'Downloading...',
  },
};

export type LoadingType = keyof typeof loadingMessages.ar;

/* =========================================
   Inline Loading Spinner
   ========================================= */

interface InlineLoaderProps {
  type?: LoadingType;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({
  type = 'default',
  size = 'md',
  showText = true,
  className,
}) => {
  const { language } = useLanguage();
  const t = loadingMessages[language] || loadingMessages.ar;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn('flex items-center gap-2', className)}
    >
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary')} />
      {showText && (
        <span className={cn(textSizes[size], 'text-muted-foreground font-medium')}>
          {t[type]}
        </span>
      )}
    </motion.div>
  );
};

/* =========================================
   Page Loading Overlay
   ========================================= */

interface PageLoaderProps {
  type?: LoadingType;
  fullScreen?: boolean;
  transparent?: boolean;
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  type = 'default',
  fullScreen = true,
  transparent = false,
  className,
}) => {
  const { language } = useLanguage();
  const t = loadingMessages[language] || loadingMessages.ar;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen && 'fixed inset-0 z-50',
        !fullScreen && 'absolute inset-0',
        transparent ? 'bg-background/80 backdrop-blur-sm' : 'bg-background',
        className
      )}
    >
      {/* Animated Loader */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="relative"
      >
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-muted" />
        
        {/* Spinning Arc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary"
        />

        {/* Inner Dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-3 h-3 rounded-full bg-primary" />
        </motion.div>
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-sm font-medium text-muted-foreground"
      >
        {t[type]}
      </motion.p>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 128 }}
        transition={{ delay: 0.3 }}
        className="mt-4 h-1 bg-muted rounded-full overflow-hidden"
      >
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </motion.div>
    </motion.div>
  );
};

/* =========================================
   Button Loading State
   ========================================= */

interface ButtonLoaderProps {
  loading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  loading = false,
  children,
  loadingText,
  className,
}) => {
  const { language } = useLanguage();
  const defaultText = language === 'ar' ? 'جارٍ...' : 'Loading...';

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{loadingText || defaultText}</span>
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

/* =========================================
   Connection Status Indicator
   ========================================= */

interface ConnectionStatusProps {
  online?: boolean;
  synced?: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  online = true,
  synced = true,
  className,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const statusText = {
    ar: {
      online: 'متصل',
      offline: 'غير متصل',
      syncing: 'جارٍ المزامنة',
      synced: 'متزامن',
    },
    en: {
      online: 'Online',
      offline: 'Offline',
      syncing: 'Syncing',
      synced: 'Synced',
    },
  };

  const t = statusText[language] || statusText.ar;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
        online 
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        className
      )}
    >
      {online ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>{t.online}</span>
          {!synced && (
            <>
              <span className="mx-1">•</span>
              <RefreshCcw className="w-3 h-3 animate-spin" />
              <span>{t.syncing}</span>
            </>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>{t.offline}</span>
        </>
      )}
    </motion.div>
  );
};

/* =========================================
   Empty State with Loading Option
   ========================================= */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          disabled={action.loading}
          className="gap-2 h-11 px-6"
        >
          {action.loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{action.label}</span>
            </>
          ) : (
            <span>{action.label}</span>
          )}
        </Button>
      )}
    </motion.div>
  );
};

export default {
  InlineLoader,
  PageLoader,
  ButtonLoader,
  ConnectionStatus,
  EmptyState,
};
