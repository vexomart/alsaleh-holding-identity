/**
 * Filter Bottom Sheet - Mobile-friendly Filter UI
 */

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Filter, X, RotateCcw, Check } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  labelAr?: string;
}

interface FilterGroup {
  id: string;
  title: string;
  titleAr?: string;
  options: FilterOption[];
  type: "single" | "multiple";
}

interface FilterBottomSheetProps {
  groups: FilterGroup[];
  selected: Record<string, string | string[]>;
  onApply: (filters: Record<string, string | string[]>) => void;
  onReset: () => void;
  trigger?: ReactNode;
  activeCount?: number;
}

export function FilterBottomSheet({
  groups,
  selected,
  onApply,
  onReset,
  trigger,
  activeCount = 0,
}: FilterBottomSheetProps) {
  const { isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState(selected);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSelected(selected);
    }
    setOpen(isOpen);
  };

  const handleOptionToggle = (groupId: string, optionId: string, type: "single" | "multiple") => {
    setLocalSelected((prev) => {
      if (type === "single") {
        return {
          ...prev,
          [groupId]: prev[groupId] === optionId ? "" : optionId,
        };
      } else {
        const current = (prev[groupId] as string[]) || [];
        const isSelected = current.includes(optionId);
        return {
          ...prev,
          [groupId]: isSelected
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      }
    });
  };

  const handleApply = () => {
    onApply(localSelected);
    setOpen(false);
  };

  const handleReset = () => {
    const emptyFilters: Record<string, string | string[]> = {};
    groups.forEach((group) => {
      emptyFilters[group.id] = group.type === "multiple" ? [] : "";
    });
    setLocalSelected(emptyFilters);
    onReset();
    setOpen(false);
  };

  const isOptionSelected = (groupId: string, optionId: string, type: "single" | "multiple") => {
    if (type === "single") {
      return localSelected[groupId] === optionId;
    }
    return ((localSelected[groupId] as string[]) || []).includes(optionId);
  };

  return (
    <>
      {/* Trigger */}
      <Sheet open={open} onOpenChange={handleOpen}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className={cn(
            "h-10 gap-2 rounded-xl",
            activeCount > 0 && "border-primary text-primary"
          )}
        >
          {trigger || (
            <>
              <Filter className="h-4 w-4" />
              <span>{isRTL ? "تصفية" : "Filter"}</span>
              {activeCount > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeCount}
                </Badge>
              )}
            </>
          )}
        </Button>

        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
          <SheetHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold">
                {isRTL ? "تصفية النتائج" : "Filter Results"}
              </SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{isRTL ? "إعادة" : "Reset"}</span>
              </Button>
            </div>
          </SheetHeader>

          {/* Filter Groups */}
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {groups.map((group) => (
              <div key={group.id}>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {isRTL ? group.titleAr || group.title : group.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const isSelected = isOptionSelected(group.id, option.id, group.type);
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleOptionToggle(group.id, option.id, group.type)}
                        className={cn(
                          "h-10 px-4 rounded-xl",
                          "border transition-all duration-200",
                          "flex items-center gap-2",
                          "min-w-[80px] justify-center",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-primary/50"
                        )}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSelected && <Check className="h-4 w-4" />}
                        <span className="text-sm font-medium">
                          {isRTL ? option.labelAr || option.label : option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <SheetFooter className="pt-4 border-t gap-3 flex-row">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-12 rounded-xl"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 h-12 rounded-xl"
            >
              {isRTL ? "تطبيق الفلاتر" : "Apply Filters"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default FilterBottomSheet;
