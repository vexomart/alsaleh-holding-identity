/**
 * Invoice Parties Component
 * Classic corporate billing/shipping style cards
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { InvoiceParty } from './types';

interface InvoicePartiesProps {
  seller: InvoiceParty;
  buyer: InvoiceParty;
  className?: string;
}

export function InvoiceParties({ seller, buyer, className }: InvoicePartiesProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}
    >
      {/* From (Seller) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-slate-900 dark:bg-slate-400 rounded-full" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {isRTL ? 'من' : 'From'}
          </h3>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
          <p className="font-bold text-foreground text-lg mb-2">
            {isRTL && seller.nameAr ? seller.nameAr : seller.name}
          </p>
          {seller.vatNumber && (
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">{isRTL ? 'الرقم الضريبي:' : 'VAT:'}</span>{' '}
              <span dir="ltr" className="font-mono ltr-token">{seller.vatNumber}</span>
            </p>
          )}
          {(seller.addressAr || seller.address) && (
            <p className="text-sm text-muted-foreground mb-1">
              {isRTL && seller.addressAr ? seller.addressAr : seller.address}
            </p>
          )}
          {seller.email && (
            <p className="text-sm text-muted-foreground">
              <span dir="ltr" className="ltr-token">{seller.email}</span>
            </p>
          )}
        </div>
      </div>

      {/* To (Buyer) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {isRTL ? 'إلى' : 'Bill To'}
          </h3>
        </div>
        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="font-bold text-foreground text-lg mb-2">
            {isRTL && buyer.nameAr ? buyer.nameAr : buyer.name}
          </p>
          {buyer.customerId && (
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">{isRTL ? 'رقم العميل:' : 'Customer ID:'}</span>{' '}
              <span dir="ltr" className="font-mono ltr-token">{buyer.customerId}</span>
            </p>
          )}
          {buyer.vatNumber && (
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">{isRTL ? 'الرقم الضريبي:' : 'VAT:'}</span>{' '}
              <span dir="ltr" className="font-mono ltr-token">{buyer.vatNumber}</span>
            </p>
          )}
          {buyer.email && (
            <p className="text-sm text-muted-foreground">
              <span dir="ltr" className="ltr-token">{buyer.email}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
