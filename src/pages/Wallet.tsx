import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, History, CreditCard, Building2, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

interface WalletData {
  id: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  payment_method: string;
  payment_reference: string;
  status: string;
  created_at: string;
}

const WalletPage = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    { value: 'visa', label: 'فيزا', icon: CreditCard },
    { value: 'mastercard', label: 'ماستركارد', icon: CreditCard },
    { value: 'mada', label: 'مدى', icon: CreditCard },
    { value: 'stc_pay', label: 'STC Pay', icon: Smartphone },
    { value: 'bank_transfer', label: 'حوالة بنكية', icon: Building2 },
  ];

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from('customer_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        console.error('Wallet error:', walletError);
        return;
      }

      if (!walletData) {
        // Create wallet if doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from('customer_wallets')
          .insert({ user_id: user.id, balance: 0 })
          .select()
          .single();

        if (createError) {
          console.error('Create wallet error:', createError);
          return;
        }
        setWallet(newWallet);
      } else {
        setWallet(walletData);
      }

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) {
        console.error('Transactions error:', transactionsError);
      } else {
        setTransactions(transactionsData || []);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !paymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال المبلغ واختيار طريقة الدفع",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صالح",
        variant: "destructive"
      });
      return;
    }

    setDepositing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('wallet-deposit', {
        body: {
          amount,
          payment_method: paymentMethod,
          description: `شحن المحفظة بمبلغ ${amount} ريال سعودي`
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw response.error;
      }

      const { data } = response;
      if (data.success) {
        toast({
          title: "تم الشحن بنجاح",
          description: `تم شحن محفظتك بمبلغ ${amount} ريال سعودي`
        });
        
        setDepositAmount('');
        setPaymentMethod('');
        setIsDepositOpen(false);
        await fetchWalletData();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "خطأ في الشحن",
        description: "حدث خطأ أثناء شحن المحفظة، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setDepositing(false);
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    const types = {
      deposit: 'إيداع',
      withdrawal: 'سحب',
      payment: 'دفع',
      refund: 'استرداد'
    };
    return types[type as keyof typeof types] || type;
  };

  const getTransactionColor = (type: string) => {
    const colors = {
      deposit: 'bg-green-100 text-green-800',
      withdrawal: 'bg-red-100 text-red-800',
      payment: 'bg-blue-100 text-blue-800',
      refund: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-background via-muted/30 to-muted/50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-background via-muted/30 to-muted/50" dir="rtl">
      <SEO 
        title="محفظة العميل - شحن الحساب"
        description="إدارة محفظتك الإلكترونية وشحن حسابك بسهولة وأمان"
      />
      
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" />
            محفظتي الإلكترونية
          </h1>
          <p className="text-muted-foreground">
            إدارة رصيدك وتتبع معاملاتك المالية
          </p>
        </div>

        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">رصيد المحفظة</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-5xl font-bold text-primary">
              {wallet?.balance?.toFixed(2) || '0.00'} <span className="text-2xl">ريال</span>
            </div>
            <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                  <Plus className="h-5 w-5 ml-2" />
                  شحن المحفظة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-center">شحن المحفظة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">المبلغ (ريال سعودي)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="أدخل المبلغ المراد شحنه"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>طريقة الدفع</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center gap-2">
                              <method.icon className="h-4 w-4" />
                              {method.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleDeposit} 
                    disabled={depositing || !depositAmount || !paymentMethod}
                    className="w-full"
                  >
                    {depositing ? 'جاري الشحن...' : 'تأكيد الشحن'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              سجل المعاملات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد معاملات حتى الآن</p>
                <p className="text-sm">ابدأ بشحن محفظتك لتظهر المعاملات هنا</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getTransactionColor(transaction.transaction_type)}>
                          {getTransactionTypeLabel(transaction.transaction_type)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {transaction.payment_method}
                        </span>
                      </div>
                      <p className="text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-left space-y-1">
                      <div className={`text-lg font-bold ${
                        transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                        {transaction.amount.toFixed(2)} ريال
                      </div>
                      <div className="text-xs text-muted-foreground">
                        الرصيد: {transaction.balance_after.toFixed(2)} ريال
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;