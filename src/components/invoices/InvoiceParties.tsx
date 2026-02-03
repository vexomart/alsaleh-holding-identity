/**
 * Invoice Parties Component
 * Premium corporate billing style - Global enterprise
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
      className={cn('grid grid-cols-1 md:grid-cols-2 gap-6 invoice-container', className)}
    >
      {/* From (Seller) */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#1a1a2e] to-[#0f3460] rounded-full" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] invoice-section-title">
            {isRTL ? 'من' : 'From'}
          </h3>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="font-bold text-foreground text-lg mb-3 invoice-party-name">
            {isRTL && seller.nameAr ? seller.nameAr : seller.name}
          </p>
          {seller.vatNumber && (
            <p className="text-sm text-muted-foreground mb-2 invoice-party-info">
              <span className="font-semibold">{isRTL ? 'الرقم الضريبي:' : 'VAT:'}</span>{' '}
              <span dir="ltr" className="font-mono ltr-token invoice-vat">{seller.vatNumber}</span>
            </p>
          )}
          {(seller.addressAr || seller.address) && (
            <p className="text-sm text-muted-foreground mb-2 invoice-party-info">
              {isRTL && seller.addressAr ? seller.addressAr : seller.address}
            </p>
          )}
          {seller.email && (
            <p className="text-sm text-muted-foreground invoice-party-info">
              <span dir="ltr" className="ltr-token">{seller.email}</span>
            </p>
          )}
        </div>
      </div>

      {/* To (Buyer) */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] invoice-section-title">
            {isRTL ? 'إلى' : 'Bill To'}
          </h3>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800/50 shadow-sm">
          <p className="font-bold text-foreground text-lg mb-3 invoice-party-name">
            {isRTL && buyer.nameAr ? buyer.nameAr : buyer.name}
          </p>
          {buyer.customerId && (
            <p className="text-sm text-muted-foreground mb-2 invoice-party-info">
              <span className="font-semibold">{isRTL ? 'رقم العميل:' : 'Customer ID:'}</span>{' '}
              <span dir="ltr" className="font-mono ltr-token invoice-customer-id">{buyer.customerId}</span>
            </p>
          )}
          {buyer.phone && (
            <p className="text-sm text-muted-foreground mb-2 invoice-party-info">
              <span className="font-semibold">{isRTL ? 'الجوال:' : 'Phone:'}</span>{' '}
              <span dir="ltr" className="font-mono ltr-token">{buyer.phone}</span>
            </p>
          )}
          {buyer.vatNumber && (
            <p className="text-sm text-muted-foreground mb-2 invoice-party-info">
              <span className="font-semibold">{isRTL ? 'الرقم الضريبي:' : 'VAT:'}</span>{' '}
              <span dir="ltr" className="font-mono ltr-token invoice-vat">{buyer.vatNumber}</span>
            </p>
          )}
          {buyer.email && (
            <p className="text-sm text-muted-foreground invoice-party-info">
              <span dir="ltr" className="ltr-token">{buyer.email}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}