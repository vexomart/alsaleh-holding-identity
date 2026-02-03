/**
 * Admin Rewards Table
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Gift, 
  CheckCircle2, 
  XCircle,
  Banknote,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { ReferralReward, PayoutStatus } from '@/types/referrals';
import { 
  PAYOUT_STATUS_LABELS,
  formatReferralCurrency 
} from '@/types/referrals';

interface AdminRewardsTableProps {
  rewards: ReferralReward[];
  isLoading?: boolean;
  onProcessReward: (rewardId: string, action: 'approve' | 'pay' | 'reject') => void;
}

const statusColors: Record<PayoutStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export function AdminRewardsTable({ rewards, isLoading, onProcessReward }: AdminRewardsTableProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 mb-2" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Summary stats
  const pending = rewards.filter(r => r.payout_status === 'pending');
  const approved = rewards.filter(r => r.payout_status === 'approved');
  const totalPending = [...pending, ...approved].reduce((sum, r) => sum + Number(r.amount), 0);
  const totalPaid = rewards
    .filter(r => r.payout_status === 'paid')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5 text-primary" />
            إدارة المكافآت
          </CardTitle>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>معلقة: {formatReferralCurrency(totalPending)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>مصروفة: {formatReferralCurrency(totalPaid)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right w-[180px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد مكافآت</p>
                  </TableCell>
                </TableRow>
              ) : (
                rewards.map((reward, index) => (
                  <motion.tr
                    key={reward.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <span className="font-mono text-sm" dir="ltr">
                        {reward.user_id.slice(0, 8)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-emerald-600">
                        {formatReferralCurrency(reward.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={statusColors[reward.payout_status as PayoutStatus]}
                      >
                        {PAYOUT_STATUS_LABELS[reward.payout_status as PayoutStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(reward.created_at), 'dd/MM/yyyy', { locale: ar })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {reward.payout_status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-blue-600"
                              onClick={() => onProcessReward(reward.id, 'approve')}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              موافقة
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-red-600"
                              onClick={() => onProcessReward(reward.id, 'reject')}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        
                        {reward.payout_status === 'approved' && (
                          <Button
                            size="sm"
                            className="gap-1"
                            onClick={() => onProcessReward(reward.id, 'pay')}
                          >
                            <Banknote className="h-3 w-3" />
                            صرف
                          </Button>
                        )}
                        
                        {(reward.payout_status === 'paid' || reward.payout_status === 'cancelled') && (
                          <span className="text-xs text-muted-foreground">
                            {reward.payout_status === 'paid' ? 'تم الصرف' : 'ملغية'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
