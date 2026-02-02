/**
 * OrdersFilters - Premium Animated Filter Bar
 * RTL-first with smooth animations
 */

import { motion, AnimatePresence } from 'framer-motion';
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
import { cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  Calendar, 
  X,
  SlidersHorizontal,
  Sparkles,
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
  const reducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' as const },
    },
  };

  const filterPillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 500, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.15 }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl border-2 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-4 sm:p-5">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <motion.div 
              className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"
              whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
            </motion.div>
            <div>
              <span className="text-sm font-medium">
                {isRTL ? 'فلترة وبحث' : 'Filter & Search'}
              </span>
              <motion.span 
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ms-2 tabular-nums font-medium"
                key={totalCount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {isRTL ? `${totalCount} طلب` : `${totalCount} orders`}
              </motion.span>
            </div>
          </div>
          
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                variants={filterPillVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-xs gap-1.5 h-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  {isRTL ? 'مسح الفلاتر' : 'Clear All'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <motion.div 
            className="relative sm:col-span-2 lg:col-span-1"
            whileFocus={{ scale: 1.02 }}
          >
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              placeholder={isRTL ? 'البحث برقم الطلب أو الاسم...' : 'Search by order # or name...'}
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className={cn(
                "h-11 bg-background/50 border-2 rounded-xl transition-all duration-200",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                isRTL ? "pr-10 text-right" : "pl-10"
              )}
            />
          </motion.div>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ status: value as OrderStatus | 'all' })}
          >
            <SelectTrigger className="h-11 bg-background/50 border-2 rounded-xl hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2">
              <SelectItem value="all" className="rounded-lg">
                {isRTL ? 'جميع الحالات' : 'All Status'}
              </SelectItem>
              {(Object.entries(ORDER_STATUS_CONFIG) as [OrderStatus, typeof ORDER_STATUS_CONFIG[OrderStatus]][]).map(
                ([key, config]) => (
                  <SelectItem key={key} value={key} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2.5 h-2.5 rounded-full', config.bgColor)} />
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
            <SelectTrigger className="h-11 bg-background/50 border-2 rounded-xl hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={isRTL ? 'الفترة' : 'Date Range'} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2">
              {DATE_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-lg">
                  {isRTL ? option.labelAr : option.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Active Filters Display */}
          <div className="flex items-center gap-2 flex-wrap lg:col-span-1">
            <AnimatePresence mode="popLayout">
              {filters.status !== 'all' && (
                <motion.span 
                  key="status-filter"
                  variants={filterPillVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                    ORDER_STATUS_CONFIG[filters.status as OrderStatus]?.bgColor,
                    ORDER_STATUS_CONFIG[filters.status as OrderStatus]?.color
                  )}
                >
                  {isRTL 
                    ? ORDER_STATUS_CONFIG[filters.status as OrderStatus]?.labelAr 
                    : ORDER_STATUS_CONFIG[filters.status as OrderStatus]?.labelEn}
                  <button
                    onClick={() => onFilterChange({ status: 'all' })}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              )}
              {filters.dateRange !== 'all' && (
                <motion.span 
                  key="date-filter"
                  variants={filterPillVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {isRTL 
                    ? DATE_RANGE_OPTIONS.find(o => o.value === filters.dateRange)?.labelAr
                    : DATE_RANGE_OPTIONS.find(o => o.value === filters.dateRange)?.labelEn}
                  <button
                    onClick={() => onFilterChange({ dateRange: 'all' })}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
