/**
 * Entry Point - Instant Smart Routing
 * Ultra-fast redirect based on auth state
 * Zero unnecessary renders or delays
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Minimal loader during auth check
const FastLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function Entry() {
  const { user, isLoading, isAdmin } = useAuth();

  // Show minimal loader only during initial check
  if (isLoading) {
    return <FastLoader />;
  }

  // Not authenticated - go to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Authenticated - instant redirect based on role
  return <Navigate to={isAdmin ? '/adminash' : '/portal'} replace />;
}
