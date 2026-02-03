/**
 * ContractsCardList - Premium mobile-first card view
 * Navigates to internal details page
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { CustomerContract } from './types';
import { ContractStatusBadge } from './ContractStatusBadge';

interface ContractsCardListProps {
  contracts: CustomerContract[];
  isLoading: boolean;
  onCardClick: (contract: CustomerContract) => void;
  onSign?: (contract: CustomerContract) => void;
  onDownload?: (contract: CustomerContract) => void;
  onViewOrder?: (orderId: string) => void;
  selectedContractId?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export function ContractsCardList({
  contracts,
  isLoading,
  onViewOrder,
  selectedContractId,
}: ContractsCardListProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency || 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const handleNavigateToDetails = (contract: CustomerContract) => {
    navigate(`/app/contracts/${contract.id}`);
  };

  if (isLoading) {
    return <ContractsCardSkeleton />;
  }

  return (
    <div className="space-y-3">
      {contracts.map((contract, index) => (
        <motion.div
          key={contract.id}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className={cn(
              'relative overflow-hidden rounded-xl cursor-pointer',
              'bg-card border-2 transition-all duration-300',
              'hover:shadow-xl hover:border-teal-500/50',
              'active:scale-[0.98]',
              selectedContractId === contract.id 
                ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-lg shadow-teal-500/10' 
                : 'border-border'
            )}
            onClick={() => handleNavigateToDetails(contract)}
          >
            {/* Top gradient bar based on status */}
            <div className={cn(
              'h-1.5 w-full',
              contract.status === 'signed' && 'bg-gradient-to-r from-emerald-500 to-emerald-600',
              contract.status === 'pending_signature' && 'bg-gradient-to-r from-indigo-500 to-indigo-600',
              contract.status === 'pending_admin_approval' && 'bg-gradient-to-r from-amber-500 to-amber-600',
              contract.status === 'cancelled' && 'bg-gradient-to-r from-red-500 to-red-600',
              contract.status === 'draft' && 'bg-gradient-to-r from-slate-400 to-slate-500',
              !['signed', 'pending_signature', 'pending_admin_approval', 'cancelled', 'draft'].includes(contract.status) && 'bg-gradient-to-r from-teal-500 to-teal-600'
            )} />
            
            <div className="p-4">
              {/* Header: Status + Amount */}
              <div className={cn(
                "flex items-start justify-between gap-3 mb-3",
                isRTL && "flex-row-reverse"
              )}>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate mb-2 text-foreground">
                    {contract.service
                      ? (isRTL 
                          ? (contract.service.name_ar || contract.service.name)
                          : contract.service.name)
                      : (isRTL ? 'عقد تقديم خدمات' : 'Service Contract')}
                  </h3>
                  <ContractStatusBadge status={contract.status} />
                </div>
                {contract.pricing_json?.total && (
                  <div className={cn(
                    "shrink-0 px-3 py-2 rounded-lg",
                    "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30",
                    "border border-teal-200 dark:border-teal-800",
                    isRTL ? "text-start" : "text-end"
                  )}>
                    <p dir="ltr" className="text-lg font-bold text-teal-700 dark:text-teal-300 tabular-nums">
                      {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                    </p>
                    <p className="text-xs text-teal-600/80 dark:text-teal-400/80">
                      {isRTL ? 'شامل الضريبة' : 'incl. VAT'}
                    </p>
                  </div>
                )}
              </div>

              {/* Contract Number + Order Reference */}
              <div className={cn("flex items-center gap-3 mb-3 flex-wrap", isRTL && "flex-row-reverse")}>
                <span 
                  dir="ltr" 
                  className="inline-block font-mono text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-lg tabular-nums"
                >
                  {contract.contract_number}
                </span>
                {contract.order && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrder?.(contract.order!.id);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:underline px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <span dir="ltr" className="font-mono tabular-nums">
                      {contract.order.order_number}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Footer: Dates + View Button */}
              <div className={cn(
                "flex items-center justify-between gap-2 pt-3 border-t border-border/50",
                isRTL && "flex-row-reverse"
              )}>
                <div className={cn("flex items-center gap-3 text-sm text-muted-foreground", isRTL && "flex-row-reverse")}>
                  <span className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(contract.created_at)}
                  </span>
                </div>
                
                {/* View Details Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "gap-1.5 text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 h-9",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Signed badge overlay */}
            {contract.status === 'signed' && (
              <div className="absolute top-3 left-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="text-xs font-medium">{isRTL ? 'موقّع' : 'Signed'}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ContractsCardSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-xl border-2 bg-card animate-pulse overflow-hidden">
          <div className="h-1.5 w-full bg-muted" />
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <Skeleton className="h-14 w-28 rounded-lg" />
            </div>
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-7 w-32 rounded-lg" />
              <Skeleton className="h-7 w-24 rounded-lg" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
