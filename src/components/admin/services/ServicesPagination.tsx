/**
 * ServicesPagination - Dark Theme Pagination Component
 * Premium pagination with page info
 */

import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ServicesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function ServicesPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: ServicesPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Pages to show on each side of current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 rounded-xl bg-[#0f1629] border border-slate-800"
    >
      {/* Page Info */}
      <div className="text-sm text-slate-400 order-2 sm:order-1">
        عرض{' '}
        <span className="font-bold text-white">{startItem}</span>
        {' '}-{' '}
        <span className="font-bold text-white">{endItem}</span>
        {' '}من{' '}
        <span className="font-bold text-white">{totalItems}</span>
        {' '}خدمة
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* First Page */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                onClick={() => onPageChange(page)}
                className={cn(
                  "h-9 w-9 text-sm font-medium",
                  currentPage === page
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-2 text-slate-500">
                {page}
              </span>
            )
          ))}
        </div>

        {/* Next Page */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
