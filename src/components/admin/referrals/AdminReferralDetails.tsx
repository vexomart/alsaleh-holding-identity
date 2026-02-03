/**
 * Admin Referral Details Panel
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useReferral, useReferralEvents, useReferralSettings } from '@/hooks/useReferrals';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Monitor,
  CheckCircle2,
  XCircle,
  Gift,
  History,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { ReferralStatus } from '@/types/referrals';
import { 
  REFERRAL_STATUS_LABELS,
  REFERRAL_STATUS_COLORS,
  formatReferralCurrency
} from '@/types/referrals';

interface AdminReferralDetailsProps {
  referralId: string | null;
  onUpdateStatus: (id: string, status: ReferralStatus) => void;
  onCreateReward: (referralId: string, userId: string, amount: number) => void;
}

export function AdminReferralDetails({ 
  referralId,
  onUpdateStatus,
  onCreateReward
}: AdminReferralDetailsProps) {
  const { data: referral, isLoading } = useReferral(referralId || '');
  const { data: events } = useReferralEvents(referralId || '');
  const { data: settings } = useReferralSettings();

  if (!referralId) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">اختر إحالة</h3>
            <p className="text-muted-foreground text-sm">
              اضغط على زر العرض لمشاهدة التفاصيل
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!referral) return null;

  const fraudFlags = referral.fraud_flags as string[] || [];
  const canCreateReward = referral.status === 'qualified' && referral.reward_amount === 0;

  return (
    <Card className="border-0 shadow-lg sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            تفاصيل الإحالة
          </span>
          <Badge className={REFERRAL_STATUS_COLORS[referral.status as ReferralStatus]}>
            {REFERRAL_STATUS_LABELS[referral.status as ReferralStatus]}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Fraud Alert */}
        {fraudFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold text-sm">تحذيرات احتيال</span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-red-600">
              {fraudFlags.map((flag, i) => (
                <li key={i}>• {flag}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Referral Code */}
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">كود الإحالة</p>
          <p className="font-mono font-bold text-primary">{referral.referral_code}</p>
        </div>

        {/* Referred Person Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">المُحال</h4>
          
          {referral.referred_name && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{referral.referred_name}</span>
            </div>
          )}
          
          {referral.referred_email && (
            <div className="flex items-center gap-2 text-sm" dir="ltr">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{referral.referred_email}</span>
            </div>
          )}
          
          {referral.referred_phone && (
            <div className="flex items-center gap-2 text-sm" dir="ltr">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{referral.referred_phone}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Technical Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">معلومات تقنية</h4>
          
          {referral.ip_address && (
            <div className="flex items-center gap-2 text-sm" dir="ltr">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono">{referral.ip_address}</span>
            </div>
          )}
          
          {referral.device_fingerprint && (
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xs truncate max-w-[180px]">
                {referral.device_fingerprint}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(referral.created_at), 'dd MMMM yyyy - HH:mm', { locale: ar })}
            </span>
          </div>
        </div>

        <Separator />

        {/* Reward Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Gift className="h-4 w-4" />
            المكافأة
          </h4>
          
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10">
            <p className="text-2xl font-bold text-emerald-600">
              {formatReferralCurrency(referral.reward_amount || settings?.reward_amount_per_referral || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {referral.reward_amount > 0 ? 'مكافأة مستحقة' : 'مكافأة متوقعة'}
            </p>
          </div>
        </div>

        {/* Timeline */}
        {events && events.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <History className="h-4 w-4" />
                آخر الأحداث
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {events.slice(-5).reverse().map(event => (
                  <div key={event.id} className="text-xs p-2 rounded bg-muted/30">
                    <span className="font-medium">
                      {REFERRAL_STATUS_LABELS[event.new_status as ReferralStatus]}
                    </span>
                    <span className="text-muted-foreground mx-1">•</span>
                    <span className="text-muted-foreground">
                      {format(new Date(event.created_at), 'dd/MM HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          {canCreateReward && (
            <Button 
              className="w-full gap-2"
              onClick={() => onCreateReward(
                referral.id, 
                referral.referrer_user_id, 
                settings?.reward_amount_per_referral || 100
              )}
            >
              <Gift className="h-4 w-4" />
              إنشاء مكافأة
            </Button>
          )}
          
          {referral.status !== 'qualified' && referral.status !== 'reward_paid' && referral.status !== 'rejected' && (
            <Button 
              variant="outline"
              className="w-full gap-2"
              onClick={() => onUpdateStatus(referral.id, 'qualified')}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              تأهيل للمكافأة
            </Button>
          )}
          
          {referral.status !== 'rejected' && (
            <Button 
              variant="outline"
              className="w-full gap-2 text-red-600 hover:text-red-700"
              onClick={() => onUpdateStatus(referral.id, 'rejected')}
            >
              <XCircle className="h-4 w-4" />
              رفض الإحالة
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
