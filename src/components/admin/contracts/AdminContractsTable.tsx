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
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-muted',
    icon: FileText,
  },
  pre_approved_by_customer: {
    labelAr: 'بانتظار الموافقة',
    labelEn: 'Pending Approval',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: AlertTriangle,
  },
  pending_admin_approval: {
    labelAr: 'بانتظار الإدارة',
    labelEn: 'Pending Admin',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: AlertTriangle,
  },
  pending_signature: {
    labelAr: 'بانتظار التوقيع',
    labelEn: 'Awaiting Signature',
    color: 'text-indigo-700 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    icon: FileSignature,
  },
  signed: {
    labelAr: 'موقّع',
    labelEn: 'Signed',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle,
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
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
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor
      )}>
        <Icon className="h-3 w-3" />
        <span className="hidden sm:inline">
          {isRTL ? config.labelAr : config.labelEn}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return <AdminContractsTableSkeleton />;
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border bg-card">
        <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-lg">
          {isRTL ? 'لا توجد عقود' : 'No contracts found'}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isRTL ? 'لم يتم العثور على أي عقود مطابقة' : 'No matching contracts found'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className={cn("w-[120px]", isRTL && "text-right")}>
                {isRTL ? 'الحالة' : 'Status'}
              </TableHead>
              <TableHead className={cn("min-w-[160px]", isRTL && "text-right")}>
                {isRTL ? 'رقم العقد' : 'Contract #'}
              </TableHead>
              <TableHead className={cn("min-w-[180px]", isRTL && "text-right")}>
                <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                  <User className="h-4 w-4 text-muted-foreground" />
                  {isRTL ? 'العميل' : 'Customer'}
                </div>
              </TableHead>
              <TableHead className={cn("min-w-[140px]", isRTL && "text-right")}>
                {isRTL ? 'الخدمة' : 'Service'}
              </TableHead>
              <TableHead className={cn("w-[120px]", isRTL && "text-right")}>
                <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {isRTL ? 'القيمة' : 'Value'}
                </div>
              </TableHead>
              <TableHead className={cn("w-[130px]", isRTL && "text-right")}>
                <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {isRTL ? 'التاريخ' : 'Date'}
                </div>
              </TableHead>
              <TableHead className="w-[140px] text-center">
                {isRTL ? 'الإجراءات' : 'Actions'}
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
                  'group hover:bg-muted/30 cursor-pointer transition-colors',
                  contract.status === 'pre_approved_by_customer' && 'bg-amber-50/50 dark:bg-amber-950/10'
                )}
                onClick={() => onViewDetails(contract)}
              >
                {/* Status */}
                <TableCell className={cn(isRTL && "text-right")}>
                  {getStatusBadge(contract.status)}
                </TableCell>

                {/* Contract Number */}
                <TableCell className={cn(isRTL && "text-right")}>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                      {contract.contract_number}
                    </code>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCopyNumber(contract.contract_number);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isRTL ? 'نسخ' : 'Copy'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>

                {/* Customer */}
                <TableCell className={cn(isRTL && "text-right")}>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {isRTL 
                        ? contract.customer?.full_name_ar || contract.customer?.full_name || '-'
                        : contract.customer?.full_name || '-'
                      }
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                      {contract.customer?.email}
                    </span>
                    {contract.customer?.customer_uid && (
                      <Badge variant="outline" className="text-[10px] w-fit mt-1">
                        {contract.customer.customer_uid}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Service */}
                <TableCell className={cn(isRTL && "text-right")}>
                  <span className="text-sm truncate block max-w-[140px]">
                    {isRTL 
                      ? contract.service?.name_ar || contract.service?.name || '-'
                      : contract.service?.name || '-'
                    }
                  </span>
                </TableCell>

                {/* Value */}
                <TableCell className={cn(isRTL && "text-right")}>
                  {contract.pricing_json ? (
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {isRTL ? 'شامل الضريبة' : 'incl. VAT'}
                      </span>
                    </div>
                  ) : '-'}
                </TableCell>

                {/* Date */}
                <TableCell className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                  {formatDate(contract.created_at)}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {/* View */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onViewDetails(contract)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isRTL ? 'عرض' : 'View'}
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
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                onClick={() => onApprove(contract)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isRTL ? 'موافقة' : 'Approve'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                onClick={() => onReject(contract)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isRTL ? 'رفض' : 'Reject'}
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
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex gap-4 pb-2 border-b">
          {[100, 140, 180, 140, 100, 120, 120].map((w, i) => (
            <Skeleton key={i} className="h-8" style={{ width: w }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4 py-3 items-center">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
