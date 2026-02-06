/**
 * Professional Page Skeleton System
 * Enterprise-grade loading states for all page types
 */

import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Base skeleton with shimmer effect
const ShimmerSkeleton = memo(({ className }: { className?: string }) => (
  <div className={cn("relative overflow-hidden bg-muted rounded-md", className)}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
));
ShimmerSkeleton.displayName = "ShimmerSkeleton";

// Hero Section Skeleton
export const HeroSkeleton = memo(() => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
    {/* Background placeholder */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60" />
    
    <div className="relative z-10 container mx-auto px-4 text-center">
      {/* Badge */}
      <div className="flex justify-center mb-8">
        <Skeleton className="h-10 w-48 rounded-full bg-white/10" />
      </div>
      
      {/* Title */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-16 md:h-20 w-3/4 mx-auto bg-white/10 rounded-lg" />
        <Skeleton className="h-2 w-32 mx-auto bg-white/20 rounded-full" />
      </div>
      
      {/* Subtitle */}
      <div className="space-y-3 mb-10">
        <Skeleton className="h-6 w-2/3 mx-auto bg-white/10" />
        <Skeleton className="h-5 w-1/2 mx-auto bg-white/5" />
      </div>
      
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Skeleton className="h-14 w-48 rounded-xl bg-white/10" />
        <Skeleton className="h-14 w-48 rounded-xl bg-white/5" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 backdrop-blur rounded-2xl p-6">
            <Skeleton className="h-12 w-12 rounded-xl mx-auto mb-3 bg-white/10" />
            <Skeleton className="h-8 w-20 mx-auto mb-2 bg-white/10" />
            <Skeleton className="h-4 w-16 mx-auto bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  </div>
));
HeroSkeleton.displayName = "HeroSkeleton";

// Section Skeleton (generic)
export const SectionSkeleton = memo(({ rows = 3 }: { rows?: number }) => (
  <section className="py-16 lg:py-24 bg-background">
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-32 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 max-w-full mx-auto" />
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: rows * 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border">
            <Skeleton className="h-12 w-12 rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  </section>
));
SectionSkeleton.displayName = "SectionSkeleton";

// Services Grid Skeleton
export const ServicesGridSkeleton = memo(() => (
  <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950">
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <Skeleton className="h-6 w-40 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-12 w-72 mx-auto mb-4" />
        <Skeleton className="h-4 w-80 max-w-full mx-auto" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
            <Skeleton className="h-5 w-5 mx-auto mb-2" />
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-border min-h-[140px]">
            <Skeleton className="h-12 w-12 rounded-xl mx-auto mb-3" />
            <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-5 w-16 mx-auto rounded-full" />
          </div>
        ))}
      </div>
      
      {/* CTA */}
      <div className="text-center mt-12">
        <Skeleton className="h-14 w-48 mx-auto rounded-xl" />
      </div>
    </div>
  </section>
));
ServicesGridSkeleton.displayName = "ServicesGridSkeleton";

// Footer Skeleton
export const FooterSkeleton = memo(() => (
  <footer className="bg-slate-900 py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i}>
            <Skeleton className="h-6 w-24 mb-4 bg-white/10" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-4 w-20 bg-white/5" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </footer>
));
FooterSkeleton.displayName = "FooterSkeleton";

// Full Page Skeleton (combines all)
export const FullPageSkeleton = memo(() => (
  <div className="min-h-screen bg-background">
    <HeroSkeleton />
    <ServicesGridSkeleton />
    <SectionSkeleton rows={2} />
    <FooterSkeleton />
  </div>
));
FullPageSkeleton.displayName = "FullPageSkeleton";

// Dashboard Skeleton
export const DashboardSkeleton = memo(() => (
  <div className="min-h-screen bg-background p-4 lg:p-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    
    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card rounded-xl p-6 border border-border">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
    
    {/* Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
      <div className="bg-card rounded-xl p-6 border border-border">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  </div>
));
DashboardSkeleton.displayName = "DashboardSkeleton";

// Simple Page Skeleton
export const SimplePageSkeleton = memo(() => (
  <div className="min-h-screen bg-background">
    {/* Navigation placeholder */}
    <div className="h-16 bg-card border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-12 w-64 mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  </div>
));
SimplePageSkeleton.displayName = "SimplePageSkeleton";

export { ShimmerSkeleton };
