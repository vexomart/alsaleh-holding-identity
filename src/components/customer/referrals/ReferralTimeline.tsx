/**
 * Referral Timeline - Animated Stepper
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useReferralEvents } from '@/hooks/useReferrals';
import { 
  Clock, 
  UserPlus, 
  FileText, 
  FileSignature, 
  Award, 
  CheckCircle2,
  XCircle,
  History 
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  REFERRAL_STATUS_LABELS, 
  REFERRAL_STATUS_ORDER,
  type ReferralStatus 
} from '@/types/referrals';

interface ReferralTimelineProps {
  referralId?: string | null;
}

const statusIcons: Record<ReferralStatus, React.ElementType> = {
  new: Clock,
  registered: UserPlus,
  service_requested: FileText,
  contract_signed: FileSignature,
  qualified: Award,
  reward_paid: CheckCircle2,
  rejected: XCircle,
};

const statusColors: Record<ReferralStatus, string> = {
  new: 'bg-blue-500',
  registered: 'bg-cyan-500',
  service_requested: 'bg-amber-500',
  contract_signed: 'bg-purple-500',
  qualified: 'bg-emerald-500',
  reward_paid: 'bg-green-500',
  rejected: 'bg-red-500',
};

export function ReferralTimeline({ referralId }: ReferralTimelineProps) {
  const { data: events, isLoading } = useReferralEvents(referralId || '');

  if (!referralId) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">اختر إحالة لعرض سجلها</h3>
            <p className="text-muted-foreground text-sm">
              اضغط على زر العرض في جدول الإحالات لمشاهدة التفاصيل
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Build timeline from events
  const currentStatuses = new Set(events?.map(e => e.new_status) || []);
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-primary" />
          سجل الإحالة
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Stepper */}
        <div className="mb-6">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 right-5 left-5 h-0.5 bg-muted" />
            
            {REFERRAL_STATUS_ORDER.map((status, index) => {
              const isCompleted = currentStatuses.has(status);
              const Icon = statusIcons[status];
              
              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isCompleted 
                        ? `${statusColors[status]} border-transparent text-white` 
                        : 'bg-background border-muted text-muted-foreground'
                    }`}
                    animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>
                  <span className={`text-[10px] mt-1 text-center max-w-[60px] ${
                    isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {REFERRAL_STATUS_LABELS[status]}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events && events.length > 0 ? (
            events.map((event, index) => {
              const Icon = statusIcons[event.new_status as ReferralStatus] || Clock;
              const color = statusColors[event.new_status as ReferralStatus] || 'bg-gray-500';
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">
                        {REFERRAL_STATUS_LABELS[event.new_status as ReferralStatus]}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {format(new Date(event.created_at), 'dd MMM yyyy - HH:mm', { locale: ar })}
                      </span>
                    </div>
                    {event.old_status && (
                      <p className="text-sm text-muted-foreground">
                        من: {REFERRAL_STATUS_LABELS[event.old_status as ReferralStatus]}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      بواسطة: {event.actor === 'admin' ? 'الإدارة' : event.actor === 'system' ? 'النظام' : 'المستخدم'}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">لا توجد أحداث مسجلة بعد</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
