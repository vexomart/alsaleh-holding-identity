/**
 * ContractsFilters - Premium filter bar for contracts
 * RTL-first with animations
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Search, X, Filter } from 'lucide-react';
import { ContractFilters, ContractStatus, CONTRACT_STATUS_CONFIG } from './types';

interface ContractsFiltersProps {
  filters: ContractFilters;
  onFilterChange: (filters: Partial<ContractFilters>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
}

export function ContractsFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  totalCount,
}: ContractsFiltersProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Filters Row */}
      <div className={cn(
        "flex flex-col sm:flex-row gap-3",
        isRTL && "sm:flex-row-reverse"
      )}>
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            type="text"
            placeholder={isRTL ? 'بحث برقم العقد...' : 'Search by contract number...'}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className={cn(
              "h-10",
              isRTL ? "pr-10 text-right" : "pl-10"
            )}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ status: value as ContractStatus | 'all' })}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-10">
            <Filter className="h-4 w-4 me-2 text-muted-foreground" />
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
          <SelectTrigger className="w-full sm:w-[160px] h-10">
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
            className="gap-2 h-10"
          >
            <X className="h-4 w-4" />
            {isRTL ? 'مسح الفلاتر' : 'Clear'}
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <Badge variant="secondary" className="font-normal">
          {totalCount} {isRTL ? 'عقد' : 'contracts'}
        </Badge>
        {hasActiveFilters && (
          <span className="text-sm text-muted-foreground">
            {isRTL ? '(نتائج مفلترة)' : '(filtered results)'}
          </span>
        )}
      </div>
    </motion.div>
  );
}
