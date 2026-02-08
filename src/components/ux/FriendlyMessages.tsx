/**
 * Friendly Message System
 * User-friendly error and success messages
 * Enterprise-grade with Arabic/English support
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/* =========================================
   Friendly Error Messages Map
   ========================================= */

export const friendlyErrors = {
  ar: {
    // Network Errors
    'network_error': 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
    'timeout': 'استغرق الطلب وقتاً طويلاً. يرجى المحاولة مرة أخرى.',
    'offline': 'أنت غير متصل بالإنترنت حالياً.',
    
    // Auth Errors
    'invalid_credentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    'email_not_confirmed': 'يرجى تأكيد بريدك الإلكتروني أولاً.',
    'session_expired': 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.',
    'unauthorized': 'ليس لديك صلاحية للوصول إلى هذا المورد.',
    'user_not_found': 'لم يتم العثور على حساب بهذا البريد الإلكتروني.',
    'email_taken': 'هذا البريد الإلكتروني مسجل مسبقاً.',
    'weak_password': 'كلمة المرور ضعيفة. يرجى اختيار كلمة مرور أقوى.',
    
    // Data Errors
    'not_found': 'لم يتم العثور على المورد المطلوب.',
    'already_exists': 'هذا العنصر موجود بالفعل.',
    'validation_error': 'بعض البيانات المدخلة غير صحيحة.',
    'required_field': 'يرجى ملء جميع الحقول المطلوبة.',
    
    // Server Errors
    'server_error': 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
    'maintenance': 'النظام قيد الصيانة حالياً. يرجى المحاولة لاحقاً.',
    
    // Generic
    'unknown': 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    'try_again': 'يرجى المحاولة مرة أخرى.',
  },
  en: {
    // Network Errors
    'network_error': 'Could not connect to server. Please check your internet connection.',
    'timeout': 'The request took too long. Please try again.',
    'offline': 'You are currently offline.',
    
    // Auth Errors
    'invalid_credentials': 'Invalid email or password.',
    'email_not_confirmed': 'Please confirm your email first.',
    'session_expired': 'Your session has expired. Please sign in again.',
    'unauthorized': 'You do not have permission to access this resource.',
    'user_not_found': 'No account found with this email.',
    'email_taken': 'This email is already registered.',
    'weak_password': 'Password is too weak. Please choose a stronger password.',
    
    // Data Errors
    'not_found': 'The requested resource was not found.',
    'already_exists': 'This item already exists.',
    'validation_error': 'Some of the entered data is invalid.',
    'required_field': 'Please fill in all required fields.',
    
    // Server Errors
    'server_error': 'A server error occurred. Please try again later.',
    'maintenance': 'System is under maintenance. Please try again later.',
    
    // Generic
    'unknown': 'An unexpected error occurred. Please try again.',
    'try_again': 'Please try again.',
  },
};

/* =========================================
   Success Messages Map
   ========================================= */

export const successMessages = {
  ar: {
    'saved': 'تم الحفظ بنجاح',
    'created': 'تم الإنشاء بنجاح',
    'updated': 'تم التحديث بنجاح',
    'deleted': 'تم الحذف بنجاح',
    'sent': 'تم الإرسال بنجاح',
    'uploaded': 'تم الرفع بنجاح',
    'downloaded': 'تم التنزيل بنجاح',
    'copied': 'تم النسخ',
    'login': 'تم تسجيل الدخول بنجاح',
    'logout': 'تم تسجيل الخروج بنجاح',
    'register': 'تم إنشاء الحساب بنجاح',
    'password_reset': 'تم إرسال رابط إعادة تعيين كلمة المرور',
    'password_changed': 'تم تغيير كلمة المرور بنجاح',
    'profile_updated': 'تم تحديث الملف الشخصي',
    'settings_saved': 'تم حفظ الإعدادات',
    'order_placed': 'تم إرسال الطلب بنجاح',
    'payment_success': 'تمت عملية الدفع بنجاح',
    'contract_signed': 'تم توقيع العقد بنجاح',
  },
  en: {
    'saved': 'Saved successfully',
    'created': 'Created successfully',
    'updated': 'Updated successfully',
    'deleted': 'Deleted successfully',
    'sent': 'Sent successfully',
    'uploaded': 'Uploaded successfully',
    'downloaded': 'Downloaded successfully',
    'copied': 'Copied',
    'login': 'Signed in successfully',
    'logout': 'Signed out successfully',
    'register': 'Account created successfully',
    'password_reset': 'Password reset link sent',
    'password_changed': 'Password changed successfully',
    'profile_updated': 'Profile updated',
    'settings_saved': 'Settings saved',
    'order_placed': 'Order placed successfully',
    'payment_success': 'Payment completed successfully',
    'contract_signed': 'Contract signed successfully',
  },
};

/* =========================================
   Helper to Get Friendly Message
   ========================================= */

export function getFriendlyError(error: unknown, language: 'ar' | 'en' = 'ar'): string {
  const messages = friendlyErrors[language];
  
  if (typeof error === 'string') {
    // Check if it's a known error key
    if (error in messages) {
      return messages[error as keyof typeof messages];
    }
    // Return as-is if it looks like a user-friendly message
    if (error.length < 150 && !error.includes('Error:')) {
      return error;
    }
    return messages.unknown;
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return messages.network_error;
    }
    if (message.includes('timeout')) {
      return messages.timeout;
    }
    
    // Auth errors
    if (message.includes('invalid login') || message.includes('invalid credentials')) {
      return messages.invalid_credentials;
    }
    if (message.includes('email not confirmed')) {
      return messages.email_not_confirmed;
    }
    if (message.includes('jwt') || message.includes('token')) {
      return messages.session_expired;
    }
    if (message.includes('unauthorized') || message.includes('403')) {
      return messages.unauthorized;
    }
    
    // Data errors
    if (message.includes('not found') || message.includes('404')) {
      return messages.not_found;
    }
    if (message.includes('already exists') || message.includes('duplicate')) {
      return messages.already_exists;
    }
    if (message.includes('validation')) {
      return messages.validation_error;
    }
    
    // Server errors
    if (message.includes('500') || message.includes('internal server')) {
      return messages.server_error;
    }
    
    return messages.unknown;
  }
  
  return messages.unknown;
}

/* =========================================
   Inline Message Banner
   ========================================= */

interface MessageBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export const MessageBanner: React.FC<MessageBannerProps> = ({
  type,
  title,
  description,
  action,
  onDismiss,
  className,
}) => {
  const iconMap = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colorMap = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-800 dark:text-green-200',
      desc: 'text-green-700 dark:text-green-300',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-800 dark:text-red-200',
      desc: 'text-red-700 dark:text-red-300',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-amber-400',
      title: 'text-amber-800 dark:text-amber-200',
      desc: 'text-amber-700 dark:text-amber-300',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-200',
      desc: 'text-blue-700 dark:text-blue-300',
    },
  };

  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'rounded-xl border p-4',
        colors.bg,
        colors.border,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colors.icon)} />
        
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-semibold', colors.title)}>
            {title}
          </p>
          {description && (
            <p className={cn('text-sm mt-1', colors.desc)}>
              {description}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'inline-flex items-center gap-1 text-sm font-medium mt-2',
                'hover:underline',
                colors.icon
              )}
            >
              {action.label}
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-md transition-colors',
              'hover:bg-black/5 dark:hover:bg-white/5',
              colors.icon
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* =========================================
   Error Recovery Card
   ========================================= */

interface ErrorRecoveryProps {
  error: string;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}

export const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({
  error,
  onRetry,
  retrying = false,
  className,
}) => {
  const { language } = useLanguage();
  const friendlyError = getFriendlyError(error, language);
  const retryText = language === 'ar' ? 'إعادة المحاولة' : 'Try Again';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center py-8 px-4 text-center',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <XCircle className="w-7 h-7 text-destructive" />
      </div>
      
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {friendlyError}
      </p>
      
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={retrying}
          className="gap-2"
        >
          <RefreshCcw className={cn('w-4 h-4', retrying && 'animate-spin')} />
          {retryText}
        </Button>
      )}
    </motion.div>
  );
};

export default {
  MessageBanner,
  ErrorRecovery,
  getFriendlyError,
  friendlyErrors,
  successMessages,
};
