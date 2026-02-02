/**
 * Invoice Status Badge
 * Classic corporate status indicator
 */

import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Check, Clock, AlertTriangle, X, FileText, Send } from 'lucide-react';
import { InvoiceViewStatus, INVOICE_STATUS_CONFIG } from './types';

interface InvoiceStatusBadgeProps {
  status: InvoiceViewStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusIcons: Record<InvoiceViewStatus, React.ElementType> = {
  draft: FileText,
  pending: Clock,
  issued: Send,
  paid: Check,
  overdue: AlertTriangle,
  cancelled: X,
};

export function InvoiceStatusBadge({ 
  status, 
  size = 'md',
}: InvoiceStatusBadgeProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const config = INVOICE_STATUS_CONFIG[status] || INVOICE_STATUS_CONFIG.draft;
  const Icon = statusIcons[status] || FileText;
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center font-semibold rounded tracking-wide uppercase',
        config.bgColor,
        config.color,
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      {isRTL ? config.labelAr : config.labelEn}
    </span>
  );
}
