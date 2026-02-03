/**
 * Customer Referrals Dashboard
 * Complete referral management for customers
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReferralsRealtime } from '@/hooks/useReferralsRealtime';
import { 
  useUserReferrals, 
  useReferralStats, 
  useUserRewards,
  useGenerateReferralLink 
} from '@/hooks/useReferrals';
import { ReferralStatsCards } from './ReferralStatsCards';
import { ReferralLinkCard } from './ReferralLinkCard';
import { ReferralsTable } from './ReferralsTable';
import { ReferralTimeline } from './ReferralTimeline';
import { RewardsHistory } from './RewardsHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Gift, 
  TrendingUp,
  History 
} from 'lucide-react';

export function CustomerReferralsPage() {
  const { isRTL } = useLanguage();
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
  
  // Real-time sync
  useReferralsRealtime({ showToasts: true, isAdmin: false });
  
  // Data hooks
  const { data: referrals, isLoading: loadingReferrals } = useUserReferrals();
  const { data: stats, isLoading: loadingStats } = useReferralStats();
  const { data: rewards, isLoading: loadingRewards } = useUserRewards();
  const generateLink = useGenerateReferralLink();
  
  // Get primary referral link
  const primaryReferral = referrals?.[0];
  
  // Handle generate new link
  const handleGenerateLink = async () => {
    await generateLink.mutateAsync();
  };
  
  if (loadingReferrals || loadingStats) {
    return <ReferralsPageSkeleton />;
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-foreground">
          برنامج الإحالات
        </h1>
        <p className="text-muted-foreground mt-1">
          شارك رابطك واحصل على مكافآت عند تسجيل عملاء جدد
        </p>
      </motion.div>

      {/* Stats Cards */}
      <ReferralStatsCards stats={stats} isLoading={loadingStats} />

      {/* Referral Link Card */}
      <ReferralLinkCard 
        referral={primaryReferral}
        onGenerateLink={handleGenerateLink}
        isGenerating={generateLink.isPending}
      />

      {/* Tabs */}
      <Tabs defaultValue="referrals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid gap-1">
          <TabsTrigger value="referrals" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">الإحالات</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">المكافآت</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">السجل</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="referrals" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ReferralsTable 
                referrals={referrals || []}
                onSelectReferral={setSelectedReferralId}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <RewardsHistory 
                rewards={rewards || []}
                isLoading={loadingRewards}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ReferralTimeline 
                referralId={selectedReferralId || primaryReferral?.id}
              />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

function ReferralsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default CustomerReferralsPage;
