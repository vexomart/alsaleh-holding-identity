/**
 * iOS-Like Animated Components
 * Smooth, stable, Apple-quality animations
 */

import { ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence, Variants, HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

// iOS timing functions
const iosEasing = {
  default: [0.25, 0.1, 0.25, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  decel: [0, 0, 0.2, 1] as const,
  accel: [0.4, 0, 1, 1] as const,
};

// iOS durations (in seconds)
const iosDuration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
};

// Variants for different animation types
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: iosDuration.normal,
      ease: iosEasing.decel,
    },
  },
};

// Types
interface IOSAnimatedProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  delay?: number;
  duration?: keyof typeof iosDuration;
}

interface IOSStaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

interface IOSPresenceProps {
  children: ReactNode;
  show: boolean;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  className?: string;
}

interface IOSPressableProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  className?: string;
  scale?: number;
}

/**
 * iOS-style animated container
 * Respects reduced motion preferences
 */
export const IOSAnimated = forwardRef<HTMLDivElement, IOSAnimatedProps>(
  ({ children, className, animation = 'slide-up', delay = 0, duration = 'normal', ...props }, ref) => {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = {
      fade: fadeVariants,
      'slide-up': slideUpVariants,
      'slide-down': slideDownVariants,
      scale: scaleVariants,
    }[animation];

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{
          duration: iosDuration[duration],
          delay,
          ease: iosEasing.decel,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

IOSAnimated.displayName = 'IOSAnimated';

/**
 * iOS-style stagger container
 * Children animate in sequence
 */
export function IOSStagger({ children, className, delay = 0 }: IOSStaggerProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * iOS-style stagger item
 * Use inside IOSStagger
 */
export function IOSStaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}

/**
 * iOS-style presence animation
 * For mount/unmount transitions
 */
export function IOSPresence({ children, show, animation = 'fade', className }: IOSPresenceProps) {
  const reducedMotion = useReducedMotion();

  const variants = {
    fade: fadeVariants,
    'slide-up': slideUpVariants,
    'slide-down': slideDownVariants,
    scale: scaleVariants,
  }[animation];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className={className}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          exit={reducedMotion ? undefined : 'exit'}
          variants={variants}
          transition={{
            duration: reducedMotion ? 0 : iosDuration.fast,
            ease: iosEasing.default,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * iOS-style pressable button
 * Native press feedback
 */
export const IOSPressable = forwardRef<HTMLButtonElement, IOSPressableProps>(
  ({ children, className, scale = 0.97, ...props }, ref) => {
    const reducedMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        className={cn(
          'touch-manipulation select-none',
          className
        )}
        whileTap={reducedMotion ? undefined : { scale }}
        transition={{
          duration: iosDuration.instant,
          ease: iosEasing.default,
        }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

IOSPressable.displayName = 'IOSPressable';

/**
 * iOS-style card with hover/tap effects
 */
export function IOSCard({ 
  children, 
  className,
  interactive = true,
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  interactive?: boolean;
} & HTMLMotionProps<'div'>) {
  const reducedMotion = useReducedMotion();

  if (!interactive || reducedMotion) {
    return (
      <div className={cn('rounded-xl bg-card', className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn('rounded-xl bg-card cursor-pointer', className)}
      whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.99, y: 0 }}
      transition={{
        duration: iosDuration.fast,
        ease: iosEasing.spring,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * iOS-style page wrapper
 * Animates page content on mount
 */
export function IOSPage({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: iosDuration.normal,
        ease: iosEasing.decel,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * iOS-style list animation
 * For rendering lists with staggered animation
 */
export function IOSList<T>({ 
  items, 
  renderItem,
  keyExtractor,
  className,
  itemClassName,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  itemClassName?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={keyExtractor(item, index)} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
    >
      {items.map((item, index) => (
        <motion.div
          key={keyExtractor(item, index)}
          className={itemClassName}
          variants={staggerItemVariants}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * iOS-style skeleton loader
 */
export function IOSSkeleton({ 
  className,
  variant = 'rect',
}: { 
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}) {
  return (
    <div 
      className={cn(
        'ios-skeleton',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-4 rounded',
        className
      )} 
    />
  );
}

/**
 * iOS-style shimmer effect
 */
export function IOSShimmer({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export default {
  IOSAnimated,
  IOSStagger,
  IOSStaggerItem,
  IOSPresence,
  IOSPressable,
  IOSCard,
  IOSPage,
  IOSList,
  IOSSkeleton,
  IOSShimmer,
};
