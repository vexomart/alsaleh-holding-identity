/**
 * ContractsKPIStrip - Status statistics cards
 * Enterprise-grade, RTL-first, animated
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Hourglass,
  FileSignature,
} from 'lucide-react';

export interface ContractsKPIData {
  total: number;
  pending_signature: number;
  pending_admin: number;
  signed: number;
  cancelled: number;
}

interface ContractsKPIStripProps {
  data: ContractsKPIData;
  isLoading?: boolean;
  onFilterByStatus?: (status: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

export function ContractsKPIStrip({ 
  data, 
  isLoading = false,
  onFilterByStatus,
}: ContractsKPIStripProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const kpis = [
    {
      key: 'total',
      labelAr: 'إجمالي العقود',
      labelEn: 'Total Contracts',
      value: data.total,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      filter: 'all',
    },
    {
      key: 'pending_signature',
      labelAr: 'بانتظار التوقيع',
      labelEn: 'Pending Signature',
      value: data.pending_signature,
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      filter: 'pending_signature',
    },
    {
      key: 'pending_admin',
      labelAr: 'بانتظار الاعتماد',
      labelEn: 'Pending Approval',
      value: data.pending_admin,
      icon: Hourglass,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      borderColor: 'border-amber-200 dark:border-amber-800',
      filter: 'pending_admin_approval',
    },
    {
      key: 'signed',
      labelAr: 'معتمدة',
      labelEn: 'Signed',
      value: data.signed,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      filter: 'signed',
    },
    {
      key: 'cancelled',
      labelAr: 'مرفوضة',
      labelEn: 'Cancelled',
      value: data.cancelled,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800',
      filter: 'cancelled',
    },
  ];

  if (isLoading) {
    return <ContractsKPISkeleton />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.key}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card 
            className={cn(
              'cursor-pointer transition-all duration-200 border-2',
              'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
              kpi.borderColor
            )}
            onClick={() => onFilterByStatus?.(kpi.filter)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className={cn(
                "flex items-center gap-3",
                isRTL && "flex-row-reverse"
              )}>
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  kpi.bgColor
                )}>
                  <kpi.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", kpi.color)} />
                </div>
                <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                  <motion.p 
                    className={cn("text-xl sm:text-2xl font-bold tabular-nums", kpi.color)}
                    initial="hidden"
                    animate="visible"
                    variants={numberVariants}
                  >
                    {kpi.value}
                  </motion.p>
                  <p className="text-xs text-muted-foreground truncate">
                    {isRTL ? kpi.labelAr : kpi.labelEn}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function ContractsKPISkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
