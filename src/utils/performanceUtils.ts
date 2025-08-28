// تحسينات الأداء المساعدة

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const isLowEndDevice = (): boolean => {
  const connection = (navigator as any).connection;
  const deviceMemory = (navigator as any).deviceMemory;
  
  return (
    navigator.hardwareConcurrency <= 2 ||
    deviceMemory <= 2 ||
    (connection && connection.effectiveType && connection.effectiveType.includes('2g')) ||
    /Android.*Chrome\/[1-8][0-9]/.test(navigator.userAgent)
  );
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const optimizeQueryClient = () => {
  return {
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 دقائق
        cacheTime: 10 * 60 * 1000, // 10 دقائق
        retry: (failureCount: number, error: any) => {
          if (failureCount < 2 && error.status !== 404) {
            return true;
          }
          return false;
        },
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
      },
    },
  };
};

export const measurePerformance = (name: string, fn: () => void) => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    if (measure.duration > 100) {
      console.warn(`أداء بطيء في ${name}: ${measure.duration}ms`);
    }
  } else {
    fn();
  }
};

export const batchUpdates = (updates: (() => void)[]): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      updates.forEach(update => update());
    });
  } else {
    setTimeout(() => {
      updates.forEach(update => update());
    }, 0);
  }
};