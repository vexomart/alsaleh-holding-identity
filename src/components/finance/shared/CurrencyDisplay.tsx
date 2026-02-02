/**
 * Currency Display - عرض المبالغ بالريال
 */

import { cn } from "@/lib/utils";
import { formatCurrencySAR } from "@/types/finance";

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
}

export function CurrencyDisplay({ amount, className, showSymbol = true }: CurrencyDisplayProps) {
  const formatted = showSymbol
    ? formatCurrencySAR(amount)
    : new Intl.NumberFormat("ar-SA").format(amount);

  return <span className={cn("font-semibold", className)}>{formatted}</span>;
}
