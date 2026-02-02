/**
 * Invoice Items Table
 * Classic corporate invoice table design
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className={cn('space-y-3', className)}
      >
        {/* Section Header */}
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-5 bg-slate-900 dark:bg-slate-400 rounded-full" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {isRTL ? 'تفاصيل البنود' : 'Line Items'}
          </h3>
        </div>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.quantity} × <span dir="ltr" className="ltr-token">{formatCurrency(item.unitPrice)}</span>
                  </p>
                </div>
                <div className="text-end">
                  <p dir="ltr" className="font-bold text-lg text-foreground tabular-nums ltr-token">
                    {formatCurrency(item.lineTotal)}
                  </p>
                  <p className="text-xs text-muted-foreground">{currency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Desktop: Classic Table
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={cn('space-y-3', className)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-5 bg-slate-900 dark:bg-slate-400 rounded-full" />
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {isRTL ? 'تفاصيل البنود' : 'Line Items'}
        </h3>
      </div>

      {/* Classic Table */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 dark:bg-slate-800 text-white">
              <th className="text-start px-4 py-3 text-xs font-bold uppercase tracking-wider w-12">
                #
              </th>
              <th className="text-start px-4 py-3 text-xs font-bold uppercase tracking-wider">
                {isRTL ? 'الوصف' : 'Description'}
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider w-24">
                {isRTL ? 'الكمية' : 'Qty'}
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider w-32">
                {isRTL ? 'سعر الوحدة' : 'Unit Price'}
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider w-36">
                {isRTL ? 'الإجمالي' : 'Amount'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((item, index) => (
              <tr 
                key={item.id || index}
                className={cn(
                  'transition-colors',
                  index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50 dark:bg-slate-900/50'
                )}
              >
                <td className="px-4 py-4 text-sm text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
                </td>
                <td className="px-4 py-4 text-sm text-center text-foreground tabular-nums">
                  {item.quantity}
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <span dir="ltr" className="font-mono text-foreground tabular-nums ltr-token">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <span dir="ltr" className="font-mono font-semibold text-foreground tabular-nums ltr-token">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
