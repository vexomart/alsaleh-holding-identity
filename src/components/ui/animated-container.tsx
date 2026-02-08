/**
 * AnimatedContainer Component - iOS-style Animations
 * RTL-safe page enter animations with Apple-quality timing
 * Respects prefers-reduced-motion
 */

import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion, iosDuration, iosEasing } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'fade';
}

const variants: Record<string, Variants> = {
  up: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

// RTL-safe: Using Y-axis only (no X transforms that would need RTL flip)
export function AnimatedContainer({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedContainerProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={variants[direction]}
      transition={{
        duration: iosDuration.normal,
        delay,
        ease: iosEasing.decel,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered children animation wrapper
 */
interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
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

export function AnimatedList({ children, className }: AnimatedListProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={listVariants}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
