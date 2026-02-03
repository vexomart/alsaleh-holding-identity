/**
 * Mobile Search Bar - Floating Search Component
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface MobileSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function MobileSearchBar({
  placeholder,
  value = "",
  onChange,
  onSearch,
  className,
  autoFocus = false,
}: MobileSearchBarProps) {
  const { isRTL } = useLanguage();
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange?.("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localValue);
    inputRef.current?.blur();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative", className)}
    >
      <div
        className={cn(
          "relative flex items-center gap-2",
          "bg-muted/50 rounded-xl",
          "border transition-all duration-200",
          isFocused
            ? "border-primary/50 bg-background shadow-sm"
            : "border-transparent"
        )}
      >
        {/* Search Icon */}
        <Search className="absolute start-3 h-5 w-5 text-muted-foreground pointer-events-none" />

        {/* Input */}
        <Input
          ref={inputRef}
          type="search"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || (isRTL ? "ابحث هنا..." : "Search...")}
          className={cn(
            "border-0 bg-transparent h-12 ps-10 pe-10",
            "text-base placeholder:text-muted-foreground/70",
            "focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {localValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute end-2"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8 rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

export default MobileSearchBar;
