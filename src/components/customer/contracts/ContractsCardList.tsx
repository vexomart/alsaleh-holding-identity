/**
 * ContractsCardList - Mobile-first card view for contracts
 * RTL-first with animations
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Calendar, ArrowLeft, ArrowRight, FileSignature, Download } from 'lucide-react';
import { CustomerContract } from './types';
import { ContractStatusBadge } from './ContractStatusBadge';

interface ContractsCardListProps {
  contracts: CustomerContract[];
  isLoading: boolean;
  onCardClick: (contract: CustomerContract) => void;
  onSign?: (contract: CustomerContract) => void;
  onDownload?: (contract: CustomerContract) => void;
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
      duration: 0.2,
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
          whileTap={{ scale: 0.99 }}
        >
          <Card
            className={cn(
              'cursor-pointer transition-all duration-200',
              'hover:shadow-md hover:border-primary/20',
              'active:scale-[0.99]',
              selectedContractId === contract.id && 'border-primary ring-1 ring-primary/20'
            )}
            onClick={() => onCardClick(contract)}
          >
            <CardContent className="p-4">
              {/* Header: Status + Service Name */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
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
                  <div className="text-end shrink-0">
                    <p dir="ltr" className="text-lg font-bold text-primary tabular-nums">
                      {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                    </p>
                  </div>
                )}
              </div>

              {/* Contract Number */}
              <div className="mb-3">
                <span 
                  dir="ltr" 
                  className="inline-block font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded tabular-nums"
                >
                  {contract.contract_number}
                </span>
              </div>

              {/* Footer: Date + Actions */}
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(contract.created_at)}
                </span>
                
                <div className="flex items-center gap-2">
                  {contract.status === 'pending_signature' && onSign && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="gap-1 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSign(contract);
                      }}
                    >
                      <FileSignature className="h-3.5 w-3.5" />
                      {isRTL ? 'توقيع' : 'Sign'}
                    </Button>
                  )}
                  {contract.status === 'signed' && onDownload && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(contract);
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                      {isRTL ? 'PDF' : 'PDF'}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="gap-1 text-primary h-8">
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
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
