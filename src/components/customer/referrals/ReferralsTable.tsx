/**
 * Referrals Table - RTL Optimized
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Referral, ReferralStatus } from '@/types/referrals';
import { 
  REFERRAL_STATUS_LABELS, 
  REFERRAL_STATUS_COLORS,
  formatReferralCurrency 
} from '@/types/referrals';

interface ReferralsTableProps {
  referrals: Referral[];
  onSelectReferral: (id: string) => void;
}

const statusIcons: Record<ReferralStatus, React.ElementType> = {
  new: Clock,
  registered: CheckCircle2,
  service_requested: AlertCircle,
  contract_signed: CheckCircle2,
  qualified: CheckCircle2,
  reward_paid: CheckCircle2,
  rejected: XCircle,
};

export function ReferralsTable({ referrals, onSelectReferral }: ReferralsTableProps) {
  if (referrals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">لا توجد إحالات بعد</h3>
            <p className="text-muted-foreground text-sm">
              شارك رابط الإحالة الخاص بك لبدء كسب المكافآت
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          قائمة الإحالات ({referrals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-right">الشخص المُحال</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">المكافأة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right w-[80px]">عرض</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral, index) => {
                const StatusIcon = statusIcons[referral.status as ReferralStatus] || Clock;
                
                return (
                  <motion.tr
                    key={referral.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {referral.referred_name?.charAt(0) || referral.referred_email?.charAt(0) || '؟'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {referral.referred_name || 'بانتظار التسجيل'}
                          </p>
                          {referral.referred_email && (
                            <p className="text-xs text-muted-foreground" dir="ltr">
                              {referral.referred_email}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`gap-1 ${REFERRAL_STATUS_COLORS[referral.status as ReferralStatus]}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {REFERRAL_STATUS_LABELS[referral.status as ReferralStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        referral.reward_amount > 0 ? 'text-emerald-600' : 'text-muted-foreground'
                      }`}>
                        {referral.reward_amount > 0 
                          ? formatReferralCurrency(referral.reward_amount)
                          : '—'
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(referral.created_at), 'dd MMM yyyy', { locale: ar })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelectReferral(referral.id)}
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
