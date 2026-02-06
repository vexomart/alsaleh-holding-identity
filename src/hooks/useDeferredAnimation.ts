/**
 * Deferred Animation Hook
 * Delays animations until after First Paint and idle time
 * Critical for performance optimization
 */

import { useState, useEffect, useCallback, useRef } from "react";

interface UseDeferredAnimationOptions {
  /** Minimum delay before enabling animations (ms) */
  minDelay?: number;
  /** Wait for requestIdleCallback before enabling */
  waitForIdle?: boolean;
  /** Only enable on viewport intersection */
  waitForIntersection?: boolean;
}

/**
 * Hook to defer animations until after First Paint
 * Returns boolean indicating if animations should be enabled
 */
export const useDeferredAnimation = (
  options: UseDeferredAnimationOptions = {}
): boolean => {
  const { 
    minDelay = 100, 
    waitForIdle = true,
    waitForIntersection = false 
  } = options;
  
  const [isReady, setIsReady] = useState(false);
  const hasFirstPaint = useRef(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    
    if (prefersReducedMotion) {
      // Don't enable animations at all
      return;
    }

    // Wait for minimum delay after mount
    const timeoutId = setTimeout(() => {
      hasFirstPaint.current = true;
      
      if (waitForIdle && "requestIdleCallback" in window) {
        // Wait for browser idle
        requestIdleCallback(
          () => setIsReady(true),
          { timeout: 500 }
        );
      } else {
        // Fallback to next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsReady(true);
          });
        });
      }
    }, minDelay);

    return () => clearTimeout(timeoutId);
  }, [minDelay, waitForIdle]);

  return isReady;
};

/**
 * Hook for lazy animations that only activate on intersection
 */
export const useLazyAnimation = (
  elementRef: React.RefObject<Element>,
  options: UseDeferredAnimationOptions = {}
): boolean => {
  const { minDelay = 50 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px"
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  useEffect(() => {
    if (!isVisible) return;

    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, minDelay);

    return () => clearTimeout(timeoutId);
  }, [isVisible, minDelay]);

  return isReady;
};

/**
 * Hook to batch and throttle animations for better performance
 */
export const useBatchedAnimation = (
  delay: number = 0,
  batchSize: number = 3
): { isReady: boolean; batchIndex: number } => {
  const [batchIndex, setBatchIndex] = useState(-1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startDelay = delay;
    const batchDelay = 100; // Delay between batches

    // Initial delay
    const initialTimeout = setTimeout(() => {
      setIsReady(true);
      
      // Batch processing
      let currentBatch = 0;
      const processBatch = () => {
        setBatchIndex(currentBatch);
        currentBatch++;
        
        if (currentBatch < batchSize) {
          setTimeout(processBatch, batchDelay);
        }
      };
      
      processBatch();
    }, startDelay);

    return () => clearTimeout(initialTimeout);
  }, [delay, batchSize]);

  return { isReady, batchIndex };
};

/**
 * Hook to detect if device should have reduced animations
 */
export const useShouldReduceAnimations = (): boolean => {
  const [shouldReduce, setShouldReduce] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    
    // Check device capabilities
    const isLowEndDevice = 
      navigator.hardwareConcurrency <= 2 ||
      (navigator as any).deviceMemory <= 2;
    
    // Check connection speed
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && 
      (connection.effectiveType === "2g" || connection.saveData);

    setShouldReduce(prefersReduced || isLowEndDevice || isSlowConnection);
  }, []);

  return shouldReduce;
};

/**
 * Animation variants optimized for performance
 * Use these instead of custom variants for common patterns
 */
export const optimizedAnimationVariants = {
  // Fade only (best performance)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  // Fade + slight scale (good performance)
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  },
  
  // Fade + slide (moderate performance)
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  },
  
  // Stagger container (for lists)
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },
  
  // Stagger item (for list children)
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  }
};

export default useDeferredAnimation;
