/**
 * OrdersFilters - Dark Theme Filters Component
 * Search, status filter, and view mode toggle
 */

import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  Calendar,
  RefreshCw,
  Download,
  Plus,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'table';

interface OrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  refreshing: boolean;
  isRTL: boolean;
}

const statusOptions = [
  { value: 'all', labelAr: 'جميع الحالات', labelEn: 'All Status' },
  { value: 'pending', labelAr: 'قيد الانتظار', labelEn: 'Pending' },
  { value: 'processing', labelAr: 'قيد المعالجة', labelEn: 'Processing' },
  { value: 'in_progress', labelAr: 'قيد التنفيذ', labelEn: 'In Progress' },
  { value: 'completed', labelAr: 'مكتمل', labelEn: 'Completed' },
  { value: 'cancelled', labelAr: 'ملغي', labelEn: 'Cancelled' },
  { value: 'refunded', labelAr: 'مسترد', labelEn: 'Refunded' },
];

export function OrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  refreshing,
  isRTL,
}: OrdersFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row gap-4 p-4 rounded-xl bg-[#0f1629] border border-slate-800"
    >
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder={isRTL ? 'البحث برقم الطلب، العميل، أو العنوان...' : 'Search by order #, customer, or title...'}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "ps-10 h-11 bg-slate-900/50 border-slate-700",
            "placeholder:text-slate-500 text-white",
            "focus:border-blue-500 focus:ring-blue-500/20"
          )}
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[160px] h-11 bg-slate-900/50 border-slate-700 text-white">
            <Filter className="h-4 w-4 me-2 text-slate-400" />
            <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
          </SelectTrigger>
          <SelectContent className="bg-[#0f1629] border-slate-700">
            {statusOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-slate-200 focus:bg-slate-800 focus:text-white"
              >
                {isRTL ? option.labelAr : option.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Button
          variant="outline"
          className="h-11 bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">{isRTL ? 'التاريخ' : 'Date'}</span>
        </Button>

        {/* Divider */}
        <div className="hidden lg:block h-6 w-px bg-slate-700" />

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-md",
              viewMode === 'grid' 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-md",
              viewMode === 'table' 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
            onClick={() => onViewModeChange('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
        </Button>

        <Button
          variant="outline"
          className="h-11 bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{isRTL ? 'تصدير' : 'Export'}</span>
        </Button>

        <Button
          className="h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white gap-2 shadow-lg shadow-blue-500/25"
        >
          <Plus className="h-4 w-4" />
          <span>{isRTL ? 'طلب جديد' : 'New Order'}</span>
        </Button>
      </div>
    </motion.div>
  );
}
