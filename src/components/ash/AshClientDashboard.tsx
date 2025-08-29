import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CreditCard,
  History,
  RefreshCw,
  Plus,
  Download,
  User,
  Settings,
  LogOut,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAsh } from './AshLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WalletInfo {
  balance: number;
  currency: string;
  is_active: boolean;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
  balance_before: number;
  balance_after: number;
}

export const AshClientDashboard: React.FC = () => {
  const { user, logout } = useAsh();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // حالات النماذج
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [processingDeposit, setProcessingDeposit] = useState(false);
  const [processingWithdraw, setProcessingWithdraw] = useState(false);

  // جلب بيانات المحفظة
  const fetchWalletData = async () => {
    if (!user?.id) return;

    try {
      // جلب رصيد المحفظة
      const { data: walletData, error: walletError } = await supabase.functions.invoke('ash-wallet', {
        body: {
          action: 'get-balance',
          user_id: user.id
        }
      });

      if (walletError) throw walletError;

      setWallet(walletData);

      // جلب المعاملات
      const { data: transactionsData, error: transError } = await supabase.functions.invoke('ash-wallet', {
        body: {
          action: 'get-transactions',
          user_id: user.id
        }
      });

      if (transError) throw transError;

      setTransactions(transactionsData.transactions || []);

    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      toast.error('خطأ في جلب بيانات المحفظة');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // إعادة تحديث البيانات
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
  };

  // معالجة طلب الإيداع
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('يرجى إدخال مبلغ صحيح');
      return;
    }

    setProcessingDeposit(true);
    try {
      const { data, error } = await supabase.functions.invoke('ash-wallet', {
        body: {
          action: 'deposit',
          user_id: user?.id,
          amount: parseFloat(depositAmount),
          description: depositDescription || 'طلب إيداع من العميل'
        }
      });

      if (error) throw error;

      toast.success(data.message);
      setShowDepositForm(false);
      setDepositAmount('');
      setDepositDescription('');
      await fetchWalletData();
    } catch (error: any) {
      toast.error(error.message || 'خطأ في معالجة طلب الإيداع');
    } finally {
      setProcessingDeposit(false);
    }
  };

  // معالجة طلب السحب
  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (wallet && parseFloat(withdrawAmount) > wallet.balance) {
      toast.error('المبلغ أكبر من الرصيد المتاح');
      return;
    }

    setProcessingWithdraw(true);
    try {
      const { data, error } = await supabase.functions.invoke('ash-wallet', {
        body: {
          action: 'withdraw',
          user_id: user?.id,
          amount: parseFloat(withdrawAmount),
          description: withdrawDescription || 'طلب سحب من العميل'
        }
      });

      if (error) throw error;

      toast.success(data.message);
      setShowWithdrawForm(false);
      setWithdrawAmount('');
      setWithdrawDescription('');
      await fetchWalletData();
    } catch (error: any) {
      toast.error(error.message || 'خطأ في معالجة طلب السحب');
    } finally {
      setProcessingWithdraw(false);
    }
  };

  useEffect(() => {
    fetchWalletData();

    // إعداد المزامنة اللحظية للمحفظة
    const channel = supabase
      .channel('client_wallet')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'ash_wallet_transactions',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          console.log('Wallet updated, refreshing...');
          fetchWalletData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'withdraw': return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default: return <RefreshCw className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTransactionText = (type: string) => {
    switch (type) {
      case 'deposit': return 'إيداع';
      case 'withdraw': return 'سحب';
      case 'charge': return 'خصم';
      case 'refund': return 'استرداد';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">معتمد</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">قيد المراجعة</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          جارٍ تحميل محفظتك...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">محفظة ASH HOLDING</h1>
          <p className="text-white/70 mt-1">مرحباً {user?.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Bell className="w-4 h-4 ml-2" />
            الإشعارات
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4 ml-2" />
            الإعدادات
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={logout}
            className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </motion.div>

      {/* Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-white/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  رصيد المحفظة
                </CardTitle>
                <CardDescription className="text-white/70">
                  حسابك الرقمي في ASH HOLDING
                </CardDescription>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-4xl font-bold text-white mb-2">
                  {showBalance ? (
                    `${wallet?.balance.toLocaleString() || 0} ${wallet?.currency || 'ر.س'}`
                  ) : (
                    '••••••'
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`${wallet?.is_active ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}
                  >
                    {wallet?.is_active ? 'نشط' : 'معطل'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog open={showDepositForm} onOpenChange={setShowDepositForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50">
                      <Plus className="w-4 h-4 ml-2" />
                      إيداع
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900/95 border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle>طلب إيداع</DialogTitle>
                      <DialogDescription className="text-white/70">
                        أدخل مبلغ الإيداع المطلوب
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">المبلغ (ر.س)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="bg-white/10 border-white/30 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-white">وصف الإيداع (اختياري)</Label>
                        <Textarea
                          placeholder="أدخل وصف للإيداع..."
                          value={depositDescription}
                          onChange={(e) => setDepositDescription(e.target.value)}
                          className="bg-white/10 border-white/30 text-white"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleDeposit}
                          disabled={processingDeposit}
                          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50"
                        >
                          {processingDeposit ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                              جارٍ المعالجة...
                            </div>
                          ) : (
                            'إرسال طلب الإيداع'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDepositForm(false)}
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showWithdrawForm} onOpenChange={setShowWithdrawForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20">
                      <ArrowDownRight className="w-4 h-4 ml-2" />
                      سحب
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900/95 border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle>طلب سحب</DialogTitle>
                      <DialogDescription className="text-white/70">
                        أدخل مبلغ السحب المطلوب (الرصيد المتاح: {wallet?.balance.toLocaleString()} ر.س)
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">المبلغ (ر.س)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          max={wallet?.balance}
                          className="bg-white/10 border-white/30 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-white">وصف السحب (اختياري)</Label>
                        <Textarea
                          placeholder="أدخل وصف للسحب..."
                          value={withdrawDescription}
                          onChange={(e) => setWithdrawDescription(e.target.value)}
                          className="bg-white/10 border-white/30 text-white"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleWithdraw}
                          disabled={processingWithdraw}
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/50"
                        >
                          {processingWithdraw ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                              جارٍ المعالجة...
                            </div>
                          ) : (
                            'إرسال طلب السحب'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowWithdrawForm(false)}
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <History className="w-6 h-6" />
                  سجل المعاملات
                </CardTitle>
                <CardDescription className="text-white/70">
                  آخر {transactions.length} معاملة في محفظتك
                </CardDescription>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {transactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white/10">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{getTransactionText(transaction.type)}</span>
                          <span className="text-white/60">•</span>
                          <span className="text-white/80">{transaction.description}</span>
                        </div>
                        <div className="text-sm text-white/60">
                          {new Date(transaction.created_at).toLocaleDateString('ar-SA')} في{' '}
                          {new Date(transaction.created_at).toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <div className={`font-bold ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toLocaleString()} ر.س
                        </div>
                        <div className="text-sm text-white/60">
                          الرصيد: {transaction.balance_after?.toLocaleString()} ر.س
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {transactions.length === 0 && (
                <div className="text-center py-12 text-white/60">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد معاملات حتى الآن</h3>
                  <p>ابدأ باستخدام محفظتك عبر إجراء أول معاملة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};