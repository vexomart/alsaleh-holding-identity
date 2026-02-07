/**
 * AdminContractsKPIStrip - Premium KPI Cards for Admin
 * Bloomberg-style command center metrics
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
  AlertTriangle,
  FileSignature,
  DollarSign,
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

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

// Animated number component
function AnimatedNumber({ value, prefix, suffix }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="tabular-nums"
    >
      {prefix}{value.toLocaleString()}{suffix}
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
  prefix?: string;
  suffix?: string;
}

export function AdminContractsKPIStrip({ 
  data, 
  isLoading = false,
  onFilterByStatus,
  activeFilter = 'all',
}: AdminContractsKPIStripProps) {
  const { isRTL } = useLanguage();

  const kpis: KPIConfig[] = [
    {
      key: 'total',
      labelAr: 'إجمالي العقود',
      labelEn: 'Total Contracts',
      value: data.total,
      icon: FileText,
      gradient: 'from-slate-700 to-slate-900',
      iconBg: 'bg-slate-600/30',
      iconColor: 'text-slate-200',
      filter: 'all',
    },
    {
      key: 'pre_approved',
      labelAr: 'بانتظار الموافقة',
      labelEn: 'Pending Approval',
      value: data.pre_approved,
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-amber-700',
      iconBg: 'bg-amber-400/30',
      iconColor: 'text-amber-100',
      filter: 'pre_approved_by_customer',
      highlight: data.pre_approved > 0,
    },
    {
      key: 'pending_signature',
      labelAr: 'بانتظار التوقيع',
      labelEn: 'Awaiting Signature',
      value: data.pending_signature,
      icon: FileSignature,
      gradient: 'from-indigo-500 to-indigo-700',
      iconBg: 'bg-indigo-400/30',
      iconColor: 'text-indigo-100',
      filter: 'pending_signature',
    },
    {
      key: 'signed',
      labelAr: 'موقّعة',
      labelEn: 'Signed',
      value: data.signed,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-emerald-700',
      iconBg: 'bg-emerald-400/30',
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
      iconBg: 'bg-red-400/30',
      iconColor: 'text-red-100',
      filter: 'cancelled',
    },
  ];

  // Add total value card if available
  if (data.total_value !== undefined && data.total_value > 0) {
    kpis.push({
      key: 'total_value',
      labelAr: 'إجمالي القيمة',
      labelEn: 'Total Value',
      value: data.total_value,
      icon: DollarSign,
      gradient: 'from-teal-500 to-teal-700',
      iconBg: 'bg-teal-400/30',
      iconColor: 'text-teal-100',
      filter: 'all',
      suffix: ' ر.س',
    });
  }

  if (isLoading) {
    return <AdminContractsKPISkeleton count={kpis.length} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3" dir="rtl">
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
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Highlight indicator for pending items */}
            {kpi.highlight && (
              <div className="absolute top-2 left-2">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-3 flex-row-reverse">
              <div className={cn(
                "p-2.5 rounded-lg shrink-0",
                kpi.iconBg
              )}>
                <kpi.icon className={cn("h-5 w-5", kpi.iconColor)} />
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-2xl sm:text-3xl font-bold">
                  <AnimatedNumber 
                    value={kpi.value} 
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                  />
                </p>
                <p className="text-xs text-white/80 truncate font-medium">
                  {kpi.labelAr}
                </p>
              </div>
            </div>
            
            {/* Decorative circle */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

function AdminContractsKPISkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3" dir="rtl">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-xl bg-slate-800 animate-pulse p-4">
          <div className="flex items-center gap-3 flex-row-reverse">
            <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-14 bg-slate-700" />
              <Skeleton className="h-3 w-20 bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
