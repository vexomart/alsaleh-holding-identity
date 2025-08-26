import React from 'react';

// مكون SafeComponent يُستخدم كـ wrapper للمكونات التي تستخدم hooks
interface SafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SafeComponent: React.FC<SafeComponentProps> = ({ 
  children, 
  fallback = <div>جارٍ التحميل...</div> 
}) => {
  // استخدام try-catch للحماية من أخطاء hooks
  try {
    return <>{children}</>;
  } catch (error) {
    console.warn('SafeComponent caught error:', error);
    return <>{fallback}</>;
  }
};

// Hook آمن لـ useEffect
export const useSafeEffect = (effect: () => void | (() => void), deps?: React.DependencyList) => {
  React.useLayoutEffect(() => {
    try {
      return effect();
    } catch (error) {
      console.warn('SafeEffect error:', error);
    }
  }, deps);
};

// Hook آمن لـ useState
export const useSafeState = <T,>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] => {
  try {
    return React.useState(initialState);
  } catch (error) {
    console.warn('SafeState error:', error);
    const fallbackValue = typeof initialState === 'function' ? (initialState as () => T)() : initialState;
    return [fallbackValue, () => {}] as [T, React.Dispatch<React.SetStateAction<T>>];
  }
};

export default SafeComponent;