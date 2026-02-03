/**
 * Rewards History Component
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Gift, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Wallet,
  Calendar 
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { ReferralReward, PayoutStatus } from '@/types/referrals';
import { 
  PAYOUT_STATUS_LABELS,
  formatReferralCurrency 
} from '@/types/referrals';

interface RewardsHistoryProps {
  rewards: ReferralReward[];
  isLoading?: boolean;
}

const statusConfig: Record<PayoutStatus, { icon: React.ElementType; color: string }> = {
  pending: { icon: Clock, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { icon: CheckCircle2, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  paid: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  failed: { icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  cancelled: { icon: XCircle, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
};

export function RewardsHistory({ rewards, isLoading }: RewardsHistoryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (rewards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10 flex items-center justify-center">
              <Gift className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">لا توجد مكافآت بعد</h3>
            <p className="text-muted-foreground text-sm">
              ستظهر مكافآتك هنا عندما تتأهل إحالاتك
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const totalPending = rewards
    .filter(r => r.payout_status === 'pending' || r.payout_status === 'approved')
    .reduce((sum, r) => sum + Number(r.amount), 0);
  
  const totalPaid = rewards
    .filter(r => r.payout_status === 'paid')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-primary" />
          سجل المكافآت
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">قيد الانتظار</span>
            </div>
            <p className="text-xl font-bold text-amber-600">
              {formatReferralCurrency(totalPending)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">تم الصرف</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">
              {formatReferralCurrency(totalPaid)}
            </p>
          </div>
        </div>

        {/* Rewards List */}
        <div className="space-y-3">
          {rewards.map((reward, index) => {
            const config = statusConfig[reward.payout_status as PayoutStatus];
            const StatusIcon = config?.icon || Clock;
            
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-full ${
                  reward.payout_status === 'paid' 
                    ? 'bg-emerald-500' 
                    : reward.payout_status === 'approved'
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                } flex items-center justify-center text-white`}>
                  <Gift className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-lg">
                      {formatReferralCurrency(reward.amount)}
                    </p>
                    <Badge 
                      variant="secondary"
                      className={`gap-1 ${config?.color}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {PAYOUT_STATUS_LABELS[reward.payout_status as PayoutStatus]}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(reward.created_at), 'dd MMM yyyy', { locale: ar })}
                    </span>
                    {reward.paid_at && (
                      <span className="text-emerald-600">
                        صُرفت: {format(new Date(reward.paid_at), 'dd MMM', { locale: ar })}
                      </span>
                    )}
                  </div>
                  
                  {reward.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {reward.notes}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
