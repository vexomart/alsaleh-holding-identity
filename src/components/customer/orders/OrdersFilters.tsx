/**
 * OrdersFilters - Premium filter bar for Orders Center
 * RTL-first design with animations
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  Calendar, 
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { OrderFilters, ORDER_STATUS_CONFIG, OrderStatus } from './types';

interface OrdersFiltersProps {
  filters: OrderFilters;
  onFilterChange: (filters: Partial<OrderFilters>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
}

const DATE_RANGE_OPTIONS = [
  { value: 'all', labelAr: 'كل الفترات', labelEn: 'All Time' },
  { value: '7d', labelAr: 'آخر 7 أيام', labelEn: 'Last 7 days' },
  { value: '30d', labelAr: 'آخر 30 يوم', labelEn: 'Last 30 days' },
  { value: '90d', labelAr: 'آخر 90 يوم', labelEn: 'Last 90 days' },
];

export function OrdersFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  totalCount,
}: OrdersFiltersProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-xl border shadow-sm p-4"
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{isRTL ? 'فلترة وبحث' : 'Filter & Search'}</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {isRTL ? `${totalCount} طلب` : `${totalCount} orders`}
          </span>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs gap-1 h-7"
          >
            <X className="h-3 w-3" />
            {isRTL ? 'مسح الفلاتر' : 'Clear'}
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            placeholder={isRTL ? 'البحث برقم الطلب أو الاسم...' : 'Search by order # or name...'}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className={cn(
              "h-10 bg-muted/50",
              isRTL ? "pr-10 text-right" : "pl-10"
            )}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ status: value as OrderStatus | 'all' })}
        >
          <SelectTrigger className="h-10 bg-muted/50">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isRTL ? 'جميع الحالات' : 'All Status'}
            </SelectItem>
            {(Object.entries(ORDER_STATUS_CONFIG) as [OrderStatus, typeof ORDER_STATUS_CONFIG[OrderStatus]][]).map(
              ([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full', config.bgColor)} />
                    {isRTL ? config.labelAr : config.labelEn}
                  </div>
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Select
          value={filters.dateRange}
          onValueChange={(value) => onFilterChange({ dateRange: value as OrderFilters['dateRange'] })}
        >
          <SelectTrigger className="h-10 bg-muted/50">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={isRTL ? 'الفترة' : 'Date Range'} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {isRTL ? option.labelAr : option.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 lg:col-span-1">
            {filters.status !== 'all' && (
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                ORDER_STATUS_CONFIG[filters.status as OrderStatus]?.bgColor,
                ORDER_STATUS_CONFIG[filters.status as OrderStatus]?.color
              )}>
                {isRTL 
                  ? ORDER_STATUS_CONFIG[filters.status as OrderStatus]?.labelAr 
                  : ORDER_STATUS_CONFIG[filters.status as OrderStatus]?.labelEn}
                <button
                  onClick={() => onFilterChange({ status: 'all' })}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
