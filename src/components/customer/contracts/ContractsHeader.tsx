/**
 * ContractsHeader - Premium enterprise header
 * تصميم احترافي مشابه لقسم النظرة العامة
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Search, 
  X, 
  RefreshCw, 
  ShoppingBag, 
  LayoutGrid, 
  Table as TableIcon,
  Filter,
  FileSignature,
  Sparkles,
} from 'lucide-react';

interface ContractsHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onOpenFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function ContractsHeader({
  searchValue,
  onSearchChange,
  onRefresh,
  isRefreshing,
  viewMode,
  onViewModeChange,
  onOpenFilters,
  hasActiveFilters,
}: ContractsHeaderProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        onSearchChange('');
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen, onSearchChange]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-700" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-300/10 rounded-full blur-xl" />
      </div>
      
      {/* Content */}
      <div className={cn(
        "relative z-10 p-6",
        isRTL && "text-right"
      )}>
        <div className={cn(
          "flex items-start justify-between gap-4",
          isRTL && "flex-row-reverse"
        )}>
          {/* Title & Badge */}
          <AnimatePresence mode="wait">
            {isSearchOpen && isMobile ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <div className="relative">
                  <Search className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none",
                    isRTL ? "right-4" : "left-4"
                  )} />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder={isRTL ? 'بحث برقم العقد...' : 'Search by contract number...'}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={cn(
                      "h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60",
                      isRTL ? "pr-12 text-right" : "pl-12"
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-white/20",
                      isRTL ? "left-2" : "right-2"
                    )}
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="title"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}
              >
                {/* Icon */}
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                  <FileSignature className="h-7 w-7 text-white" />
                </div>
                
                {/* Text */}
                <div>
                  <div className={cn("flex items-center gap-2 mb-1", isRTL && "flex-row-reverse")}>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      {isRTL ? 'عقودي' : 'My Contracts'}
                    </h1>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/90 text-amber-950">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-xs font-semibold">
                        {isRTL ? 'محمي' : 'Secure'}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">
                    {isRTL 
                      ? 'عرض وإدارة جميع عقودك بأمان'
                      : 'View and manage all your contracts securely'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn("flex items-center gap-2 shrink-0", isRTL && "flex-row-reverse")}
          >
            {/* Desktop Search */}
            {!isMobile && (
              <div className="relative w-64">
                <Search className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none",
                  isRTL ? "right-3" : "left-3"
                )} />
                <Input
                  type="text"
                  placeholder={isRTL ? 'بحث برقم العقد...' : 'Search contract...'}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={cn(
                    "h-10 bg-white/15 backdrop-blur-sm border-white/25 text-white placeholder:text-white/50",
                    "focus:bg-white/25 focus:border-white/40",
                    isRTL ? "pr-10 text-right" : "pl-10"
                  )}
                />
              </div>
            )}

            {/* Mobile Search Toggle */}
            {isMobile && !isSearchOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 bg-white/15 hover:bg-white/25 text-white border border-white/20"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            {/* Mobile Filter Button */}
            {isMobile && onOpenFilters && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 bg-white/15 hover:bg-white/25 text-white border border-white/20",
                  hasActiveFilters && "border-amber-400"
                )}
                onClick={onOpenFilters}
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full" />
                )}
              </Button>
            )}

            {/* View Toggle (Desktop) */}
            {!isMobile && (
              <div className="flex items-center bg-white/15 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    viewMode === 'table' 
                      ? 'bg-white/30 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                  onClick={() => onViewModeChange('table')}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    viewMode === 'cards' 
                      ? 'bg-white/30 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                  onClick={() => onViewModeChange('cards')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Refresh */}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 bg-white/15 hover:bg-white/25 text-white border border-white/20"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>

            {/* Browse Services CTA */}
            <Button 
              onClick={() => navigate('/portal/services')}
              className={cn(
                "gap-2 hidden sm:flex",
                "bg-amber-400 hover:bg-amber-500 text-amber-950 font-semibold",
                "shadow-lg shadow-amber-500/30"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              {isRTL ? 'تصفح الخدمات' : 'Browse'}
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Gold Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
    </motion.div>
  );
}
