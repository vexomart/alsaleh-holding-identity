/**
 * OrdersPagination - Pagination controls for orders table
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

interface OrdersPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function OrdersPagination({
  page,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: OrdersPaginationProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  // Swap icons for RTL
  const FirstIcon = isRTL ? ChevronsRight : ChevronsLeft;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const LastIcon = isRTL ? ChevronsLeft : ChevronsRight;

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-between gap-4 py-4",
      isRTL && "sm:flex-row-reverse"
    )}>
      {/* Results info */}
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        {isRTL ? (
          <span>عرض {startItem} - {endItem} من {totalCount} طلب</span>
        ) : (
          <span>Showing {startItem} - {endItem} of {totalCount} orders</span>
        )}
      </div>

      {/* Controls */}
      <div className={cn(
        "flex items-center gap-2 order-1 sm:order-2",
        isRTL && "flex-row-reverse"
      )}>
        {/* Page size selector */}
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
        >
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} {isRTL ? 'صفوف' : 'rows'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Page navigation */}
        <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <FirstIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <PrevIcon className="h-4 w-4" />
          </Button>
          
          {/* Page indicator */}
          <div className="flex items-center gap-1 px-2">
            <span className="text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{totalPages || 1}</span>
          </div>

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
