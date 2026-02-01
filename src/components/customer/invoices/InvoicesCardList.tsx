/**
 * Invoices Card List - Mobile-first card view
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Eye, Download, Calendar, Receipt, Package } from 'lucide-react';
import { CustomerInvoice } from './types';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

interface InvoicesCardListProps {
  invoices: CustomerInvoice[];
  isLoading: boolean;
  onCardClick: (invoice: CustomerInvoice) => void;
  onDownload?: (invoice: CustomerInvoice) => void;
  selectedInvoiceId?: string;
}

export function InvoicesCardList({
  invoices,
  isLoading,
  onCardClick,
  onDownload,
  selectedInvoiceId,
}: InvoicesCardListProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const reducedMotion = useReducedMotion();

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  // Loading skeleton
  if (isLoading && invoices.length === 0) {
    return (
      <div className="grid gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.2 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4"
    >
      <AnimatePresence mode="popLayout">
        {invoices.map((invoice) => {
          const isSelected = selectedInvoiceId === invoice.id;

          return (
            <motion.div
              key={invoice.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card
                className={cn(
                  "overflow-hidden cursor-pointer transition-all duration-200",
                  "hover:shadow-md hover:border-primary/20",
                  isSelected && "ring-2 ring-primary/30 border-primary/30"
                )}
                onClick={() => onCardClick(invoice)}
              >
                <CardContent className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <InvoiceStatusBadge status={invoice.status} size="sm" />
                    <div className="text-end">
                      <span dir="ltr" className="font-mono text-lg font-bold text-primary tabular-nums">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </span>
                      <span className="text-xs text-muted-foreground ms-1">
                        {invoice.currency}
                      </span>
                    </div>
                  </div>

                  {/* Invoice Number */}
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span dir="ltr" className="font-mono text-sm text-muted-foreground tabular-nums">
                      {invoice.invoice_number}
                    </span>
                  </div>

                  {/* Order Reference */}
                  {invoice.order && (
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground truncate">
                        {isRTL 
                          ? (invoice.order.title_ar || invoice.order.title)
                          : invoice.order.title}
                      </span>
                      <span dir="ltr" className="font-mono text-xs text-muted-foreground/70 shrink-0">
                        ({invoice.order.order_number})
                      </span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(invoice.created_at)}
                    </span>
                  </div>

                  {/* VAT Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-lg">
                    <span>{isRTL ? 'ضريبة القيمة المضافة 15%' : 'VAT 15%'}</span>
                    <span dir="ltr" className="font-mono tabular-nums">
                      {formatCurrency(invoice.vat_amount, invoice.currency)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => onCardClick(invoice)}
                    >
                      <Eye className="h-4 w-4" />
                      {isRTL ? 'عرض' : 'View'}
                    </Button>
                    {onDownload && (
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => onDownload(invoice)}
                      >
                        <Download className="h-4 w-4" />
                        {isRTL ? 'تحميل' : 'Download'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
