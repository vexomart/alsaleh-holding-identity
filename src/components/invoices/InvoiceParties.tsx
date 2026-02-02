/**
 * Invoice Parties Component
 * Seller and Buyer information cards
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Building2, 
  UserRound, 
  Mail, 
  Phone, 
  MapPin,
  Hash,
  ShieldCheck
} from 'lucide-react';
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
        type="seller"
        title={isRTL ? 'البائع' : 'Seller'}
        icon={Building2}
        index={0}
      />
      
      {/* Buyer Card */}
      <PartyCard 
        party={buyer}
        type="buyer"
        title={isRTL ? 'العميل' : 'Customer'}
        icon={UserRound}
        index={1}
      />
    </div>
  );
}

interface PartyCardProps {
  party: InvoiceParty;
  type: 'seller' | 'buyer';
  title: string;
  icon: React.ElementType;
  index: number;
}

function PartyCard({ party, type, title, icon: Icon, index }: PartyCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const name = isRTL && party.nameAr ? party.nameAr : party.name;
  const address = isRTL && party.addressAr ? party.addressAr : party.address;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className={cn(
        'rounded-xl border bg-card overflow-hidden',
        type === 'seller' && 'border-primary/20'
      )}
    >
      {/* Header */}
      <div className={cn(
        'px-4 py-3 flex items-center gap-3 border-b',
        type === 'seller' 
          ? 'bg-primary/5 border-primary/10' 
          : 'bg-muted/50'
      )}>
        <div className={cn(
          'p-2 rounded-lg',
          type === 'seller' 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground'
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        {type === 'seller' && (
          <ShieldCheck className="h-4 w-4 text-primary ms-auto" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <div>
          <p className="font-bold text-lg text-foreground">{name}</p>
          {party.customerId && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Hash className="h-3 w-3" />
              <span dir="ltr" className="font-mono ltr-token">{party.customerId}</span>
            </p>
          )}
        </div>

        {/* VAT Number */}
        {party.vatNumber && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {isRTL ? 'رقم السجل الضريبي:' : 'VAT No:'}
            </span>
            <span dir="ltr" className="font-mono font-medium text-foreground ltr-token">
              {party.vatNumber}
            </span>
          </div>
        )}

        {/* Address */}
        {address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{address}</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {party.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span dir="ltr" className="text-muted-foreground ltr-token">
                {party.email}
              </span>
            </div>
          )}
          {party.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span dir="ltr" className="text-muted-foreground ltr-token">
                {party.phone}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
