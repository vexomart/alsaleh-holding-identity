/**
 * ContractsCardList - Mobile-first card view for contracts
 * RTL-first with premium animations
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  FileSignature, 
  Download,
  ExternalLink,
  Clock,
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

// Card animation variants
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
  onCardClick,
  onSign,
  onDownload,
  onViewOrder,
  selectedContractId,
}: ContractsCardListProps) {
  const { language } = useLanguage();
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
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={cn(
              'cursor-pointer transition-all duration-200',
              'hover:shadow-lg hover:border-primary/30',
              'active:scale-[0.98]',
              selectedContractId === contract.id && 'border-primary ring-2 ring-primary/20'
            )}
            onClick={() => onCardClick(contract)}
          >
            <CardContent className="p-4">
              {/* Header: Status + Amount */}
              <div className={cn(
                "flex items-start justify-between gap-3 mb-3",
                isRTL && "flex-row-reverse"
              )}>
                <div className="flex-1 min-w-0">
                  {/* Service/Contract Name */}
                  <h3 className="font-semibold text-base truncate mb-2">
                    {contract.service
                      ? (isRTL 
                          ? (contract.service.name_ar || contract.service.name)
                          : contract.service.name)
                      : (isRTL ? 'عقد تقديم خدمات' : 'Service Contract')}
                  </h3>
                  <ContractStatusBadge status={contract.status} />
                </div>
                {contract.pricing_json?.total && (
                  <div className={cn("shrink-0", isRTL ? "text-start" : "text-end")}>
                    <p dir="ltr" className="text-lg font-bold text-primary tabular-nums">
                      {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'شامل الضريبة' : 'incl. VAT'}
                    </p>
                  </div>
                )}
              </div>

              {/* Contract Number + Order Reference */}
              <div className={cn("flex items-center gap-3 mb-3 flex-wrap", isRTL && "flex-row-reverse")}>
                <span 
                  dir="ltr" 
                  className="inline-block font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded tabular-nums"
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
                      "inline-flex items-center gap-1 text-xs text-primary hover:underline",
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

              {/* Footer: Dates + Actions */}
              <div className={cn(
                "flex items-center justify-between gap-2 pt-3 border-t",
                isRTL && "flex-row-reverse"
              )}>
                <div className={cn("flex items-center gap-3 text-sm text-muted-foreground", isRTL && "flex-row-reverse")}>
                  <span className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(contract.created_at)}
                  </span>
                  {contract.updated_at !== contract.created_at && (
                    <span className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(contract.updated_at)}
                    </span>
                  )}
                </div>
                
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  {/* Primary CTA based on status */}
                  {contract.status === 'pending_signature' && onSign ? (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="gap-1.5 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSign(contract);
                      }}
                    >
                      <FileSignature className="h-3.5 w-3.5" />
                      {isRTL ? 'توقيع' : 'Sign'}
                    </Button>
                  ) : contract.status === 'signed' && onDownload ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(contract);
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </Button>
                  ) : null}
                  
                  {/* View Details */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("gap-1 text-primary h-8", isRTL && "flex-row-reverse")}
                  >
                    {isRTL ? 'التفاصيل' : 'Details'}
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Skeleton loader for cards
function ContractsCardSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
