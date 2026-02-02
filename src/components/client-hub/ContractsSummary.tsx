/**
 * Contracts Summary
 * Quick overview of client contracts
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { 
  FileSignature, 
  Download, 
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContractSummary } from './types';

interface ContractsSummaryProps {
  contracts: ContractSummary[];
  className?: string;
}

const contractStatusConfig: Record<string, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  labelEn: string;
  labelAr: string;
}> = {
  signed: {
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
    labelEn: 'Signed',
    labelAr: 'موقع',
  },
  pending_signature: {
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
    labelEn: 'Pending Signature',
    labelAr: 'بانتظار التوقيع',
  },
  pending_approval: {
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
    labelEn: 'Pending Approval',
    labelAr: 'بانتظار الموافقة',
  },
  draft: {
    icon: FileSignature,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-900/40',
    labelEn: 'Draft',
    labelAr: 'مسودة',
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
    labelEn: 'Rejected',
    labelAr: 'مرفوض',
  },
};

export function ContractsSummary({ contracts, className }: ContractsSummaryProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  if (contracts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={cn('space-y-4', className)}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-purple-500 rounded-full" />
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {isRTL ? 'العقود' : 'Contracts'}
          </h2>
        </div>
        <div className="rounded-xl border bg-card p-8 text-center">
          <FileSignature className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {isRTL ? 'لا توجد عقود' : 'No contracts'}
          </p>
        </div>
      </motion.div>
    );
  }

  const expiringSoon = contracts.filter(c => c.isExpiringSoon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn('space-y-4', className)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-purple-500 rounded-full" />
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {isRTL ? 'العقود' : 'Contracts'}
        </h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ms-2">
          {contracts.length}
        </span>
        {expiringSoon.length > 0 && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full flex items-center gap-1 ms-auto">
            <AlertTriangle className="h-3 w-3" />
            {isRTL ? `${expiringSoon.length} تنتهي قريباً` : `${expiringSoon.length} expiring soon`}
          </span>
        )}
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
        {contracts.map((contract, index) => {
          const status = contractStatusConfig[contract.status] || contractStatusConfig.draft;
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
              className={cn(
                'rounded-xl border bg-card p-4',
                contract.isExpiringSoon && 'border-amber-300 dark:border-amber-700'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Contract Icon */}
                <div className={cn(
                  'p-2.5 rounded-lg',
                  contract.isExpiringSoon 
                    ? 'bg-amber-50 dark:bg-amber-900/20' 
                    : 'bg-purple-50 dark:bg-purple-900/20'
                )}>
                  {contract.isExpiringSoon ? (
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <FileSignature className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span dir="ltr" className="font-mono text-sm font-semibold text-foreground ltr-token">
                      {contract.contractNumber}
                    </span>
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                      status.bgColor,
                      status.color
                    )}>
                      <StatusIcon className="h-3 w-3" />
                      {isRTL ? status.labelAr : status.labelEn}
                    </span>
                  </div>

                  {/* Service Name */}
                  {(contract.serviceName || contract.serviceNameAr) && (
                    <p className="text-sm text-muted-foreground mb-1">
                      {isRTL && contract.serviceNameAr 
                        ? contract.serviceNameAr 
                        : contract.serviceName
                      }
                    </p>
                  )}

                  {/* Dates */}
                  <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                    {contract.signedAt && (
                      <span>
                        {isRTL ? 'التوقيع: ' : 'Signed: '}
                        {formatDate(contract.signedAt)}
                      </span>
                    )}
                    {contract.expiresAt && (
                      <span className={contract.isExpiringSoon ? 'text-amber-600 dark:text-amber-400' : ''}>
                        {isRTL ? 'ينتهي: ' : 'Expires: '}
                        {formatDate(contract.expiresAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {contract.status === 'signed' && (
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/app/contracts/${contract.id}`)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Link */}
      {contracts.length >= 3 && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/app/contracts')}
        >
          {isRTL ? 'عرض جميع العقود' : 'View All Contracts'}
        </Button>
      )}
    </motion.div>
  );
}
