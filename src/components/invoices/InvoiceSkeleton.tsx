/**
 * Invoice Skeleton
 * Classic loading state
 */

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface InvoiceSkeletonProps {
  className?: string;
}

export function InvoiceSkeleton({ className }: InvoiceSkeletonProps) {
  return (
    <div className={cn('space-y-8 max-w-4xl mx-auto', className)}>
      {/* Header */}
      <div>
        <div className="bg-slate-200 dark:bg-slate-800 rounded-t-lg h-16" />
        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-b-lg p-4 border-x border-b">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-12" />
            <div className="border rounded-lg p-4 space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-slate-200 dark:bg-slate-800 h-12" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-t">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm border rounded-lg overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="bg-slate-200 dark:bg-slate-800 p-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 bg-slate-300 dark:bg-slate-700" />
              <Skeleton className="h-8 w-32 bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}
