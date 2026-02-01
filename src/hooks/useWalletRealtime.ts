/**
 * useWalletRealtime Hook - PHASE WALLET-1
 * Real-time updates for wallet balance and transactions
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { 
  WalletEventPayload, 
  TransactionEventPayload, 
  BankTransferEventPayload 
} from '@/lib/payments/types';

interface UseWalletRealtimeOptions {
  userId?: string;
  tenantId?: string;
  enabled?: boolean;
  onWalletUpdated?: (payload: WalletEventPayload) => void;
  onTransactionCreated?: (payload: TransactionEventPayload) => void;
  onTransactionUpdated?: (payload: TransactionEventPayload) => void;
  onBankTransferUpdated?: (payload: BankTransferEventPayload) => void;
}

interface UseWalletRealtimeReturn {
  isConnected: boolean;
  lastWalletEvent: WalletEventPayload | null;
  lastTransactionEvent: TransactionEventPayload | null;
  lastBankTransferEvent: BankTransferEventPayload | null;
}

export function useWalletRealtime(options: UseWalletRealtimeOptions): UseWalletRealtimeReturn {
  const {
    userId,
    tenantId,
    enabled = true,
    onWalletUpdated,
    onTransactionCreated,
    onTransactionUpdated,
    onBankTransferUpdated,
  } = options;

  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [lastWalletEvent, setLastWalletEvent] = useState<WalletEventPayload | null>(null);
  const [lastTransactionEvent, setLastTransactionEvent] = useState<TransactionEventPayload | null>(null);
  const [lastBankTransferEvent, setLastBankTransferEvent] = useState<BankTransferEventPayload | null>(null);
  
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Handle wallet balance changes via postgres_changes
  const handleWalletChange = useCallback((payload: Record<string, unknown>) => {
    const newRecord = payload.new as Record<string, unknown>;
    const oldRecord = payload.old as Record<string, unknown>;
    
    // Only process if this is for our user
    if (userId && newRecord?.customer_user_id !== userId) return;

    const event: WalletEventPayload = {
      event: 'wallet.balance_changed',
      wallet_id: newRecord?.id as string,
      user_id: newRecord?.customer_user_id as string,
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      balance: Number(newRecord?.balance),
      previous_balance: oldRecord ? Number(oldRecord.balance) : undefined,
    };

    setLastWalletEvent(event);
    onWalletUpdated?.(event);
    
    // Invalidate wallet queries
    queryClient.invalidateQueries({ queryKey: ['wallet'] });
    queryClient.invalidateQueries({ queryKey: ['customer-wallet'] });
  }, [userId, tenantId, onWalletUpdated, queryClient]);

  // Handle transaction changes
  const handleTransactionChange = useCallback((payload: Record<string, unknown>) => {
    const newRecord = payload.new as Record<string, unknown>;
    const oldRecord = payload.old as Record<string, unknown>;
    const eventType = payload.eventType as string;

    // Only process if this is for our user
    if (userId && newRecord?.customer_user_id !== userId) return;

    const event: TransactionEventPayload = {
      event: eventType === 'INSERT' ? 'transaction.created' : 'transaction.updated',
      transaction_id: newRecord?.id as string,
      user_id: newRecord?.customer_user_id as string,
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      amount: Number(newRecord?.amount),
      status: newRecord?.status as string,
      previous_status: oldRecord?.status as string | undefined,
    };

    setLastTransactionEvent(event);
    
    if (eventType === 'INSERT') {
      onTransactionCreated?.(event);
    } else {
      onTransactionUpdated?.(event);
    }

    // Invalidate transaction queries
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['customer-transactions'] });
  }, [userId, tenantId, onTransactionCreated, onTransactionUpdated, queryClient]);

  // Handle bank transfer changes
  const handleBankTransferChange = useCallback((payload: Record<string, unknown>) => {
    const newRecord = payload.new as Record<string, unknown>;
    const eventType = payload.eventType as string;

    // Only process if this is for our user
    if (userId && newRecord?.user_id !== userId) return;

    const status = newRecord?.status as string;
    let eventName: BankTransferEventPayload['event'] = 'bank_transfer.submitted';
    
    if (status === 'under_review') eventName = 'bank_transfer.under_review';
    else if (status === 'approved') eventName = 'bank_transfer.approved';
    else if (status === 'rejected') eventName = 'bank_transfer.rejected';
    else if (eventType === 'INSERT') eventName = 'bank_transfer.submitted';

    const event: BankTransferEventPayload = {
      event: eventName,
      transfer_id: newRecord?.id as string,
      user_id: newRecord?.user_id as string,
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      amount: Number(newRecord?.amount),
      status,
    };

    setLastBankTransferEvent(event);
    onBankTransferUpdated?.(event);

    // Invalidate bank transfer queries
    queryClient.invalidateQueries({ queryKey: ['bank-transfers'] });
  }, [userId, tenantId, onBankTransferUpdated, queryClient]);

  useEffect(() => {
    if (!enabled || !userId) return;

    const channelName = `wallet-realtime-${userId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_wallets',
          filter: `customer_user_id=eq.${userId}`,
        },
        handleWalletChange
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_transactions',
          filter: `customer_user_id=eq.${userId}`,
        },
        handleTransactionChange
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bank_transfer_requests',
          filter: `user_id=eq.${userId}`,
        },
        handleBankTransferChange
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, enabled, handleWalletChange, handleTransactionChange, handleBankTransferChange]);

  return {
    isConnected,
    lastWalletEvent,
    lastTransactionEvent,
    lastBankTransferEvent,
  };
}

/**
 * Broadcast wallet event to admin dashboard
 */
export async function broadcastWalletEvent(
  tenantId: string | undefined,
  event: WalletEventPayload
): Promise<void> {
  const channelName = tenantId ? `admin-wallet-${tenantId}` : 'admin-wallet-global';
  
  const channel = supabase.channel(channelName);
  await channel.send({
    type: 'broadcast',
    event: event.event,
    payload: event,
  });
}

/**
 * Broadcast transaction event
 */
export async function broadcastTransactionEvent(
  tenantId: string | undefined,
  event: TransactionEventPayload
): Promise<void> {
  const channelName = tenantId ? `admin-transactions-${tenantId}` : 'admin-transactions-global';
  
  const channel = supabase.channel(channelName);
  await channel.send({
    type: 'broadcast',
    event: event.event,
    payload: event,
  });
}

/**
 * Broadcast bank transfer event
 */
export async function broadcastBankTransferEvent(
  tenantId: string | undefined,
  event: BankTransferEventPayload
): Promise<void> {
  const channelName = tenantId ? `admin-bank-transfers-${tenantId}` : 'admin-bank-transfers-global';
  
  const channel = supabase.channel(channelName);
  await channel.send({
    type: 'broadcast',
    event: event.event,
    payload: event,
  });
}
