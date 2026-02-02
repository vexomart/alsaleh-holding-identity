/**
 * Client Identity Card
 * Premium header showing client info and status
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield,
  UserCheck,
  Hash
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientIdentity, CLIENT_STATUS_CONFIG } from './types';
import { getInitials, formatClientId } from './utils';

interface ClientIdentityCardProps {
  client: ClientIdentity;
  className?: string;
}

export function ClientIdentityCard({ client, className }: ClientIdentityCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const statusConfig = CLIENT_STATUS_CONFIG[client.status];
  const displayName = isRTL && client.nameAr ? client.nameAr : client.name;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card',
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      
      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={client.avatarUrl} alt={displayName} />
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name & Status Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
              <h1 className="text-2xl font-bold text-foreground truncate">
                {displayName}
              </h1>
              <span className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold w-fit',
                statusConfig.bgColor,
                statusConfig.color
              )}>
                {isRTL ? statusConfig.labelAr : statusConfig.labelEn}
              </span>
              {client.isKycVerified && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <Shield className="h-3.5 w-3.5" />
                  {isRTL ? 'موثق' : 'Verified'}
                </span>
              )}
            </div>

            {/* Client ID */}
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span dir="ltr" className="font-mono text-sm font-semibold text-primary ltr-token">
                {formatClientId(client.clientId)}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span dir="ltr" className="text-foreground truncate ltr-token">
                  {client.email}
                </span>
              </div>

              {/* Phone */}
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span dir="ltr" className="text-foreground ltr-token">
                    {client.phone}
                  </span>
                </div>
              )}

              {/* Member Since */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  {isRTL ? 'عميل منذ: ' : 'Since: '}
                  <span className="text-foreground">{formatDate(client.createdAt)}</span>
                </span>
              </div>

              {/* Account Manager */}
              {client.accountManager && (
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isRTL ? 'مدير الحساب: ' : 'Manager: '}
                    <span className="text-foreground">
                      {isRTL && client.accountManager.nameAr 
                        ? client.accountManager.nameAr 
                        : client.accountManager.name
                      }
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
