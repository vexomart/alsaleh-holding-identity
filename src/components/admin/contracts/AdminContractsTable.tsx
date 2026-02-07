/**
 * AdminContractsTable - iOS-Style Enterprise Table
 * جدول عقود احترافي متجاوب بتصميم iOS
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileSignature,
  AlertTriangle,
  FileText,
  Eye,
  Check,
  X,
  Copy,
  User,
  Banknote,
  Calendar,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type ContractStatus = 
  | 'draft' 
  | 'pre_approved_by_customer' 
  | 'pending_admin_approval' 
  | 'pending_signature' 
  | 'signed' 
  | 'cancelled';

interface ContractService {
  id: string;
  name: string;
  name_ar: string | null;
}

interface ContractCustomer {
  id: string;
  full_name: string | null;
  full_name_ar: string | null;
  email: string;
  phone: string | null;
  customer_uid: string | null;
}

interface ContractPricing {
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  currency: string;
}

export interface AdminContract {
  id: string;
  contract_number: string;
  customer_user_id: string;
  service_id: string | null;
  order_id: string | null;
  status: ContractStatus;
  locale: string | null;
  pricing_json: ContractPricing | null;
  scope_summary: string | null;
  scope_summary_ar: string | null;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
  customer_pre_approval: boolean | null;
  pre_approval_timestamp: string | null;
  admin_approved_at: string | null;
  service?: ContractService | null;
  customer?: ContractCustomer | null;
}

const statusConfig: Record<ContractStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon;
}> = {
  draft: {
    label: 'مسودة',
    color: 'text-slate-300',
    bgColor: 'bg-slate-700/60',
    borderColor: 'border-slate-600',
    icon: FileText,
  },
  pre_approved_by_customer: {
    label: 'بانتظار الموافقة',
    color: 'text-amber-300',
    bgColor: 'bg-amber-900/50',
    borderColor: 'border-amber-700/60',
    icon: AlertTriangle,
  },
  pending_admin_approval: {
    label: 'بانتظار الإدارة',
    color: 'text-amber-300',
    bgColor: 'bg-amber-900/50',
    borderColor: 'border-amber-700/60',
    icon: AlertTriangle,
  },
  pending_signature: {
    label: 'بانتظار التوقيع',
    color: 'text-indigo-300',
    bgColor: 'bg-indigo-900/50',
    borderColor: 'border-indigo-700/60',
    icon: FileSignature,
  },
  signed: {
    label: 'موقّع',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-900/50',
    borderColor: 'border-emerald-700/60',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'ملغي',
    color: 'text-red-300',
    bgColor: 'bg-red-900/50',
    borderColor: 'border-red-700/60',
    icon: XCircle,
  },
};

interface AdminContractsTableProps {
  contracts: AdminContract[];
  isLoading: boolean;
  onViewDetails: (contract: AdminContract) => void;
  onApprove: (contract: AdminContract) => void;
  onReject: (contract: AdminContract) => void;
  onCopyNumber: (contractNumber: string) => void;
}

const rowVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export function AdminContractsTable({
  contracts,
  isLoading,
  onViewDetails,
  onApprove,
  onReject,
  onCopyNumber,
}: AdminContractsTableProps) {

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: ContractStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border",
        config.bgColor,
        config.color,
        config.borderColor
      )}>
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </div>
    );
  };

  if (isLoading) {
    return <AdminContractsTableSkeleton />;
  }

  if (contracts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-slate-700/60 bg-slate-800/40"
      >
        <div className="p-4 rounded-full bg-slate-700/40 mb-4">
          <FileText className="h-10 w-10 text-slate-500" />
        </div>
        <h3 className="font-semibold text-lg text-white mb-1">
          لا توجد عقود
        </h3>
        <p className="text-slate-400 text-sm max-w-xs">
          لم يتم العثور على أي عقود مطابقة للبحث أو الفلتر المحدد
        </p>
      </motion.div>
    );
  }

  return (
    <div dir="rtl" className="w-full">
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-2xl border border-slate-700/60 bg-slate-900/60 overflow-hidden">
        <ScrollArea className="h-[600px]">
          <table 
            className="w-full border-collapse"
            style={{ direction: 'rtl', textAlign: 'right' }}
          >
            <thead className="bg-slate-800/80 sticky top-0 z-10">
              <tr className="border-b border-slate-700/60">
                <th 
                  className="py-3.5 px-4 text-xs font-semibold text-slate-300 w-[130px]"
                  style={{ textAlign: 'right' }}
                >
                  الحالة
                </th>
                <th 
                  className="py-3.5 px-4 text-xs font-semibold text-slate-300 min-w-[150px]"
                  style={{ textAlign: 'right' }}
                >
                  رقم العقد
                </th>
                <th 
                  className="py-3.5 px-4 text-xs font-semibold text-slate-300 min-w-[180px]"
                  style={{ textAlign: 'right' }}
                >
                  <div className="flex items-center gap-1.5 justify-start">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>العميل</span>
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 text-xs font-semibold text-slate-300 min-w-[140px]"
                  style={{ textAlign: 'right' }}
                >
                  الخدمة
                </th>
                <th 
                  className="py-3.5 px-4 text-xs font-semibold text-slate-300 w-[120px]"
                  style={{ textAlign: 'right' }}
                >
                  <div className="flex items-center gap-1.5 justify-start">
                    <Banknote className="h-3.5 w-3.5 text-slate-400" />
                    <span>القيمة</span>
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 text-xs font-semibold text-slate-300 w-[130px]"
                  style={{ textAlign: 'right' }}
                >
                  <div className="flex items-center gap-1.5 justify-start">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>التاريخ</span>
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 text-xs font-semibold text-slate-300 w-[120px]"
                  style={{ textAlign: 'center' }}
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {contracts.map((contract, index) => (
                <motion.tr
                  key={contract.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className={cn(
                    'group hover:bg-slate-800/50 cursor-pointer transition-colors duration-150',
                    contract.status === 'pre_approved_by_customer' && 'bg-amber-950/15'
                  )}
                  onClick={() => onViewDetails(contract)}
                  style={{ direction: 'rtl' }}
                >
                  <td className="py-3 px-4" style={{ textAlign: 'right' }}>
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="py-3 px-4" style={{ textAlign: 'right' }}>
                    <div className="flex items-center gap-2 justify-start">
                      <code className="px-2 py-1 bg-slate-700/60 rounded-md text-xs font-mono text-slate-200">
                        {contract.contract_number}
                      </code>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white hover:bg-slate-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCopyNumber(contract.contract_number);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">نسخ</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                  <td className="py-3 px-4" style={{ textAlign: 'right' }}>
                    <div className="flex flex-col gap-0.5 items-start">
                      <span className="font-medium text-sm text-white truncate max-w-[160px]">
                        {contract.customer?.full_name_ar || contract.customer?.full_name || '-'}
                      </span>
                      <span className="text-xs text-slate-400 truncate max-w-[160px]" dir="ltr">
                        {contract.customer?.email}
                      </span>
                      {contract.customer?.customer_uid && (
                        <Badge variant="outline" className="text-[9px] w-fit border-slate-600 text-slate-400 px-1.5 py-0">
                          {contract.customer.customer_uid}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4" style={{ textAlign: 'right' }}>
                    <span className="text-sm text-slate-200 truncate block max-w-[130px]">
                      {contract.service?.name_ar || contract.service?.name || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4" style={{ textAlign: 'right' }}>
                    {contract.pricing_json ? (
                      <div className="flex flex-col gap-0.5 items-start">
                        <span className="font-semibold text-sm text-white">
                          {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                        </span>
                        <span className="text-[10px] text-slate-400">شامل الضريبة</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400" style={{ textAlign: 'right' }}>
                    {formatDate(contract.created_at)}
                  </td>
                  <td className="py-3 px-4" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                              onClick={() => onViewDetails(contract)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">عرض</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {contract.status === 'pre_approved_by_customer' && (
                        <>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/40"
                                  onClick={() => onApprove(contract)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">موافقة</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/40"
                                  onClick={() => onReject(contract)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">رفض</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {contracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={rowVariants}
            onClick={() => onViewDetails(contract)}
            className={cn(
              "rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 cursor-pointer",
              "active:scale-[0.98] transition-transform duration-150 touch-manipulation",
              contract.status === 'pre_approved_by_customer' && 'border-amber-700/40 bg-amber-950/20'
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {getStatusBadge(contract.status)}
                  <code className="px-1.5 py-0.5 bg-slate-700/50 rounded text-[10px] font-mono text-slate-300">
                    {contract.contract_number}
                  </code>
                </div>
                <h3 className="font-semibold text-white text-sm truncate">
                  {contract.customer?.full_name_ar || contract.customer?.full_name || '-'}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {contract.service?.name_ar || contract.service?.name || '-'}
                </p>
              </div>
              {contract.pricing_json && (
                <div className="text-left shrink-0">
                  <p className="font-bold text-white text-sm">
                    {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                  </p>
                  <p className="text-[10px] text-slate-400">شامل الضريبة</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
              <span className="text-xs text-slate-400">
                {formatDate(contract.created_at)}
              </span>
              
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                  onClick={() => onViewDetails(contract)}
                >
                  <Eye className="h-4 w-4 me-1.5" />
                  عرض
                </Button>
                
                {contract.status === 'pre_approved_by_customer' && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/40 rounded-lg"
                      onClick={() => onApprove(contract)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-400 hover:text-red-300 hover:bg-red-900/40 rounded-lg"
                      onClick={() => onReject(contract)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AdminContractsTableSkeleton() {
  return (
    <div dir="rtl">
      {/* Desktop Skeleton */}
      <div className="hidden lg:block rounded-2xl border border-slate-700/60 bg-slate-900/60 overflow-hidden p-4">
        <div className="space-y-3">
          <div className="flex gap-4 pb-3 border-b border-slate-700/40">
            {[100, 140, 180, 140, 100, 120, 100].map((w, i) => (
              <Skeleton key={i} className="h-8 bg-slate-700/60" style={{ width: w }} />
            ))}
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3 items-center">
              <Skeleton className="h-6 w-24 rounded-full bg-slate-700/60" />
              <Skeleton className="h-6 w-32 bg-slate-700/60" />
              <Skeleton className="h-12 flex-1 bg-slate-700/60" />
              <Skeleton className="h-6 w-28 bg-slate-700/60" />
              <Skeleton className="h-6 w-20 bg-slate-700/60" />
              <Skeleton className="h-6 w-24 bg-slate-700/60" />
              <Skeleton className="h-8 w-20 bg-slate-700/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="lg:hidden space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
            <div className="flex justify-between mb-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 rounded-full bg-slate-700/60" />
                <Skeleton className="h-5 w-32 bg-slate-700/60" />
                <Skeleton className="h-4 w-20 bg-slate-700/60" />
              </div>
              <Skeleton className="h-8 w-20 bg-slate-700/60" />
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-700/40">
              <Skeleton className="h-4 w-24 bg-slate-700/60" />
              <Skeleton className="h-8 w-20 bg-slate-700/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
