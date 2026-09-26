/**
 * Smart Error Handler Hook
 * Centralizes error handling with friendly messages
 * Integrates with toast system
 */

import { useCallback } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { getFriendlyError } from '@/components/ux/FriendlyMessages';

interface UseSmartErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
}

export function useSmartError(options: UseSmartErrorOptions = {}) {
  const { showToast = true, logToConsole = true } = options;
  const { language } = useLanguage();

  const handleError = useCallback((error: unknown, context?: string) => {
    const friendlyMessage = getFriendlyError(error, language);
    
    // Log to console in development
    if (logToConsole && import.meta.env.DEV) {
      console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    }
    
    // Show toast
    if (showToast) {
      toast.error(friendlyMessage, {
        description: context,
        duration: 5000,
      });
    }
    
    return friendlyMessage;
  }, [language, showToast, logToConsole]);

  const handleSuccess = useCallback((messageKey: string, customMessage?: string) => {
    const messages: Record<string, Record<string, string>> = {
      ar: {
        'saved': 'تم الحفظ بنجاح',
        'created': 'تم الإنشاء بنجاح',
        'updated': 'تم التحديث بنجاح',
        'deleted': 'تم الحذف بنجاح',
        'sent': 'تم الإرسال بنجاح',
        'copied': 'تم النسخ',
      },
      en: {
        'saved': 'Saved successfully',
        'created': 'Created successfully',
        'updated': 'Updated successfully',
        'deleted': 'Deleted successfully',
        'sent': 'Sent successfully',
        'copied': 'Copied',
      },
    };

    const message = customMessage || messages[language]?.[messageKey] || messages.ar.saved;
    
    toast.success(message, {
      duration: 3000,
    });

    return message;
  }, [language]);

  return {
    handleError,
    handleSuccess,
  };
}

export default useSmartError;
