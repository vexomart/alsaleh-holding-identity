// Responsive utility functions and hooks

import { useState, useEffect } from 'react';

// Breakpoint definitions that match Tailwind CSS
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1600,
  '4xl': 1920,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook to get current screen size
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    currentBreakpoint: Breakpoint;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    currentBreakpoint: 'lg',
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < breakpoints.md;
      const isTablet = width >= breakpoints.md && width < breakpoints.lg;
      const isDesktop = width >= breakpoints.lg;
      
      let currentBreakpoint: Breakpoint = 'xs';
      if (width >= breakpoints['4xl']) currentBreakpoint = '4xl';
      else if (width >= breakpoints['3xl']) currentBreakpoint = '3xl';
      else if (width >= breakpoints['2xl']) currentBreakpoint = '2xl';
      else if (width >= breakpoints.xl) currentBreakpoint = 'xl';
      else if (width >= breakpoints.lg) currentBreakpoint = 'lg';
      else if (width >= breakpoints.md) currentBreakpoint = 'md';
      else if (width >= breakpoints.sm) currentBreakpoint = 'sm';

      setScreenSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        currentBreakpoint,
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

// Hook to check if current screen matches a breakpoint
export function useBreakpoint(breakpoint: Breakpoint) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const checkMatch = () => {
      setMatches(window.innerWidth >= breakpoints[breakpoint]);
    };

    checkMatch();
    window.addEventListener('resize', checkMatch);
    return () => window.removeEventListener('resize', checkMatch);
  }, [breakpoint]);

  return matches;
}

// Responsive class generator
export function responsive(classes: {
  default?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  '3xl'?: string;
  '4xl'?: string;
}): string {
  const classArray: string[] = [];
  
  if (classes.default) classArray.push(classes.default);
  if (classes.xs) classArray.push(`xs:${classes.xs}`);
  if (classes.sm) classArray.push(`sm:${classes.sm}`);
  if (classes.md) classArray.push(`md:${classes.md}`);
  if (classes.lg) classArray.push(`lg:${classes.lg}`);
  if (classes.xl) classArray.push(`xl:${classes.xl}`);
  if (classes['2xl']) classArray.push(`2xl:${classes['2xl']}`);
  if (classes['3xl']) classArray.push(`3xl:${classes['3xl']}`);
  if (classes['4xl']) classArray.push(`4xl:${classes['4xl']}`);
  
  return classArray.join(' ');
}

// Touch and gesture utilities
export function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

// Performance optimizations for mobile
export function optimizeForMobile() {
  if (typeof window === 'undefined') return;

  // Prevent zoom on input focus
  const preventZoom = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
        
        setTimeout(() => {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
          );
        }, 100);
      }
    }
  };

  document.addEventListener('focusin', preventZoom);
  document.addEventListener('focusout', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
      );
    }
  });

  return () => {
    document.removeEventListener('focusin', preventZoom);
  };
}

// Orientation utilities
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
}

// Safe area utilities for modern devices
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}

// Responsive image sizes helper
export function getResponsiveImageSizes(sizes: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  xl?: number;
}): string {
  const sizeArray: string[] = [];
  
  if (sizes.mobile) sizeArray.push(`(max-width: ${breakpoints.md}px) ${sizes.mobile}px`);
  if (sizes.tablet) sizeArray.push(`(max-width: ${breakpoints.lg}px) ${sizes.tablet}px`);
  if (sizes.desktop) sizeArray.push(`(max-width: ${breakpoints.xl}px) ${sizes.desktop}px`);
  if (sizes.xl) sizeArray.push(`${sizes.xl}px`);
  
  return sizeArray.join(', ');
}

// Device detection
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < breakpoints.md) return 'mobile';
  if (width < breakpoints.lg) return 'tablet';
  return 'desktop';
}

// Performance monitoring for responsive layout
export function measureLayoutShift(callback: (cls: number) => void) {
  if (typeof window === 'undefined') return;

  let cls = 0;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
        cls += (entry as any).value;
      }
    }
    callback(cls);
  });

  observer.observe({ type: 'layout-shift', buffered: true });
  
  return () => observer.disconnect();
}