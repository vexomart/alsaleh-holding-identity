/**
 * useReducedMotion Hook
 * Respects user's prefers-reduced-motion accessibility preference
 * iOS-style motion system with Apple-quality timing
 */

import { useState, useEffect, useMemo } from 'react';

/**
 * iOS-style easing curves
 */
export const iosEasing = {
  default: [0.25, 0.1, 0.25, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  decel: [0, 0, 0.2, 1] as const,
  accel: [0.4, 0, 1, 1] as const,
  bounce: [0.68, -0.15, 0.265, 1.15] as const,
};

/**
 * iOS-style durations (in seconds)
 */
export const iosDuration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  slower: 0.45,
};

/**
 * Check if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Initial check for SSR safety
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get iOS-style motion config
 * Returns optimized values based on user preference
 */
export function useMotionConfig() {
  const reducedMotion = useReducedMotion();
  
  return useMemo(() => ({
    // Should animate at all?
    shouldAnimate: !reducedMotion,
    
    // Page transitions
    pageTransition: reducedMotion
      ? { duration: 0 }
      : { duration: iosDuration.normal, ease: iosEasing.decel },
    
    // Card/item hover
    hoverTransition: reducedMotion
      ? { duration: 0 }
      : { duration: iosDuration.fast, ease: iosEasing.spring },
    
    // Press feedback
    pressTransition: reducedMotion
      ? { duration: 0 }
      : { duration: iosDuration.instant, ease: iosEasing.default },
    
    // Stagger children
    stagger: reducedMotion ? 0 : 0.04,
    
    // Stagger container
    staggerContainer: reducedMotion
      ? {}
      : {
          staggerChildren: 0.04,
          delayChildren: 0.02,
        },
    
    // Scale on press
    pressScale: reducedMotion ? 1 : 0.97,
    
    // Hover lift
    hoverY: reducedMotion ? 0 : -2,
    
    // Slide distance
    slideDistance: reducedMotion ? 0 : 8,
  }), [reducedMotion]);
}

/**
 * Legacy config for backward compatibility
 */
export function getMotionConfig(prefersReducedMotion: boolean) {
  return {
    pageTransition: prefersReducedMotion
      ? { duration: 0, ease: 'linear' }
      : { duration: iosDuration.normal, ease: iosEasing.decel },
    
    rowTransition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: iosDuration.fast, ease: iosEasing.default },
    
    highlightTransition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.6, ease: iosEasing.decel },
    
    stagger: prefersReducedMotion ? 0 : 0.04,
  };
}

export default useReducedMotion;
