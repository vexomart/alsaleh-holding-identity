/**
 * Invoices Filters - Search, status, date range
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Search, X, Calendar } from 'lucide-react';
import { InvoiceFilters, InvoiceStatus, INVOICE_STATUS_CONFIG } from './types';

interface InvoicesFiltersProps {
  filters: InvoiceFilters;
  onFilterChange: (filters: Partial<InvoiceFilters>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
}

export function InvoicesFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  totalCount,
}: InvoicesFiltersProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const reducedMotion = useReducedMotion();

  const statusOptions: { value: InvoiceStatus | 'all'; label: string }[] = [
    { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Statuses' },
    ...Object.entries(INVOICE_STATUS_CONFIG).map(([key, config]) => ({
      value: key as InvoiceStatus,
      label: isRTL ? config.labelAr : config.labelEn,
    })),
  ];

  const dateRangeOptions = [
    { value: 'all', label: isRTL ? 'كل الفترات' : 'All Time' },
    { value: '7d', label: isRTL ? 'آخر 7 أيام' : 'Last 7 days' },
    { value: '30d', label: isRTL ? 'آخر 30 يوم' : 'Last 30 days' },
    { value: '90d', label: isRTL ? 'آخر 90 يوم' : 'Last 90 days' },
  ];

  const AnimationWrapper = reducedMotion ? 'div' : motion.div;
  const animation = reducedMotion ? {} : {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.15 },
  };

  return (
    <AnimationWrapper {...animation}>
      <div className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              placeholder={isRTL ? 'البحث برقم الفاتورة أو الطلب...' : 'Search by invoice or order number...'}
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className={cn("h-10", isRTL ? "pr-10" : "pl-10")}
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ status: value as InvoiceStatus | 'all' })}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Select
            value={filters.dateRange}
            onValueChange={(value) => onFilterChange({ dateRange: value as InvoiceFilters['dateRange'] })}
          >
            <SelectTrigger className="w-full sm:w-[160px] h-10">
              <Calendar className="h-4 w-4 me-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">{isRTL ? 'مسح' : 'Clear'}</span>
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground">
            {isRTL 
              ? `عرض ${totalCount} فاتورة`
              : `Showing ${totalCount} invoices`}
          </p>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {isRTL ? 'تصفية نشطة' : 'Filters Active'}
            </Badge>
          )}
        </div>
      </div>
    </AnimationWrapper>
  );
}
