/**
 * ContractsKPIStrip - Premium Banking Portal KPI cards
 * تصميم بنكي احترافي للعملاء
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Hourglass,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

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
  activeFilter?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

// Animated number component
function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="tabular-nums"
    >
      {value}
    </motion.span>
  );
}

interface KPIConfig {
  key: string;
  labelAr: string;
  labelEn: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  filter: string;
  highlight?: boolean;
}

export function ContractsKPIStrip({ 
  data, 
  isLoading = false,
  onFilterByStatus,
  activeFilter = 'all',
}: ContractsKPIStripProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const kpis: KPIConfig[] = [
    {
      key: 'total',
      labelAr: 'إجمالي العقود',
      labelEn: 'Total Contracts',
      value: data.total,
      icon: FileText,
      gradient: 'from-slate-600 to-slate-800',
      iconBg: 'bg-slate-500/20',
      iconColor: 'text-slate-100',
      filter: 'all',
    },
    {
      key: 'pending_signature',
      labelAr: 'بانتظار التوقيع',
      labelEn: 'Pending Signature',
      value: data.pending_signature,
      icon: Clock,
      gradient: 'from-indigo-500 to-indigo-700',
      iconBg: 'bg-indigo-400/20',
      iconColor: 'text-indigo-100',
      filter: 'pending_signature',
      highlight: data.pending_signature > 0,
    },
    {
      key: 'pending_admin',
      labelAr: 'بانتظار الاعتماد',
      labelEn: 'Pending Approval',
      value: data.pending_admin,
      icon: Hourglass,
      gradient: 'from-amber-500 to-amber-700',
      iconBg: 'bg-amber-400/20',
      iconColor: 'text-amber-100',
      filter: 'pending_admin_approval',
    },
    {
      key: 'signed',
      labelAr: 'معتمدة',
      labelEn: 'Signed',
      value: data.signed,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-emerald-700',
      iconBg: 'bg-emerald-400/20',
      iconColor: 'text-emerald-100',
      filter: 'signed',
    },
    {
      key: 'cancelled',
      labelAr: 'مرفوضة',
      labelEn: 'Cancelled',
      value: data.cancelled,
      icon: XCircle,
      gradient: 'from-red-500 to-red-700',
      iconBg: 'bg-red-400/20',
      iconColor: 'text-red-100',
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
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <button 
            className={cn(
              "relative w-full overflow-hidden rounded-xl p-4",
              "bg-gradient-to-br",
              kpi.gradient,
              "text-white shadow-lg",
              "transition-all duration-300",
              "hover:shadow-xl",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "group",
              activeFilter === kpi.filter && "ring-2 ring-white/50"
            )}
            onClick={() => onFilterByStatus?.(kpi.filter)}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Highlight indicator */}
            {kpi.highlight && (
              <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                </span>
              </div>
            )}
            
            {/* Content */}
            <div className={cn(
              "relative z-10 flex items-center gap-3",
              isRTL && "flex-row-reverse"
            )}>
              <div className={cn(
                "p-2.5 rounded-lg shrink-0",
                kpi.iconBg
              )}>
                <kpi.icon className={cn("h-5 w-5", kpi.iconColor)} />
              </div>
              <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                <p className="text-2xl sm:text-3xl font-bold">
                  <AnimatedNumber value={kpi.value} />
                </p>
                <p className="text-xs text-white/80 truncate font-medium">
                  {isRTL ? kpi.labelAr : kpi.labelEn}
                </p>
              </div>
            </div>
            
            {/* Decorative circle */}
            <div className="absolute -bottom-4 -right-4 rtl:-right-auto rtl:-left-4 w-16 h-16 rounded-full bg-white/5" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

function ContractsKPISkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-xl bg-muted animate-pulse p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
