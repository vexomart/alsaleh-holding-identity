/**
 * Active Services Card
 * Shows client's current active services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActiveService } from './types';

interface ActiveServicesCardProps {
  services: ActiveService[];
  className?: string;
}

const statusConfig = {
  active: {
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
    labelEn: 'Active',
    labelAr: 'نشط',
  },
  pending: {
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
    labelEn: 'Pending',
    labelAr: 'قيد الانتظار',
  },
  completed: {
    icon: CheckCircle,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
    labelEn: 'Completed',
    labelAr: 'مكتمل',
  },
  cancelled: {
    icon: XCircle,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/40',
    labelEn: 'Cancelled',
    labelAr: 'ملغي',
  },
};

export function ActiveServicesCard({ services, className }: ActiveServicesCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  if (services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className={cn('space-y-4', className)}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {isRTL ? 'الخدمات النشطة' : 'Active Services'}
          </h2>
        </div>
        <div className="rounded-xl border bg-card p-8 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {isRTL ? 'لا توجد خدمات نشطة حالياً' : 'No active services'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate('/dashboard/services')}
          >
            {isRTL ? 'تصفح الخدمات' : 'Browse Services'}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={cn('space-y-4', className)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-blue-500 rounded-full" />
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {isRTL ? 'الخدمات النشطة' : 'Active Services'}
        </h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ms-2">
          {services.length}
        </span>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service, index) => {
          const status = statusConfig[service.status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.15 + index * 0.05 }}
              className="rounded-xl border bg-card p-4"
            >
              <div className="flex items-start gap-4">
                {/* Service Icon */}
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {isRTL && service.serviceNameAr 
                        ? service.serviceNameAr 
                        : service.serviceName
                      }
                    </h3>
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                      status.bgColor,
                      status.color
                    )}>
                      <StatusIcon className="h-3 w-3" />
                      {isRTL ? status.labelAr : status.labelEn}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(service.startDate)}
                    </span>
                    {service.orderNumber && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span dir="ltr" className="font-mono text-xs ltr-token">
                          {service.orderNumber}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {service.orderId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/app/orders/${service.orderId}`)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
