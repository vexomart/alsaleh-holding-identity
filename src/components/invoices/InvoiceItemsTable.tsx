/**
 * Invoice Items Table
 * Premium corporate invoice table - Global enterprise style
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
        className={cn('space-y-4 invoice-container', className)}
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#1a1a2e] to-[#0f3460] rounded-full" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] invoice-section-title">
            {isRTL ? 'تفاصيل البنود' : 'Line Items'}
          </h3>
        </div>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-foreground invoice-item-description">
                    {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="invoice-qty">{item.quantity}</span>
                    <span className="mx-2">×</span>
                    <span dir="ltr" className="ltr-token font-mono">{formatCurrency(item.unitPrice)}</span>
                  </p>
                </div>
                <div className="text-end">
                  <p dir="ltr" className="font-bold text-xl text-foreground tabular-nums ltr-token font-mono invoice-amount">
                    {formatCurrency(item.lineTotal)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{currency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Desktop: Premium Table
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={cn('space-y-4 invoice-container', className)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-1.5 h-6 bg-gradient-to-b from-[#1a1a2e] to-[#0f3460] rounded-full" />
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] invoice-section-title">
          {isRTL ? 'تفاصيل البنود' : 'Line Items'}
        </h3>
      </div>

      {/* Premium Table */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full invoice-table">
          <thead>
            <tr className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
              <th className="text-start px-5 py-4 text-[11px] font-bold uppercase tracking-[0.15em] w-14 invoice-th">
                #
              </th>
              <th className="text-start px-5 py-4 text-[11px] font-bold uppercase tracking-[0.15em] invoice-th">
                {isRTL ? 'الوصف' : 'Description'}
              </th>
              <th className="text-center px-5 py-4 text-[11px] font-bold uppercase tracking-[0.15em] w-28 invoice-th">
                {isRTL ? 'الكمية' : 'Qty'}
              </th>
              <th className="text-center px-5 py-4 text-[11px] font-bold uppercase tracking-[0.15em] w-36 invoice-th">
                {isRTL ? 'سعر الوحدة' : 'Unit Price'}
              </th>
              <th className="text-center px-5 py-4 text-[11px] font-bold uppercase tracking-[0.15em] w-40 invoice-th">
                {isRTL ? 'الإجمالي' : 'Amount'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item, index) => (
              <tr 
                key={item.id || index}
                className={cn(
                  'transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/50 dark:bg-slate-900/30'
                )}
              >
                <td className="px-5 py-4 text-sm text-muted-foreground font-mono invoice-td">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-foreground invoice-td invoice-description">
                  {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
                </td>
                <td className="px-5 py-4 text-sm text-center text-foreground tabular-nums invoice-td">
                  {item.quantity}
                </td>
                <td className="px-5 py-4 text-sm text-center invoice-td">
                  <span dir="ltr" className="font-mono text-foreground tabular-nums ltr-token invoice-price">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-center invoice-td">
                  <span dir="ltr" className="font-mono font-bold text-foreground tabular-nums ltr-token invoice-amount">
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