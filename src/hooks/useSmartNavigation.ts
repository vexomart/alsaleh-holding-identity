/**
 * Navigation Helper Hook
 * Smart navigation with loading states and confirmations
 */

import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface NavigationState {
  from?: string;
  returnTo?: string;
  data?: Record<string, unknown>;
}

export function useSmartNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [isNavigating, setIsNavigating] = useState(false);

  const goTo = useCallback((path: string, state?: NavigationState) => {
    setIsNavigating(true);
    navigate(path, { 
      state: { 
        ...state, 
        from: location.pathname 
      } 
    });
    // Reset after navigation
    setTimeout(() => setIsNavigating(false), 100);
  }, [navigate, location.pathname]);

  const goBack = useCallback(() => {
    const state = location.state as NavigationState | null;
    if (state?.from) {
      navigate(state.from);
    } else {
      navigate(-1);
    }
  }, [navigate, location.state]);

  const goToWithConfirm = useCallback((
    path: string, 
    message?: string,
    state?: NavigationState
  ) => {
    const defaultMessage = language === 'ar' 
      ? 'هل أنت متأكد من أنك تريد المغادرة؟'
      : 'Are you sure you want to leave?';
    
    if (window.confirm(message || defaultMessage)) {
      goTo(path, state);
      return true;
    }
    return false;
  }, [language, goTo]);

  const goToPortal = useCallback((section?: string) => {
    const path = section ? `/portal/${section}` : '/portal';
    goTo(path);
  }, [goTo]);

  const goToAdmin = useCallback((section?: string) => {
    const path = section ? `/adminash/${section}` : '/adminash';
    goTo(path);
  }, [goTo]);

  const goToAuth = useCallback((type: 'login' | 'register' | 'forgot-password' = 'login') => {
    goTo(`/auth/${type}`, { returnTo: location.pathname });
  }, [goTo, location.pathname]);

  const returnAfterAuth = useCallback(() => {
    const state = location.state as NavigationState | null;
    if (state?.returnTo) {
      navigate(state.returnTo, { replace: true });
    } else {
      navigate('/portal', { replace: true });
    }
  }, [navigate, location.state]);

  return {
    // State
    isNavigating,
    currentPath: location.pathname,
    previousPath: (location.state as NavigationState | null)?.from,
    
    // Navigation methods
    goTo,
    goBack,
    goToWithConfirm,
    
    // Shortcuts
    goToPortal,
    goToAdmin,
    goToAuth,
    returnAfterAuth,
  };
}

export default useSmartNavigation;
