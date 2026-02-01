/**
 * Invoice Status Badge - RTL-aware status chip
 */

import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  FileText,
} from 'lucide-react';
import { InvoiceStatus, INVOICE_STATUS_CONFIG } from './types';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusIcons: Record<InvoiceStatus, React.ElementType> = {
  draft: FileText,
  issued: Clock,
  paid: CheckCircle,
  overdue: AlertCircle,
  cancelled: XCircle,
};

export function InvoiceStatusBadge({ 
  status, 
  size = 'md',
  className 
}: InvoiceStatusBadgeProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const config = INVOICE_STATUS_CONFIG[status] || INVOICE_STATUS_CONFIG.draft;
  const Icon = StatusIcons[status] || FileText;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        sizeClasses[size],
        config.color,
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{isRTL ? config.labelAr : config.labelEn}</span>
    </div>
  );
}
