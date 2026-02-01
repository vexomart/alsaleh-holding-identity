/**
 * Invoices Pagination - RTL-aware pagination controls
 */

import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface InvoicesPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function InvoicesPagination({
  page,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: InvoicesPaginationProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const pageSizeOptions = [10, 20, 50];

  // Flip chevron directions for RTL
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const FirstIcon = isRTL ? ChevronsRight : ChevronsLeft;
  const LastIcon = isRTL ? ChevronsLeft : ChevronsRight;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4",
      isRTL && "sm:flex-row-reverse"
    )}>
      {/* Info */}
      <p className="text-sm text-muted-foreground">
        {isRTL 
          ? `عرض ${startItem} - ${endItem} من ${totalCount} فاتورة`
          : `Showing ${startItem} - ${endItem} of ${totalCount} invoices`}
      </p>

      {/* Controls */}
      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        {/* Page Size */}
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {isRTL ? `${size} صفوف` : `${size} rows`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pagination Buttons */}
        <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
          >
            <FirstIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <PrevIcon className="h-4 w-4" />
          </Button>
          
          <span className="text-sm px-3 min-w-[80px] text-center">
            {page} / {totalPages || 1}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <NextIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            <LastIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
