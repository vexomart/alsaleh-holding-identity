/**
 * Invoice Status Badge
 * Clean minimal status indicator
 */

import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { InvoiceViewStatus, INVOICE_STATUS_CONFIG } from './types';

interface InvoiceStatusBadgeProps {
  status: InvoiceViewStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function InvoiceStatusBadge({ 
  status, 
  size = 'md',
}: InvoiceStatusBadgeProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const config = INVOICE_STATUS_CONFIG[status] || INVOICE_STATUS_CONFIG.draft;
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        config.bgColor,
        config.color,
        sizeClasses[size]
      )}
    >
      {isRTL ? config.labelAr : config.labelEn}
    </span>
  );
}
