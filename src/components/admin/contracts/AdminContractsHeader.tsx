/**
 * AdminContractsHeader - Premium iOS-Style RTL Header
 * تصميم احترافي متوافق مع iOS وRTL صارم
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Search, 
  X, 
  RefreshCw, 
  FileSignature,
  Shield,
  Filter,
  ChevronRight,
} from 'lucide-react';

interface AdminContractsHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenFilters?: () => void;
  hasActiveFilters?: boolean;
  totalContracts?: number;
}

export function AdminContractsHeader({
  searchValue,
  onSearchChange,
  onRefresh,
  isRefreshing,
  onOpenFilters,
  hasActiveFilters,
  totalContracts = 0,
}: AdminContractsHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchExpanded) {
        setIsSearchExpanded(false);
        onSearchChange('');
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchExpanded, onSearchChange]);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-2xl"
      dir="rtl"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-bl from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Decorative Elements - RTL positioned */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6">
        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm sm:hidden"
            >
              <div className="relative w-full">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="بحث برقم العقد أو اسم العميل..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-12 pe-12 ps-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-base"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-white"
                  onClick={() => {
                    setIsSearchExpanded(false);
                    onSearchChange('');
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-4">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-3 sm:gap-4 min-w-0"
          >
            {/* Icon */}
            <div className="shrink-0 p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg shadow-primary/5">
              <FileSignature className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            
            {/* Text */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-0.5 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                  إدارة العقود
                </h1>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-semibold text-primary whitespace-nowrap">
                    مركز التحكم
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm truncate">
                إدارة {totalContracts} عقد • الموافقة والمراجعة
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center gap-2 shrink-0"
          >
            {/* Desktop Search */}
            <div className="hidden sm:block relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="بحث..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-10 w-48 lg:w-64 pe-10 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-sm focus:w-72 transition-all duration-300"
              />
            </div>

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden h-10 w-10 bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl"
              onClick={() => setIsSearchExpanded(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Filter Button */}
            {onOpenFilters && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl relative",
                  hasActiveFilters && "border-secondary text-secondary"
                )}
                onClick={onOpenFilters}
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -left-1 h-2.5 w-2.5 bg-secondary rounded-full"
                  />
                )}
              </Button>
            )}

            {/* Refresh */}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4 transition-transform", isRefreshing && "animate-spin")} />
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Accent - RTL gradient */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-l from-primary via-secondary to-accent" />
    </motion.header>
  );
}
