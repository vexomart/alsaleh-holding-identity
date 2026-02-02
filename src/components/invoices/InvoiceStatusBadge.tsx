/**
 * Invoice Status Badge
 * Enterprise-grade status indicator with icons
 */

import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Send
} from 'lucide-react';
import { InvoiceViewStatus, INVOICE_STATUS_CONFIG } from './types';

interface InvoiceStatusBadgeProps {
  status: InvoiceViewStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusIcons: Record<InvoiceViewStatus, React.ElementType> = {
  draft: FileText,
  pending: Clock,
  issued: Send,
  paid: CheckCircle,
  overdue: AlertTriangle,
  cancelled: XCircle,
};

export function InvoiceStatusBadge({ 
  status, 
  size = 'md',
  showIcon = true 
}: InvoiceStatusBadgeProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const config = INVOICE_STATUS_CONFIG[status] || INVOICE_STATUS_CONFIG.draft;
  const Icon = statusIcons[status] || FileText;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        config.bgColor,
        config.color,
        config.borderColor,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={cn(iconSizes[size], config.iconColor)} />}
      <span>{isRTL ? config.labelAr : config.labelEn}</span>
    </span>
  );
}
