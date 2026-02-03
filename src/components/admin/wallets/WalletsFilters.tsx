/**
 * Wallets Filters Component
 * Advanced filtering with search and status selection
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  X,
  Filter,
  Wallet,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletsFiltersProps {
  language: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalCount: number;
  filteredCount: number;
}

export const WalletsFilters = memo(function WalletsFilters({
  language,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onRefresh,
  isRefreshing,
  totalCount,
  filteredCount,
}: WalletsFiltersProps) {
  const isRTL = language === "ar";

  const statusOptions = [
    { value: "all", labelAr: "الكل", labelEn: "All", icon: WalletCards },
    { value: "with_wallet", labelAr: "لديهم محفظة", labelEn: "With Wallet", icon: Wallet },
    { value: "without_wallet", labelAr: "بدون محفظة", labelEn: "No Wallet", icon: X },
    { value: "active", labelAr: "نشط", labelEn: "Active", icon: Wallet },
    { value: "frozen", labelAr: "مجمد", labelEn: "Frozen", icon: Wallet },
  ];

  const hasActiveFilters = searchQuery || statusFilter !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isRTL ? "بحث بالاسم، البريد، رقم الهاتف أو UID..." : "Search by name, email, phone or UID..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ps-10 pe-10 h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-background"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute end-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/50 border-border/50">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {isRTL ? option.labelAr : option.labelEn}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-xl shrink-0"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      {/* Active Filters & Stats */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Results count */}
        <Badge variant="secondary" className="rounded-lg px-3 py-1">
          {filteredCount} / {totalCount} {isRTL ? "عميل" : "customers"}
        </Badge>

        {/* Active filters badges */}
        {hasActiveFilters && (
          <>
            {searchQuery && (
              <Badge variant="outline" className="rounded-lg px-3 py-1 gap-1">
                <Search className="h-3 w-3" />
                "{searchQuery}"
                <button
                  onClick={() => onSearchChange("")}
                  className="ms-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="outline" className="rounded-lg px-3 py-1 gap-1">
                <Filter className="h-3 w-3" />
                {statusOptions.find(s => s.value === statusFilter)?.[isRTL ? "labelAr" : "labelEn"]}
                <button
                  onClick={() => onStatusChange("all")}
                  className="ms-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Clear all button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={clearFilters}
            >
              <X className="h-3 w-3 me-1" />
              {isRTL ? "مسح الكل" : "Clear all"}
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
});
