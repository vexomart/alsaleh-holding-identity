import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

interface RealtimeWalletUpdatesProps {
  userId?: string;
  onTransactionUpdate?: (transaction: any) => void;
}

export const RealtimeWalletUpdates: React.FC<RealtimeWalletUpdatesProps> = ({ 
  userId, 
  onTransactionUpdate 
}) => {
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  useEffect(() => {
    // Subscribe to wallet transactions changes
    const walletChannel = supabase
      .channel('wallet_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_transactions',
          ...(userId && { filter: `user_id=eq.${userId}` })
        },
        (payload) => {
          console.log('Wallet transaction update:', payload);
          
          // Add transaction to recent list
          if (payload.eventType === 'INSERT') {
            const newTransaction = payload.new;
            setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 4)]);
            
            // Show toast notification
            toast({
              title: newTransaction.transaction_type === 'deposit' ? "تم إيداع رصيد" : "تم خصم رصيد",
              description: `المبلغ: ${newTransaction.amount} ريال - ${newTransaction.description}`,
              variant: newTransaction.transaction_type === 'deposit' ? 'default' : 'destructive'
            });
            
            // Call callback if provided
            if (onTransactionUpdate) {
              onTransactionUpdate(newTransaction);
            }
          }
          
          if (payload.eventType === 'UPDATE') {
            const updatedTransaction = payload.new;
            setRecentTransactions(prev => 
              prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
            );
            
            // Show status update toast
            if (updatedTransaction.status === 'completed') {
              toast({
                title: "تم تأكيد المعاملة",
                description: `المعاملة ${updatedTransaction.reference_id} تم تأكيدها`,
              });
            }
            
            if (onTransactionUpdate) {
              onTransactionUpdate(updatedTransaction);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_wallets',
          ...(userId && { filter: `user_id=eq.${userId}` })
        },
        (payload) => {
          console.log('Wallet balance update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            const updatedWallet = payload.new;
            const oldBalance = payload.old?.balance || 0;
            const newBalance = updatedWallet.balance;
            const difference = newBalance - oldBalance;
            
            if (Math.abs(difference) > 0) {
              toast({
                title: "تم تحديث رصيد المحفظة",
                description: `الرصيد الجديد: ${newBalance.toLocaleString()} ريال`,
              });
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'connecting');
      });

    // Set connected status after successful subscription
    setTimeout(() => {
      if (walletChannel.state === 'joined') {
        setConnectionStatus('connected');
      }
    }, 1000);

    return () => {
      supabase.removeChannel(walletChannel);
    };
  }, [userId, onTransactionUpdate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'متصل';
      case 'disconnected':
        return 'غير متصل';
      default:
        return 'جاري الاتصال...';
    }
  };

  const getTransactionStatusIcon = (transactionStatus: string) => {
    switch (transactionStatus) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 max-w-sm z-50">
      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-lg border p-3 mb-2"
      >
        <div className="flex items-center gap-2 text-sm">
          {getStatusIcon(connectionStatus)}
          <span className="font-medium">التحديث اللحظي: {getStatusText(connectionStatus)}</span>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <AnimatePresence>
        {recentTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg border p-3 mb-2"
          >
            <div className="flex items-start gap-3">
              {getTransactionStatusIcon(transaction.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {transaction.transaction_type === 'deposit' ? 'إيداع' : 'خصم'}
                  </span>
                  <span className={`text-sm font-bold ${
                    transaction.transaction_type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount.toLocaleString()} ريال
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(transaction.created_at).toLocaleTimeString('ar-SA')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};