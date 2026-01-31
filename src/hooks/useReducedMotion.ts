/**
 * useReducedMotion Hook
 * Respects user's prefers-reduced-motion accessibility preference
 */

import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is available (SSR safety)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get motion-safe transition config
 * Returns reduced values when user prefers reduced motion
 */
export function getMotionConfig(prefersReducedMotion: boolean) {
  return {
    // Page transitions
    pageTransition: prefersReducedMotion
      ? { duration: 0, ease: 'linear' }
      : { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    
    // Row/item transitions
    rowTransition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.2, ease: 'easeOut' },
    
    // Highlight flash (realtime updates)
    highlightTransition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.6, ease: 'easeOut' },
    
    // Stagger children
    stagger: prefersReducedMotion ? 0 : 0.03,
  };
}

export default useReducedMotion;
