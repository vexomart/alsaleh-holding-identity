/**
 * Modern Toast Notification System
 * Stripe/Notion Inspired
 * Real-time feedback with smooth animations
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* =========================================
   Toast Types
   ========================================= */

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/* =========================================
   Toast Context
   ========================================= */

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useModernToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useModernToast must be used within ModernToastProvider');
  }
  return context;
};

/* =========================================
   Toast Provider
   ========================================= */

interface ModernToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

export const ModernToastProvider: React.FC<ModernToastProviderProps> = ({
  children,
  position = 'top-left', // For RTL: top-left is visually on the right
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setToasts((prev) => {
      const newToasts = [...prev, { ...toast, id }];
      // Limit the number of toasts
      if (newToasts.length > maxToasts) {
        return newToasts.slice(-maxToasts);
      }
      return newToasts;
    });

    // Auto-remove after duration (unless it's a loading toast)
    if (toast.type !== 'loading') {
      const duration = toast.duration || 4000;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateToast = React.useCallback((id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    // If updating to a non-loading type, set auto-remove
    if (updates.type && updates.type !== 'loading') {
      const duration = updates.duration || 4000;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
      
      {/* Toast Container */}
      <div
        className={cn(
          'fixed z-[100] flex flex-col gap-2 pointer-events-none',
          positionClasses[position]
        )}
        dir="rtl"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

/* =========================================
   Toast Item
   ========================================= */

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const iconMap = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    loading: Loader2,
  };

  const colorMap = {
    success: {
      bg: 'hsl(var(--modern-success-bg))',
      icon: 'hsl(var(--modern-success))',
      border: 'hsl(var(--modern-success) / 0.2)',
    },
    error: {
      bg: 'hsl(var(--modern-error-bg))',
      icon: 'hsl(var(--modern-error))',
      border: 'hsl(var(--modern-error) / 0.2)',
    },
    warning: {
      bg: 'hsl(var(--modern-warning-bg))',
      icon: 'hsl(var(--modern-warning))',
      border: 'hsl(var(--modern-warning) / 0.2)',
    },
    info: {
      bg: 'hsl(var(--modern-info-bg))',
      icon: 'hsl(var(--modern-info))',
      border: 'hsl(var(--modern-info) / 0.2)',
    },
    loading: {
      bg: 'hsl(var(--modern-bg-card))',
      icon: 'hsl(var(--modern-brand-primary))',
      border: 'hsl(var(--modern-border-light))',
    },
  };

  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 30,
        mass: 0.8
      }}
      className="pointer-events-auto w-80 rounded-xl overflow-hidden"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: 'var(--modern-shadow-lg)',
      }}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div 
          className={cn(
            'flex-shrink-0 mt-0.5',
            toast.type === 'loading' && 'animate-spin'
          )}
        >
          <Icon 
            size={20} 
            style={{ color: colors.icon }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p 
            className="text-sm font-semibold"
            style={{ color: 'hsl(var(--modern-text-primary))' }}
          >
            {toast.title}
          </p>
          {toast.description && (
            <p 
              className="text-xs mt-1"
              style={{ color: 'hsl(var(--modern-text-secondary))' }}
            >
              {toast.description}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-xs font-medium mt-2 hover:underline"
              style={{ color: colors.icon }}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {toast.type !== 'loading' && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md transition-colors hover:bg-black/5"
          >
            <X size={14} style={{ color: 'hsl(var(--modern-text-muted))' }} />
          </button>
        )}
      </div>

      {/* Progress Bar for timed toasts */}
      {toast.type !== 'loading' && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ 
            duration: (toast.duration || 4000) / 1000,
            ease: 'linear'
          }}
          className="h-0.5 origin-right"
          style={{ background: colors.icon }}
        />
      )}
    </motion.div>
  );
};

/* =========================================
   Convenience Functions
   ========================================= */

// These will be available after the provider is mounted
let toastFunctions: ToastContextValue | null = null;

export const setToastFunctions = (fns: ToastContextValue) => {
  toastFunctions = fns;
};

export const toast = {
  success: (title: string, description?: string) => {
    return toastFunctions?.addToast({ type: 'success', title, description });
  },
  error: (title: string, description?: string) => {
    return toastFunctions?.addToast({ type: 'error', title, description });
  },
  warning: (title: string, description?: string) => {
    return toastFunctions?.addToast({ type: 'warning', title, description });
  },
  info: (title: string, description?: string) => {
    return toastFunctions?.addToast({ type: 'info', title, description });
  },
  loading: (title: string, description?: string) => {
    return toastFunctions?.addToast({ type: 'loading', title, description });
  },
  dismiss: (id: string) => {
    toastFunctions?.removeToast(id);
  },
  update: (id: string, updates: Partial<Toast>) => {
    toastFunctions?.updateToast(id, updates);
  },
};

/* =========================================
   Toast Hook for promise handling
   ========================================= */

export const useToastPromise = () => {
  const { addToast, updateToast, removeToast } = useModernToast();

  const promise = async <T,>(
    promiseFn: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> => {
    const id = addToast({ type: 'loading', title: messages.loading });

    try {
      const result = await promiseFn;
      updateToast(id, { type: 'success', title: messages.success });
      return result;
    } catch (error) {
      updateToast(id, { 
        type: 'error', 
        title: messages.error,
        description: error instanceof Error ? error.message : undefined
      });
      throw error;
    }
  };

  return { promise };
};
