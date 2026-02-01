/**
 * ContractsTable - Enterprise data table for desktop view
 * RTL-first with proper column ordering
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  Download,
  FileSignature,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomerContract, ContractsSort, SortField } from './types';
import { ContractStatusBadge } from './ContractStatusBadge';

interface ContractsTableProps {
  contracts: CustomerContract[];
  isLoading: boolean;
  sort: ContractsSort;
  onSort: (field: SortField) => void;
  onRowClick: (contract: CustomerContract) => void;
  onSign?: (contract: CustomerContract) => void;
  onDownload?: (contract: CustomerContract) => void;
  selectedContractId?: string;
}

// Table row animation variants
const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export function ContractsTable({
  contracts,
  isLoading,
  sort,
  onSort,
  onRowClick,
  onSign,
  onDownload,
  selectedContractId,
}: ContractsTableProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const SortableHeader = ({ 
    field, 
    children 
  }: { 
    field: SortField; 
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => onSort(field)}
      className={cn(
        'flex items-center gap-1 hover:text-foreground transition-colors',
        sort.field === field ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {children}
      <SortIcon field={field} />
    </button>
  );

  if (isLoading) {
    return <ContractsTableSkeleton />;
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            {/* RTL Column Order: Contract# (far right) - Service - Status - Amount - Created - Actions (far left) */}
            <TableHead className={cn("w-[160px]", isRTL && "text-right")}>
              {isRTL ? 'رقم العقد' : 'Contract #'}
            </TableHead>
            <TableHead className={cn("min-w-[180px]", isRTL && "text-right")}>
              {isRTL ? 'الخدمة' : 'Service'}
            </TableHead>
            <TableHead className={cn("w-[140px]", isRTL && "text-right")}>
              <SortableHeader field="status">
                {isRTL ? 'الحالة' : 'Status'}
              </SortableHeader>
            </TableHead>
            <TableHead className={cn("w-[120px]", isRTL && "text-right")}>
              <SortableHeader field="pricing">
                {isRTL ? 'المبلغ' : 'Amount'}
              </SortableHeader>
            </TableHead>
            <TableHead className={cn("w-[130px]", isRTL && "text-right")}>
              <SortableHeader field="created_at">
                {isRTL ? 'تاريخ الإنشاء' : 'Created'}
              </SortableHeader>
            </TableHead>
            {/* Actions column - Always on far left in RTL */}
            <TableHead className={cn("w-[80px]", isRTL ? "text-left" : "text-right")}>
              {isRTL ? 'إجراءات' : 'Actions'}
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
              onClick={() => onRowClick(contract)}
              className={cn(
                'cursor-pointer transition-colors border-b',
                'hover:bg-muted/50',
                selectedContractId === contract.id && 'bg-primary/5 hover:bg-primary/10'
              )}
            >
              {/* Contract Number - Always LTR (far right in RTL) */}
              <TableCell className={cn(isRTL && "text-right")}>
                <span 
                  dir="ltr" 
                  className="font-mono text-sm text-muted-foreground tabular-nums"
                >
                  {contract.contract_number}
                </span>
              </TableCell>
              
              {/* Service Name */}
              <TableCell className={cn(isRTL && "text-right")}>
                <span className="font-medium truncate block max-w-[200px]">
                  {contract.service
                    ? (isRTL 
                        ? (contract.service.name_ar || contract.service.name)
                        : contract.service.name)
                    : (isRTL ? 'عقد تقديم خدمات' : 'Service Contract')}
                </span>
              </TableCell>
              
              {/* Status */}
              <TableCell className={cn(isRTL && "text-right")}>
                <ContractStatusBadge status={contract.status} size="sm" />
              </TableCell>
              
              {/* Amount - LTR for numbers */}
              <TableCell className={cn(isRTL && "text-right")}>
                <span dir="ltr" className="font-semibold tabular-nums">
                  {formatCurrency(contract.pricing_json?.total || null, contract.pricing_json?.currency || 'SAR')}
                </span>
              </TableCell>
              
              {/* Created Date */}
              <TableCell className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                {formatDate(contract.created_at)}
              </TableCell>
              
              {/* Actions */}
              <TableCell className={cn(isRTL ? "text-left" : "text-right")}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"}>
                    <DropdownMenuItem onClick={() => onRowClick(contract)}>
                      <Eye className="h-4 w-4 me-2" />
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </DropdownMenuItem>
                    {contract.status === 'pending_signature' && onSign && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onSign(contract);
                      }}>
                        <FileSignature className="h-4 w-4 me-2" />
                        {isRTL ? 'توقيع العقد' : 'Sign Contract'}
                      </DropdownMenuItem>
                    )}
                    {contract.status === 'signed' && onDownload && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onDownload(contract);
                      }}>
                        <Download className="h-4 w-4 me-2" />
                        {isRTL ? 'تحميل PDF' : 'Download PDF'}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Skeleton loader for table
function ContractsTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Header skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-16" />
        </div>
        {/* Row skeletons */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 py-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
