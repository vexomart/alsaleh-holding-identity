/**
 * AnimatedNumber Component - PHASE WALLET-4
 * Lightweight count-up animation for balance updates
 * RTL-safe, respects prefers-reduced-motion
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({
  value,
  duration = 500,
  formatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  locale = 'en-US',
  className,
  prefix = '',
  suffix = '',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const animationRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || previousValue.current === value) {
      setDisplayValue(value);
      previousValue.current = value;
      return;
    }

    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();
    const animationDuration = Math.min(duration, 150); // Max 150ms for finance modules

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, reducedMotion]);

  const formattedValue = new Intl.NumberFormat(locale, formatOptions).format(displayValue);

  return (
    <span className={cn('tabular-nums', className)} dir="ltr">
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
