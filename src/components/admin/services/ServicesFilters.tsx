/**
 * ServicesFilters - Modern Unified Design
 * Advanced filtering with search and dropdowns
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  X, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface ServicesFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  visibilityFilter: string;
  onVisibilityChange: (visibility: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  categories: { value: string; label: string; labelEn: string }[];
  onRefresh: () => void;
  isRefreshing: boolean;
  totalFiltered: number;
  totalServices: number;
}

export function ServicesFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  visibilityFilter,
  onVisibilityChange,
  viewMode,
  onViewModeChange,
  categories,
  onRefresh,
  isRefreshing,
  totalFiltered,
  totalServices,
}: ServicesFiltersProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || visibilityFilter !== 'all' || searchQuery !== '';

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onCategoryChange('all');
    onVisibilityChange('all');
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-4 space-y-4">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? "بحث عن خدمة..." : "Search services..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="ps-10 h-11"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute end-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => onSearchChange('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[130px] h-11">
                <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="inactive">{isRTL ? 'متوقف' : 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[140px] h-11">
                <SelectValue placeholder={isRTL ? "التصنيف" : "Category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع التصنيفات' : 'All Categories'}</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {isRTL ? cat.label : cat.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "h-11 gap-2",
                showAdvanced && "border-primary text-primary"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">{isRTL ? 'متقدم' : 'Advanced'}</span>
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted/50 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => onViewModeChange('grid')}
                className="h-9 w-9"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => onViewModeChange('list')}
                className="h-9 w-9"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-11 w-11"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Advanced Filters Row */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-3 p-4 rounded-xl bg-muted/30 border"
          >
            <Select value={visibilityFilter} onValueChange={onVisibilityChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={isRTL ? "الظهور للعملاء" : "Visibility"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="visible">{isRTL ? 'مرئي للعملاء' : 'Visible'}</SelectItem>
                <SelectItem value="hidden">{isRTL ? 'مخفي' : 'Hidden'}</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {/* Active Filters & Results Count */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {hasActiveFilters && (
              <>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    {isRTL ? 'بحث:' : 'Search:'} {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange('')} />
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {isRTL ? 'الحالة:' : 'Status:'} {statusFilter === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'متوقف' : 'Inactive')}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onStatusChange('all')} />
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {isRTL ? 'التصنيف:' : 'Category:'} {categories.find(c => c.value === categoryFilter)?.[isRTL ? 'label' : 'labelEn']}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onCategoryChange('all')} />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                >
                  {isRTL ? 'مسح الكل' : 'Clear all'}
                </Button>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {isRTL ? 'عرض' : 'Showing'}{' '}
            <span className="font-bold text-foreground">{totalFiltered}</span>
            {' '}{isRTL ? 'من' : 'of'}{' '}
            <span className="font-bold text-foreground">{totalServices}</span>
            {' '}{isRTL ? 'خدمة' : 'services'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
