import { useState, useEffect, useMemo } from 'react';

interface UseVirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualList<T>(
  items: T[],
  options: UseVirtualListOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );

    const visibleStart = Math.max(0, startIndex - overscan);
    const visibleEnd = endIndex;

    return {
      items: items.slice(visibleStart, visibleEnd),
      startIndex: visibleStart,
      endIndex: visibleEnd,
      offsetY: visibleStart * itemHeight,
    };
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  const totalHeight = items.length * itemHeight;

  return {
    ...visibleItems,
    totalHeight,
    setScrollTop,
  };
}