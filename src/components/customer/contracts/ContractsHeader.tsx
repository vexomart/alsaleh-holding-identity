/**
 * ContractsHeader - Sticky mobile-app style header
 * RTL-first with search and actions
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

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on escape
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
    <div className={cn(
      "sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b -mx-4 sm:-mx-6 px-4 sm:px-6 py-3",
      isRTL && "text-right"
    )}>
      <div className={cn(
        "flex items-center justify-between gap-3",
        isRTL && "flex-row-reverse"
      )}>
        {/* Title & Search */}
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
                  "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none",
                  isRTL ? "right-3" : "left-3"
                )} />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={isRTL ? 'بحث برقم العقد...' : 'Search by contract number...'}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={cn(
                    "h-10",
                    isRTL ? "pr-10 text-right" : "pl-10"
                  )}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-8 w-8",
                    isRTL ? "left-1" : "right-1"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isRTL ? 'عقودي' : 'My Contracts'}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {isRTL 
                    ? 'عرض وإدارة جميع عقودك'
                    : 'View and manage all your contracts'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className={cn("flex items-center gap-2 shrink-0", isRTL && "flex-row-reverse")}>
          {/* Desktop Search */}
          {!isMobile && (
            <div className="relative w-64">
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input
                type="text"
                placeholder={isRTL ? 'بحث برقم العقد...' : 'Search contract...'}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  "h-9",
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
              className="h-9 w-9"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile Filter Button */}
          {isMobile && onOpenFilters && (
            <Button
              variant="outline"
              size="icon"
              className={cn("h-9 w-9 relative", hasActiveFilters && "border-primary")}
              onClick={onOpenFilters}
            >
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
              )}
            </Button>
          )}

          {/* View Toggle (Desktop) */}
          {!isMobile && (
            <div className="flex items-center border rounded-lg p-0.5">
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-3"
                onClick={() => onViewModeChange('table')}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-3"
                onClick={() => onViewModeChange('cards')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Refresh */}
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>

          {/* Browse Services CTA */}
          <Button 
            onClick={() => navigate('/app/services')}
            className="gap-2 hidden sm:flex"
          >
            <ShoppingBag className="h-4 w-4" />
            {isRTL ? 'تصفح الخدمات' : 'Browse'}
          </Button>
        </div>
      </div>
    </div>
  );
}
