/**
 * Invoice Items Table
 * Clean table for desktop, card list for mobile
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { InvoiceLineItem } from './types';

interface InvoiceItemsTableProps {
  items: InvoiceLineItem[];
  currency: string;
  className?: string;
}

export function InvoiceItemsTable({ items, currency, className }: InvoiceItemsTableProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isMobile) {
    return (
      <div className={cn('space-y-3', className)}>
        <p className="text-sm font-medium text-muted-foreground px-1">
          {isRTL ? 'البنود' : 'Items'} ({items.length})
        </p>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
              className="rounded-xl border bg-card p-4"
            >
              {/* Description */}
              <p className="font-medium text-foreground mb-3">
                {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
              </p>

              {/* Details */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </span>
                <span dir="ltr" className="font-semibold text-foreground tabular-nums ltr-token">
                  {formatCurrency(item.lineTotal)} {currency}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Table
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.08 }}
      className={cn('rounded-xl border bg-card overflow-hidden', className)}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-start px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {isRTL ? 'الوصف' : 'Description'}
            </th>
            <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">
              {isRTL ? 'الكمية' : 'Qty'}
            </th>
            <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">
              {isRTL ? 'سعر الوحدة' : 'Unit Price'}
            </th>
            <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-32">
              {isRTL ? 'الإجمالي' : 'Total'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {items.map((item, index) => (
            <tr 
              key={item.id || index}
              className={cn(
                'transition-colors',
                index % 2 === 1 && 'bg-muted/20'
              )}
            >
              <td className="px-4 py-3.5 text-sm text-foreground">
                {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
              </td>
              <td className="px-4 py-3.5 text-sm text-center text-foreground tabular-nums">
                {item.quantity}
              </td>
              <td className="px-4 py-3.5 text-sm text-center">
                <span dir="ltr" className="font-mono text-foreground tabular-nums ltr-token">
                  {formatCurrency(item.unitPrice)}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm text-center">
                <span dir="ltr" className="font-mono font-medium text-foreground tabular-nums ltr-token">
                  {formatCurrency(item.lineTotal)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
