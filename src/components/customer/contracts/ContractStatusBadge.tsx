/**
 * ContractStatusBadge - Consistent status display
 * RTL-first with proper colors
 */

import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { CONTRACT_STATUS_CONFIG, ContractStatus } from './types';
import { 
  FileText, 
  ThumbsUp, 
  Hourglass, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface ContractStatusBadgeProps {
  status: ContractStatus | null;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const StatusIcons: Record<ContractStatus, React.ElementType> = {
  draft: FileText,
  pre_approved_by_customer: ThumbsUp,
  pending_admin_approval: Hourglass,
  pending_signature: Clock,
  signed: CheckCircle2,
  cancelled: XCircle,
};

export function ContractStatusBadge({ 
  status, 
  size = 'md',
  showIcon = true,
}: ContractStatusBadgeProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const effectiveStatus = status || 'draft';
  const config = CONTRACT_STATUS_CONFIG[effectiveStatus];
  const Icon = StatusIcons[effectiveStatus];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        config.bgColor,
        config.color,
        config.borderColor,
        sizeClasses[size],
        isRTL && 'flex-row-reverse'
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{isRTL ? config.labelAr : config.labelEn}</span>
    </span>
  );
}
