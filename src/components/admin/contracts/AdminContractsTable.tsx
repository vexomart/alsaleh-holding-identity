/**
 * AdminContractsTable - Enterprise Data Table for Admin Contracts
 * Bloomberg-style with advanced features
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DollarSign,
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

// Status configuration
const statusConfig: Record<ContractStatus, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    color: 'text-slate-300',
    bgColor: 'bg-slate-700/50',
    borderColor: 'border-slate-600',
    icon: FileText,
  },
  pre_approved_by_customer: {
    labelAr: 'بانتظار الموافقة',
    labelEn: 'Pending Approval',
    color: 'text-amber-300',
    bgColor: 'bg-amber-900/40',
    borderColor: 'border-amber-700',
    icon: AlertTriangle,
  },
  pending_admin_approval: {
    labelAr: 'بانتظار الإدارة',
    labelEn: 'Pending Admin',
    color: 'text-amber-300',
    bgColor: 'bg-amber-900/40',
    borderColor: 'border-amber-700',
    icon: AlertTriangle,
  },
  pending_signature: {
    labelAr: 'بانتظار التوقيع',
    labelEn: 'Awaiting Signature',
    color: 'text-indigo-300',
    bgColor: 'bg-indigo-900/40',
    borderColor: 'border-indigo-700',
    icon: FileSignature,
  },
  signed: {
    labelAr: 'موقّع',
    labelEn: 'Signed',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-900/40',
    borderColor: 'border-emerald-700',
    icon: CheckCircle,
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-red-300',
    bgColor: 'bg-red-900/40',
    borderColor: 'border-red-700',
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
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.02,
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
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
  const { isRTL } = useLanguage();

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
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
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border flex-row-reverse",
        config.bgColor,
        config.color,
        config.borderColor
      )}>
        <Icon className="h-3 w-3" />
        <span className="hidden sm:inline">
          {config.labelAr}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return <AdminContractsTableSkeleton />;
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-700 bg-slate-800/50">
        <FileText className="h-16 w-16 text-slate-500 mb-4" />
        <h3 className="font-semibold text-lg text-white">
          لا توجد عقود
        </h3>
        <p className="text-slate-400 text-sm">
          لم يتم العثور على أي عقود مطابقة
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl" dir="rtl">
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader className="bg-slate-800/80 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-slate-700">
              <TableHead className="w-[120px] text-right text-slate-300">
                الحالة
              </TableHead>
              <TableHead className="min-w-[160px] text-right text-slate-300">
                رقم العقد
              </TableHead>
              <TableHead className="min-w-[180px] text-right text-slate-300">
                <div className="flex items-center gap-1.5 flex-row-reverse">
                  <User className="h-4 w-4 text-slate-400" />
                  العميل
                </div>
              </TableHead>
              <TableHead className="min-w-[140px] text-right text-slate-300">
                الخدمة
              </TableHead>
              <TableHead className="w-[120px] text-right text-slate-300">
                <div className="flex items-center gap-1.5 flex-row-reverse">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  القيمة
                </div>
              </TableHead>
              <TableHead className="w-[130px] text-right text-slate-300">
                <div className="flex items-center gap-1.5 flex-row-reverse">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  التاريخ
                </div>
              </TableHead>
              <TableHead className="w-[140px] text-center text-slate-300">
                الإجراءات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract, index) => (
              <motion.tr
                key={contract.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className={cn(
                  'group hover:bg-slate-800/50 cursor-pointer transition-colors border-slate-700/50',
                  contract.status === 'pre_approved_by_customer' && 'bg-amber-950/20'
                )}
                onClick={() => onViewDetails(contract)}
              >
                {/* Status */}
                <TableCell className="text-right">
                  {getStatusBadge(contract.status)}
                </TableCell>

                {/* Contract Number */}
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <code className="px-2 py-1 bg-slate-700 rounded text-xs font-mono text-slate-200">
                      {contract.contract_number}
                    </code>
                    <TooltipProvider>
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
                        <TooltipContent>
                          نسخ
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>

                {/* Customer */}
                <TableCell className="text-right">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-white">
                      {contract.customer?.full_name_ar || contract.customer?.full_name || '-'}
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-[160px]">
                      {contract.customer?.email}
                    </span>
                    {contract.customer?.customer_uid && (
                      <Badge variant="outline" className="text-[10px] w-fit mt-1 border-slate-600 text-slate-300">
                        {contract.customer.customer_uid}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Service */}
                <TableCell className="text-right">
                  <span className="text-sm truncate block max-w-[140px] text-slate-200">
                    {contract.service?.name_ar || contract.service?.name || '-'}
                  </span>
                </TableCell>

                {/* Value */}
                <TableCell className="text-right">
                  {contract.pricing_json ? (
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-white">
                        {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        شامل الضريبة
                      </span>
                    </div>
                  ) : '-'}
                </TableCell>

                {/* Date */}
                <TableCell className="text-sm text-slate-400 text-right">
                  {formatDate(contract.created_at)}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center justify-center gap-1 flex-row-reverse" onClick={(e) => e.stopPropagation()}>
                    {/* View */}
                    <TooltipProvider>
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
                        <TooltipContent>
                          عرض
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Approve & Reject (only for pre_approved) */}
                    {contract.status === 'pre_approved_by_customer' && (
                      <>
                        <TooltipProvider>
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
                            <TooltipContent>
                              موافقة
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
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
                            <TooltipContent>
                              رفض
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

function AdminContractsTableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden" dir="rtl">
      <div className="p-4 space-y-4">
        <div className="flex gap-4 pb-2 border-b border-slate-700 flex-row-reverse">
          {[100, 140, 180, 140, 100, 120, 120].map((w, i) => (
            <Skeleton key={i} className="h-8 bg-slate-700" style={{ width: w }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4 py-3 items-center flex-row-reverse">
            <Skeleton className="h-6 w-24 rounded-full bg-slate-700" />
            <Skeleton className="h-6 w-32 bg-slate-700" />
            <Skeleton className="h-12 flex-1 bg-slate-700" />
            <Skeleton className="h-6 w-28 bg-slate-700" />
            <Skeleton className="h-6 w-24 bg-slate-700" />
            <Skeleton className="h-6 w-28 bg-slate-700" />
            <Skeleton className="h-8 w-24 bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
