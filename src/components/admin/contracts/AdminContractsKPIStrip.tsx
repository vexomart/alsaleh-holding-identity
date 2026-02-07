/**
 * AdminContractsKPIStrip - iOS-Style KPI Cards
 * بطاقات مؤشرات الأداء بتصميم iOS احترافي
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  FileSignature,
  Banknote,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface AdminContractsKPIData {
  total: number;
  pre_approved: number;
  pending_signature: number;
  signed: number;
  cancelled: number;
  total_value?: number;
}

interface AdminContractsKPIStripProps {
  data: AdminContractsKPIData;
  isLoading?: boolean;
  onFilterByStatus?: (status: string) => void;
  activeFilter?: string;
}

interface KPIConfig {
  key: string;
  label: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  filter: string;
  highlight?: boolean;
  suffix?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="tabular-nums"
    >
      {value.toLocaleString('ar-SA')}{suffix}
    </motion.span>
  );
}

export function AdminContractsKPIStrip({ 
  data, 
  isLoading = false,
  onFilterByStatus,
  activeFilter = 'all',
}: AdminContractsKPIStripProps) {

  const kpis: KPIConfig[] = [
    {
      key: 'total',
      label: 'إجمالي العقود',
      value: data.total,
      icon: FileText,
      gradient: 'from-slate-600 to-slate-800',
      iconBg: 'bg-slate-500/25',
      iconColor: 'text-slate-200',
      filter: 'all',
    },
    {
      key: 'pre_approved',
      label: 'بانتظار الموافقة',
      value: data.pre_approved,
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-amber-700',
      iconBg: 'bg-amber-400/25',
      iconColor: 'text-amber-100',
      filter: 'pre_approved_by_customer',
      highlight: data.pre_approved > 0,
    },
    {
      key: 'pending_signature',
      label: 'بانتظار التوقيع',
      value: data.pending_signature,
      icon: FileSignature,
      gradient: 'from-indigo-500 to-indigo-700',
      iconBg: 'bg-indigo-400/25',
      iconColor: 'text-indigo-100',
      filter: 'pending_signature',
    },
    {
      key: 'signed',
      label: 'موقّعة',
      value: data.signed,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-emerald-700',
      iconBg: 'bg-emerald-400/25',
      iconColor: 'text-emerald-100',
      filter: 'signed',
    },
    {
      key: 'cancelled',
      label: 'ملغاة',
      value: data.cancelled,
      icon: XCircle,
      gradient: 'from-red-500 to-red-700',
      iconBg: 'bg-red-400/25',
      iconColor: 'text-red-100',
      filter: 'cancelled',
    },
  ];

  // Add total value if available
  if (data.total_value !== undefined && data.total_value > 0) {
    kpis.push({
      key: 'total_value',
      label: 'إجمالي القيمة',
      value: data.total_value,
      icon: Banknote,
      gradient: 'from-teal-500 to-teal-700',
      iconBg: 'bg-teal-400/25',
      iconColor: 'text-teal-100',
      filter: 'all',
      suffix: ' ر.س',
    });
  }

  if (isLoading) {
    return <AdminContractsKPISkeleton count={kpis.length} />;
  }

  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3"
      dir="rtl"
    >
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const isActive = activeFilter === kpi.filter;
        
        return (
          <motion.button
            key={kpi.key}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterByStatus?.(kpi.filter)}
            className={cn(
              "relative overflow-hidden rounded-xl p-3 sm:p-4 text-white text-right",
              "bg-gradient-to-bl shadow-lg transition-shadow duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              "min-h-[80px] sm:min-h-[90px] touch-manipulation",
              kpi.gradient,
              isActive && "ring-2 ring-white/40 shadow-xl"
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Glassmorphism hover */}
            <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-200" />
            
            {/* Highlight pulse for pending items */}
            {kpi.highlight && (
              <div className="absolute top-2 left-2">
                <span className="flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-2.5 sm:gap-3">
              <div className={cn("p-2 sm:p-2.5 rounded-lg shrink-0", kpi.iconBg)}>
                <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", kpi.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl sm:text-2xl font-bold leading-tight">
                  <AnimatedNumber value={kpi.value} suffix={kpi.suffix} />
                </p>
                <p className="text-[10px] sm:text-xs text-white/75 truncate font-medium mt-0.5">
                  {kpi.label}
                </p>
              </div>
            </div>
            
            {/* Decorative circle */}
            <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-white/5" />
          </motion.button>
        );
      })}
    </div>
  );
}

function AdminContractsKPISkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3" dir="rtl">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-xl bg-slate-800/60 p-3 sm:p-4 min-h-[80px] sm:min-h-[90px]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-slate-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-12 bg-slate-700" />
              <Skeleton className="h-3 w-16 bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
