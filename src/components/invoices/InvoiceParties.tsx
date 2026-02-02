/**
 * Invoice Parties Component
 * Clean seller and buyer information cards
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Building2, User } from 'lucide-react';
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
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {/* Seller Card */}
      <PartyCard 
        party={seller}
        title={isRTL ? 'البائع' : 'Seller'}
        icon={Building2}
        index={0}
      />
      
      {/* Buyer Card */}
      <PartyCard 
        party={buyer}
        title={isRTL ? 'العميل' : 'Customer'}
        icon={User}
        index={1}
      />
    </div>
  );
}

interface PartyCardProps {
  party: InvoiceParty;
  title: string;
  icon: React.ElementType;
  index: number;
}

function PartyCard({ party, title, icon: Icon, index }: PartyCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const name = isRTL && party.nameAr ? party.nameAr : party.name;
  const address = isRTL && party.addressAr ? party.addressAr : party.address;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="rounded-xl border bg-card"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          {party.customerId && (
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="me-1">{isRTL ? 'رقم العميل:' : 'ID:'}</span>
              <span dir="ltr" className="font-mono ltr-token">{party.customerId}</span>
            </p>
          )}
        </div>

        {/* VAT Number */}
        {party.vatNumber && (
          <div className="text-sm">
            <span className="text-muted-foreground me-1">
              {isRTL ? 'الرقم الضريبي:' : 'VAT:'}
            </span>
            <span dir="ltr" className="font-mono text-foreground ltr-token">
              {party.vatNumber}
            </span>
          </div>
        )}

        {/* Address */}
        {address && (
          <p className="text-sm text-muted-foreground">{address}</p>
        )}

        {/* Contact */}
        {(party.email || party.phone) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {party.email && (
              <span dir="ltr" className="ltr-token">{party.email}</span>
            )}
            {party.phone && (
              <span dir="ltr" className="ltr-token">{party.phone}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
