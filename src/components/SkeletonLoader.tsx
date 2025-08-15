import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height
}) => {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    rounded: 'rounded-lg'
  };

  const animationVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    wave: {
      x: ['-100%', '100%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear" as const
      }
    },
    none: undefined
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
      {...(animation !== 'none' && { animate: animationVariants[animation] })}
    />
  );
};

// Pre-built skeleton components
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-6 space-y-4", className)}>
    <Skeleton variant="circular" width={40} height={40} />
    <Skeleton variant="text" className="w-3/4" />
    <Skeleton variant="text" className="w-1/2" />
    <Skeleton variant="rectangular" height={120} />
    <div className="flex space-x-2">
      <Skeleton variant="rounded" width={80} height={32} />
      <Skeleton variant="rounded" width={80} height={32} />
    </div>
  </div>
);

export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className 
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        variant="text" 
        className={index === lines - 1 ? "w-2/3" : "w-full"}
      />
    ))}
  </div>
);

export const ImageSkeleton: React.FC<{ 
  width?: string | number; 
  height?: string | number;
  className?: string;
}> = ({ width = "100%", height = 200, className }) => (
  <Skeleton 
    variant="rounded"
    width={width}
    height={height}
    className={className}
  />
);

export const ButtonSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Skeleton 
    variant="rounded"
    width={120}
    height={40}
    className={className}
  />
);

export const NavigationSkeleton: React.FC = () => (
  <div className="flex items-center justify-between p-4">
    <Skeleton variant="rectangular" width={150} height={40} />
    <div className="flex space-x-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} variant="text" width={80} height={20} />
      ))}
    </div>
    <Skeleton variant="rounded" width={100} height={36} />
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="text-center space-y-6 py-20">
    <Skeleton variant="text" className="w-3/4 h-12 mx-auto" />
    <Skeleton variant="text" className="w-1/2 h-6 mx-auto" />
    <TextSkeleton lines={2} className="max-w-2xl mx-auto" />
    <div className="flex justify-center space-x-4 mt-8">
      <ButtonSkeleton />
      <ButtonSkeleton />
    </div>
  </div>
);

export const DepartmentsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);