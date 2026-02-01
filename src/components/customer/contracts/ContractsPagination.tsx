/**
 * ContractsPagination - Pagination controls
 * RTL-first
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

interface ContractsPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ContractsPagination({
  page,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: ContractsPaginationProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const FirstIcon = isRTL ? ChevronsRight : ChevronsLeft;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const LastIcon = isRTL ? ChevronsLeft : ChevronsRight;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-between gap-4 py-4",
      isRTL && "sm:flex-row-reverse"
    )}>
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        {isRTL 
          ? `عرض ${startItem} - ${endItem} من ${totalCount}`
          : `Showing ${startItem} - ${endItem} of ${totalCount}`}
      </div>

      {/* Controls */}
      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        {/* Page size selector */}
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>

        {/* Navigation buttons */}
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
          <span className="px-3 text-sm text-muted-foreground">
            {isRTL 
              ? `${page} من ${totalPages}`
              : `${page} of ${totalPages}`}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            <NextIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
          >
            <LastIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
