/**
 * Customer Dashboard - Architecture Phase
 * 
 * STATUS: NOT IMPLEMENTED
 * PHASE: Architecture & Contract Definition Only
 * 
 * This is a placeholder route shell.
 * UI implementation is pending architecture approval.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerRealtime } from '@/hooks/useCustomerRealtime';

const CustomerDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Real-time synchronization for services and invoices
  const {
    isServicesConnected,
    isInvoicesConnected,
  } = useCustomerRealtime({
    userId: user?.id,
    tenantId: undefined, // TODO: Get from user profile
    enabled: !!user,
  });

  // Auth guard only - no UI
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <p className="text-muted-foreground text-lg">Customer Dashboard</p>
        <p className="text-sm text-muted-foreground/60 mt-2">Not implemented yet</p>
        <p className="text-xs text-muted-foreground/40 mt-4">Phase: Architecture & Contract Definition</p>
        {/* Real-time connection status (debug) */}
        <div className="mt-4 flex justify-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isServicesConnected ? 'bg-green-500' : 'bg-muted'}`} />
          <span className={`w-2 h-2 rounded-full ${isInvoicesConnected ? 'bg-green-500' : 'bg-muted'}`} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
