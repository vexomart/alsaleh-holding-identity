/**
 * Admin Referrals Management Page
 * Complete admin control panel for referrals
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReferralsRealtime } from '@/hooks/useReferralsRealtime';
import { 
  useAllReferrals,
  useAllRewards,
  useUpdateReferralStatus,
  useProcessReward,
  useCreateReward
} from '@/hooks/useReferrals';
import { AdminReferralsStats } from './AdminReferralsStats';
import { AdminReferralsTable } from './AdminReferralsTable';
import { AdminReferralDetails } from './AdminReferralDetails';
import { AdminRewardsTable } from './AdminRewardsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Gift, 
  Settings,
  Shield,
  AlertTriangle
} from 'lucide-react';
import type { ReferralStatus } from '@/types/referrals';

export function AdminReferralsPage() {
  const { isRTL } = useLanguage();
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | undefined>();
  
  // Real-time sync
  useReferralsRealtime({ showToasts: true, isAdmin: true });
  
  // Data hooks
  const { data: referrals, isLoading: loadingReferrals } = useAllReferrals({ status: statusFilter });
  const { data: rewards, isLoading: loadingRewards } = useAllRewards();
  const updateStatus = useUpdateReferralStatus();
  const processReward = useProcessReward();
  const createReward = useCreateReward();
  
  // Calculate stats
  const stats = {
    total: referrals?.length || 0,
    new: referrals?.filter(r => r.status === 'new').length || 0,
    qualified: referrals?.filter(r => r.status === 'qualified').length || 0,
    pendingRewards: rewards?.filter(r => r.payout_status === 'pending').length || 0,
    fraudFlags: referrals?.filter(r => (r.fraud_flags as string[])?.length > 0).length || 0,
  };
  
  // Handlers
  const handleUpdateStatus = async (referralId: string, newStatus: ReferralStatus) => {
    await updateStatus.mutateAsync({ referralId, newStatus });
  };
  
  const handleProcessReward = async (rewardId: string, action: 'approve' | 'pay' | 'reject') => {
    await processReward.mutateAsync({ rewardId, action });
  };
  
  const handleCreateReward = async (referralId: string, userId: string, amount: number) => {
    await createReward.mutateAsync({ referralId, userId, amount });
  };

  if (loadingReferrals) {
    return <AdminReferralsPageSkeleton />;
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          إدارة الإحالات
        </h1>
        <p className="text-muted-foreground mt-1">
          مراقبة وإدارة جميع الإحالات والمكافآت في النظام
        </p>
      </motion.div>

      {/* Stats Overview */}
      <AdminReferralsStats stats={stats} />

      {/* Fraud Alert */}
      {stats.fraudFlags > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-destructive/30 bg-destructive/5 dark:border-destructive/50 dark:bg-destructive/10">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-destructive/10 dark:bg-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-destructive dark:text-destructive">
                    تنبيه: {stats.fraudFlags} إحالات تحتوي على علامات احتيال محتملة
                  </p>
                  <p className="text-sm text-destructive/70 dark:text-destructive/80">
                    يرجى مراجعة هذه الإحالات قبل الموافقة على المكافآت
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="referrals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid gap-1">
          <TabsTrigger value="referrals" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">الإحالات</span>
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              {stats.total}
            </span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">المكافآت</span>
            {stats.pendingRewards > 0 && (
              <span className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded-full">
                {stats.pendingRewards}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="fraud" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">مكافحة الاحتيال</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Referrals Table */}
            <div className="lg:col-span-2">
              <AdminReferralsTable 
                referrals={referrals || []}
                onSelectReferral={setSelectedReferralId}
                onUpdateStatus={handleUpdateStatus}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </div>
            
            {/* Details Panel */}
            <div>
              <AdminReferralDetails 
                referralId={selectedReferralId}
                onUpdateStatus={handleUpdateStatus}
                onCreateReward={handleCreateReward}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-4">
          <AdminRewardsTable 
            rewards={rewards || []}
            isLoading={loadingRewards}
            onProcessReward={handleProcessReward}
          />
        </TabsContent>

        <TabsContent value="fraud" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                مراقبة الاحتيال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">إحالات من نفس IP</p>
                    <p className="text-2xl font-bold">
                      {referrals?.filter(r => (r.fraud_flags as string[])?.includes('same_ip')).length || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">أجهزة مشبوهة</p>
                    <p className="text-2xl font-bold">
                      {referrals?.filter(r => (r.fraud_flags as string[])?.includes('same_device')).length || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">إحالات مرفوضة</p>
                    <p className="text-2xl font-bold text-destructive">
                      {referrals?.filter(r => r.status === 'rejected').length || 0}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  النظام يراقب تلقائياً: تكرار عناوين IP، بصمات الأجهزة، الإحالات الذاتية، ومعدلات التحويل غير الطبيعية.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdminReferralsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export default AdminReferralsPage;
