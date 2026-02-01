/**
 * ContractsFilters - Enhanced filter bar for contracts
 * RTL-first with animations and mobile sheet
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { X, Filter, Calendar, FileCheck } from 'lucide-react';
import { ContractFilters, ContractStatus, CONTRACT_STATUS_CONFIG } from './types';

interface ContractsFiltersProps {
  filters: ContractFilters;
  onFilterChange: (filters: Partial<ContractFilters>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContractsFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  totalCount,
  isOpen,
  onOpenChange,
}: ContractsFiltersProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();

  const statusOptions: { value: ContractStatus | 'all'; labelAr: string; labelEn: string }[] = [
    { value: 'all', labelAr: 'جميع الحالات', labelEn: 'All Statuses' },
    ...Object.entries(CONTRACT_STATUS_CONFIG).map(([key, config]) => ({
      value: key as ContractStatus,
      labelAr: config.labelAr,
      labelEn: config.labelEn,
    })),
  ];

  const dateOptions = [
    { value: 'all', labelAr: 'جميع الفترات', labelEn: 'All Time' },
    { value: '7d', labelAr: 'آخر 7 أيام', labelEn: 'Last 7 Days' },
    { value: '30d', labelAr: 'آخر 30 يوم', labelEn: 'Last 30 Days' },
    { value: '90d', labelAr: 'آخر 90 يوم', labelEn: 'Last 90 Days' },
  ];

  const activeFiltersCount = [
    filters.status !== 'all',
    filters.dateRange !== 'all',
    !!filters.serviceId,
  ].filter(Boolean).length;

  const FiltersContent = () => (
    <div className={cn("space-y-4", isMobile && "pt-4")}>
      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-muted-foreground" />
          {isRTL ? 'الحالة' : 'Status'}
        </label>
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ status: value as ContractStatus | 'all' })}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder={isRTL ? 'اختر الحالة' : 'Select status'} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {isRTL ? option.labelAr : option.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {isRTL ? 'الفترة الزمنية' : 'Date Range'}
        </label>
        <Select
          value={filters.dateRange}
          onValueChange={(value) => onFilterChange({ dateRange: value as ContractFilters['dateRange'] })}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder={isRTL ? 'اختر الفترة' : 'Select period'} />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {isRTL ? option.labelAr : option.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full gap-2 mt-4"
          onClick={() => {
            onClearFilters();
            onOpenChange?.(false);
          }}
        >
          <X className="h-4 w-4" />
          {isRTL ? 'مسح جميع الفلاتر' : 'Clear All Filters'}
        </Button>
      )}
    </div>
  );

  // Mobile: Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side={isRTL ? 'right' : 'left'} className="w-80">
          <SheetHeader>
            <SheetTitle className={isRTL ? 'text-right' : 'text-left'}>
              {isRTL ? 'تصفية العقود' : 'Filter Contracts'}
            </SheetTitle>
          </SheetHeader>
          <FiltersContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Inline filters
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Filters Row */}
      <div className={cn(
        "flex flex-wrap items-center gap-3 p-4 rounded-xl border bg-card/50",
        isRTL && "flex-row-reverse"
      )}>
        <div className={cn("flex items-center gap-2 text-sm font-medium", isRTL && "flex-row-reverse")}>
          <Filter className="h-4 w-4 text-muted-foreground" />
          {isRTL ? 'تصفية:' : 'Filters:'}
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ status: value as ContractStatus | 'all' })}
        >
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {isRTL ? option.labelAr : option.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Select
          value={filters.dateRange}
          onValueChange={(value) => onFilterChange({ dateRange: value as ContractFilters['dateRange'] })}
        >
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder={isRTL ? 'الفترة' : 'Period'} />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {isRTL ? option.labelAr : option.labelEn}
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
            className="gap-2 h-9 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
            {isRTL ? 'مسح' : 'Clear'}
          </Button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Results Count */}
        <Badge variant="secondary" className="font-normal">
          {totalCount} {isRTL ? 'عقد' : 'contracts'}
        </Badge>
      </div>
    </motion.div>
  );
}
