/**
 * Client Hub Page - Customer View
 * Unified relationship management center
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useClientHubData } from '@/hooks/useClientHubData';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ClientIdentityCard,
  RelationshipTimeline,
  FinancialSnapshot,
  ActiveServicesCard,
  ContractsSummary,
  QuickActions,
} from '@/components/client-hub';

export default function ClientHubPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { data, isLoading, error } = useClientHubData();

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">
            {isRTL ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'}
          </p>
          <p className="text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen"
    >
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {isRTL ? 'مركز العميل' : 'Client Hub'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isRTL 
            ? 'مركز علاقتك الموحد مع الشركة'
            : 'Your unified relationship center'
          }
        </p>
      </div>

      {isLoading ? (
        <ClientHubSkeleton />
      ) : data ? (
        <div className="space-y-8">
          {/* Identity Card */}
          <ClientIdentityCard client={data.identity} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Timeline */}
            <div className="lg:col-span-2 space-y-8">
              {/* Financial Snapshot */}
              <FinancialSnapshot data={data.financialSnapshot} />

              {/* Active Services */}
              <ActiveServicesCard services={data.activeServices} />

              {/* Relationship Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-slate-900 dark:bg-slate-400 rounded-full" />
                  <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    {isRTL ? 'سجل العلاقة' : 'Relationship Timeline'}
                  </h2>
                </div>
                <div className="bg-card border rounded-xl p-6">
                  <RelationshipTimeline 
                    events={data.timeline} 
                    maxEvents={10}
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Column: Summary Cards */}
            <div className="space-y-8">
              {/* Contracts Summary */}
              <ContractsSummary contracts={data.contracts} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          {isRTL ? 'لا توجد بيانات' : 'No data available'}
        </div>
      )}
    </div>
  );
}

function ClientHubSkeleton() {
  return (
    <div className="space-y-8">
      {/* Identity Card Skeleton */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Financial Snapshot */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          
          {/* Services */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
