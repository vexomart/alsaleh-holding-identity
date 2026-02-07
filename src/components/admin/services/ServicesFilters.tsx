/**
 * ServicesFilters - Dark Theme Filters Component
 * Advanced filtering with search and dropdowns
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || visibilityFilter !== 'all' || searchQuery !== '';

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onCategoryChange('all');
    onVisibilityChange('all');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="بحث عن خدمة..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pr-10 h-11",
              "bg-[#0f1629] border-slate-700 text-white placeholder:text-slate-500",
              "focus:border-blue-500 focus:ring-blue-500/20"
            )}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-white"
              onClick={() => onSearchChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[130px] h-11 bg-[#0f1629] border-slate-700 text-white">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1629] border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-800">جميع الحالات</SelectItem>
              <SelectItem value="active" className="text-white hover:bg-slate-800">نشط</SelectItem>
              <SelectItem value="inactive" className="text-white hover:bg-slate-800">متوقف</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px] h-11 bg-[#0f1629] border-slate-700 text-white">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1629] border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-800">جميع التصنيفات</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-800">
                  {cat.label}
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
              "bg-[#0f1629] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white",
              showAdvanced && "border-blue-500 text-blue-400"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">متقدم</span>
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#0f1629] border border-slate-700 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "h-9 w-9",
                viewMode === 'grid' 
                  ? "bg-slate-700 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('list')}
              className={cn(
                "h-9 w-9",
                viewMode === 'list' 
                  ? "bg-slate-700 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
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
            className="h-11 w-11 bg-[#0f1629] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
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
          className="flex flex-wrap gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700"
        >
          <Select value={visibilityFilter} onValueChange={onVisibilityChange}>
            <SelectTrigger className="w-[160px] bg-[#0f1629] border-slate-700 text-white">
              <SelectValue placeholder="الظهور للعملاء" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1629] border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-800">الكل</SelectItem>
              <SelectItem value="visible" className="text-white hover:bg-slate-800">مرئي للعملاء</SelectItem>
              <SelectItem value="hidden" className="text-white hover:bg-slate-800">مخفي</SelectItem>
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
                <Badge variant="secondary" className="gap-1 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  بحث: {searchQuery}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange('')} />
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  الحالة: {statusFilter === 'active' ? 'نشط' : 'متوقف'}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onStatusChange('all')} />
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  التصنيف: {categories.find(c => c.value === categoryFilter)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onCategoryChange('all')} />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                مسح الكل
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-slate-400">
          عرض{' '}
          <span className="font-bold text-white">{totalFiltered}</span>
          {' '}من{' '}
          <span className="font-bold text-white">{totalServices}</span>
          {' '}خدمة
        </p>
      </div>
    </motion.div>
  );
}
