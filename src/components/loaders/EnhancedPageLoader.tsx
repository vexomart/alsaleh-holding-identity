/**
 * Enhanced Page Loader
 * Professional loading component with multiple variants
 * Optimized for First Paint performance
 */

import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface EnhancedPageLoaderProps {
  /** Loader variant */
  variant?: "minimal" | "branded" | "skeleton" | "pulse";
  /** Show text */
  showText?: boolean;
  /** Custom text */
  text?: string;
  /** Full screen overlay */
  fullScreen?: boolean;
  /** Minimum display time to prevent flash */
  minDisplayTime?: number;
}

/**
 * Minimal spinner loader (fastest to render)
 */
const MinimalLoader = memo(() => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
));
MinimalLoader.displayName = "MinimalLoader";

/**
 * Branded loader with logo
 */
const BrandedLoader = memo(({ text }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-4">
    {/* Logo placeholder - lightweight */}
    <div className="relative">
      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
        <span className="text-primary-foreground font-black text-xl">ASH</span>
      </div>
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" />
    </div>
    
    {/* Loading bar */}
    <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-l from-primary to-accent animate-[loading-bar_1.5s_ease-in-out_infinite]" />
    </div>
    
    {text && (
      <p className="text-muted-foreground text-sm font-medium animate-pulse">
        {text}
      </p>
    )}
  </div>
));
BrandedLoader.displayName = "BrandedLoader";

/**
 * Skeleton loader (content-aware)
 */
const SkeletonLoader = memo(() => (
  <div className="w-full max-w-md space-y-4 p-4">
    <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
    </div>
  </div>
));
SkeletonLoader.displayName = "SkeletonLoader";

/**
 * Pulse dots loader
 */
const PulseLoader = memo(() => (
  <div className="flex items-center gap-2">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={cn(
          "w-3 h-3 rounded-full bg-primary",
          "animate-bounce"
        )}
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
));
PulseLoader.displayName = "PulseLoader";

/**
 * Main Enhanced Page Loader component
 */
export const EnhancedPageLoader = memo(({
  variant = "branded",
  showText = true,
  text = "جارٍ التحميل...",
  fullScreen = true,
  minDisplayTime = 0
}: EnhancedPageLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (minDisplayTime > 0) {
      const timer = setTimeout(() => setShowLoader(false), minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [minDisplayTime]);

  if (!showLoader && minDisplayTime > 0) return null;

  const LoaderComponent = {
    minimal: MinimalLoader,
    branded: () => <BrandedLoader text={showText ? text : undefined} />,
    skeleton: SkeletonLoader,
    pulse: PulseLoader
  }[variant];

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background",
        fullScreen ? "min-h-screen fixed inset-0 z-50" : "min-h-[200px]"
      )}
      role="status"
      aria-label="جارٍ التحميل"
    >
      <LoaderComponent />
    </div>
  );
});
EnhancedPageLoader.displayName = "EnhancedPageLoader";

/**
 * Inline loader for smaller sections
 */
export const InlineLoader = memo(({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3"
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className={cn(
          "border-primary/30 border-t-primary rounded-full animate-spin",
          sizeClasses[size]
        )}
      />
    </div>
  );
});
InlineLoader.displayName = "InlineLoader";

/**
 * Route transition loader (optimized for route changes)
 */
export const RouteLoader = memo(() => (
  <EnhancedPageLoader 
    variant="minimal" 
    showText={false}
    fullScreen={true}
  />
));
RouteLoader.displayName = "RouteLoader";

export default EnhancedPageLoader;
