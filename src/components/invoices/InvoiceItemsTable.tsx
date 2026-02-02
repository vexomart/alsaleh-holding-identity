/**
 * Invoice Items Table
 * Premium table for desktop, card list for mobile
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
        <div className="flex items-center gap-2 px-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">
            {isRTL ? 'البنود' : 'Line Items'}
          </h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="rounded-xl border bg-card p-4 space-y-3"
            >
              {/* Description */}
              <div>
                <p className="font-medium text-foreground">
                  {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'الكمية' : 'Qty'}
                  </p>
                  <p className="font-semibold tabular-nums">{item.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'سعر الوحدة' : 'Unit Price'}
                  </p>
                  <p dir="ltr" className="font-semibold tabular-nums ltr-token">
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'الإجمالي' : 'Total'}
                  </p>
                  <p dir="ltr" className="font-bold text-primary tabular-nums ltr-token">
                    {formatCurrency(item.lineTotal)}
                  </p>
                </div>
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className={cn('rounded-xl border bg-card overflow-hidden', className)}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2 border-b bg-muted/30">
        <Package className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">
          {isRTL ? 'بنود الفاتورة' : 'Invoice Items'}
        </h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ms-2">
          {items.length} {isRTL ? 'بند' : 'items'}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/20 hover:bg-muted/20">
            <TableHead className="w-12 text-center font-semibold">#</TableHead>
            <TableHead className="font-semibold">
              {isRTL ? 'الوصف' : 'Description'}
            </TableHead>
            <TableHead className="w-24 text-center font-semibold">
              {isRTL ? 'الكمية' : 'Qty'}
            </TableHead>
            <TableHead className="w-32 text-center font-semibold">
              {isRTL ? 'سعر الوحدة' : 'Unit Price'}
            </TableHead>
            <TableHead className="w-32 text-center font-semibold">
              {isRTL ? 'الإجمالي' : 'Total'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <motion.tr
              key={item.id || index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
              className="group hover:bg-muted/30 transition-colors"
            >
              <TableCell className="text-center text-muted-foreground font-mono text-sm">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">
                {isRTL && item.descriptionAr ? item.descriptionAr : item.description}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {item.quantity}
              </TableCell>
              <TableCell className="text-center">
                <span dir="ltr" className="font-mono tabular-nums ltr-token">
                  {formatCurrency(item.unitPrice)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span dir="ltr" className="font-mono font-semibold text-foreground tabular-nums ltr-token">
                  {formatCurrency(item.lineTotal)}
                </span>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
