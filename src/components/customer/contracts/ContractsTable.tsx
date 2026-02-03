/**
 * ContractsTable - Enterprise data table for desktop view
 * RTL-first - navigates to internal details page
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
import { BidiNumber } from '@/components/ui/bidi-number';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  ChevronUp, 
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
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
  onViewOrder?: (orderId: string) => void;
  selectedContractId?: string;
}

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
  onViewOrder,
  selectedContractId,
}: ContractsTableProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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

  const handleNavigateToDetails = (contract: CustomerContract) => {
    navigate(`/app/contracts/${contract.id}`);
  };

  if (isLoading) {
    return <ContractsTableSkeleton />;
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className={cn("w-[140px]", isRTL && "text-right")}>
                <SortableHeader field="status">
                  {isRTL ? 'الحالة' : 'Status'}
                </SortableHeader>
              </TableHead>
              <TableHead className={cn("min-w-[180px]", isRTL && "text-right")}>
                {isRTL ? 'اسم العقد / الخدمة' : 'Contract / Service'}
              </TableHead>
              <TableHead className={cn("w-[160px]", isRTL && "text-right")}>
                {isRTL ? 'رقم العقد' : 'Contract #'}
              </TableHead>
              <TableHead className={cn("w-[140px]", isRTL && "text-right")}>
                {isRTL ? 'مرتبط بالطلب' : 'Order Ref'}
              </TableHead>
              <TableHead className={cn("w-[120px]", isRTL && "text-right")}>
                <SortableHeader field="created_at">
                  {isRTL ? 'تاريخ الإنشاء' : 'Created'}
                </SortableHeader>
              </TableHead>
              <TableHead className={cn("w-[120px]", isRTL && "text-right")}>
                <SortableHeader field="updated_at">
                  {isRTL ? 'آخر تحديث' : 'Updated'}
                </SortableHeader>
              </TableHead>
              <TableHead className={cn("w-[100px]", isRTL ? "text-left" : "text-right")}>
                {isRTL ? '' : ''}
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
                onClick={() => handleNavigateToDetails(contract)}
                className={cn(
                  'cursor-pointer transition-colors border-b',
                  'hover:bg-teal-50/50 dark:hover:bg-teal-900/10',
                  selectedContractId === contract.id && 'bg-teal-50 dark:bg-teal-900/20'
                )}
              >
                {/* Status */}
                <TableCell className={cn(isRTL && "text-right")}>
                  <ContractStatusBadge status={contract.status} size="sm" />
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
                
                {/* Contract Number */}
                <TableCell className={cn(isRTL && "text-right")}>
                  <BidiNumber 
                    value={contract.contract_number}
                    variant="code"
                    className="text-muted-foreground"
                  />
                </TableCell>
                
                {/* Order Reference */}
                <TableCell className={cn(isRTL && "text-right")}>
                  {contract.order ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewOrder?.(contract.order!.id);
                          }}
                          className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          <BidiNumber 
                            value={contract.order.order_number}
                            className="text-sm"
                          />
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isRTL ? contract.order.title_ar || contract.order.title : contract.order.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                
                {/* Created Date */}
                <TableCell className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                  {formatDate(contract.created_at)}
                </TableCell>
                
                {/* Updated Date */}
                <TableCell className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                  {formatDate(contract.updated_at)}
                </TableCell>
                
                {/* View Details Arrow */}
                <TableCell className={cn(isRTL ? "text-left" : "text-right")}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700"
                  >
                    {isRTL ? 'عرض' : 'View'}
                    <ArrowIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ContractsTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex gap-4 pb-2 border-b">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 py-3 items-center">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
