/**
 * AdminContractsHeader - Premium Command Center Header
 * تصميم احترافي لإدارة العقود - Bloomberg-style
 */

import { useState, useRef, useEffect } from 'react';
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
  FileSignature,
  Shield,
  Filter,
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
  const { language, isRTL } = useLanguage();
  const isMobile = useIsMobile();
  
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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl"
      dir="rtl"
    >
      {/* Premium Dark Gradient Background - Command Center Style */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-secondary/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 text-right">
        <div className="flex items-start justify-between gap-4 flex-row-reverse">
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
                  <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none right-4" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="بحث برقم العقد أو اسم العميل..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 pr-12 text-right"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-white/20 left-2"
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 flex-row-reverse"
              >
                {/* Icon */}
                <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 shadow-lg">
                  <FileSignature className="h-7 w-7 text-primary" />
                </div>
                
                {/* Text */}
                <div className="text-right">
                  <div className="flex items-center gap-3 mb-1 flex-row-reverse">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      إدارة العقود
                    </h1>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">
                        مركز التحكم
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    إدارة {totalContracts} عقد • الموافقة والمراجعة
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-2 shrink-0 flex-row-reverse"
          >
            {/* Desktop Search */}
            {!isMobile && (
              <div className="relative w-72">
                <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none right-3" />
                <Input
                  type="text"
                  placeholder="بحث برقم العقد أو العميل..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-primary/50 pr-10 text-right"
                />
              </div>
            )}

            {/* Mobile Search Toggle */}
            {isMobile && !isSearchOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            {/* Filter Button */}
            {onOpenFilters && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 relative",
                  hasActiveFilters && "border-secondary"
                )}
                onClick={onOpenFilters}
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -left-1 h-3 w-3 bg-secondary rounded-full animate-pulse" />
                )}
              </Button>
            )}

            {/* Refresh */}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border border-white/20"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-primary via-secondary to-accent" />
    </motion.div>
  );
}
