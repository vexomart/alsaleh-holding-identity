/**
 * OrdersPagination - Premium Animated Pagination
 * RTL-first with smooth transitions
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
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
  const reducedMotion = useReducedMotion();

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  // Swap icons for RTL
  const FirstIcon = isRTL ? ChevronsRight : ChevronsLeft;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const LastIcon = isRTL ? ChevronsLeft : ChevronsRight;

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4",
        "bg-card rounded-2xl border-2 shadow-sm",
        isRTL && "sm:flex-row-reverse"
      )}
    >
      {/* Results info */}
      <motion.div 
        className="text-sm text-muted-foreground order-2 sm:order-1"
        key={`${startItem}-${endItem}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isRTL ? (
          <span className="tabular-nums">
            عرض <span className="font-semibold text-foreground">{startItem}</span> - <span className="font-semibold text-foreground">{endItem}</span> من <span className="font-semibold text-foreground">{totalCount}</span> طلب
          </span>
        ) : (
          <span className="tabular-nums">
            Showing <span className="font-semibold text-foreground">{startItem}</span> - <span className="font-semibold text-foreground">{endItem}</span> of <span className="font-semibold text-foreground">{totalCount}</span> orders
          </span>
        )}
      </motion.div>

      {/* Controls */}
      <div className={cn(
        "flex items-center gap-3 order-1 sm:order-2",
        isRTL && "flex-row-reverse"
      )}>
        {/* Page size selector */}
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
        >
          <SelectTrigger className="w-[110px] h-10 border-2 rounded-xl hover:border-primary/50 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-2">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={size.toString()} className="rounded-lg">
                {size} {isRTL ? 'صفوف' : 'rows'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Page navigation */}
        <div className={cn(
          "flex items-center gap-1 bg-muted/50 p-1 rounded-xl",
          isRTL && "flex-row-reverse"
        )}>
          <motion.div
            variants={reducedMotion ? {} : buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-background"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              <FirstIcon className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div
            variants={reducedMotion ? {} : buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-background"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <PrevIcon className="h-4 w-4" />
            </Button>
          </motion.div>
          
          {/* Page indicator */}
          <div className="flex items-center gap-1.5 px-3 min-w-[80px] justify-center">
            <motion.span 
              key={page}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-sm font-bold text-primary tabular-nums"
            >
              {page}
            </motion.span>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground tabular-nums">{totalPages || 1}</span>
          </div>

          <motion.div
            variants={reducedMotion ? {} : buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-background"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <NextIcon className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div
            variants={reducedMotion ? {} : buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-background"
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
            >
              <LastIcon className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
