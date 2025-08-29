import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, History, CreditCard, Building2, Smartphone, Copy, Eye, ArrowUpCircle, ArrowDownCircle, TrendingUp, User, Shield, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NumberFormatter } from '@/components/NumberFormatter';
import SEO from '@/components/SEO';

interface WalletData {
  id: string;
  balance: number;
  currency: string;
  user_id: string;
}

interface UserProfile {
  id: string;
  full_name?: string;
  client_id?: string;
  email?: string;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [accountNumberVisible, setAccountNumberVisible] = useState(false);
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

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile({
        id: user.id,
        full_name: profileData?.full_name,
        client_id: profileData?.client_id,
        email: user.email
      });

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
      deposit: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      withdrawal: 'bg-rose-50 text-rose-700 border-rose-200',
      payment: 'bg-blue-50 text-blue-700 border-blue-200',
      refund: 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const generateAccountNumber = (userId: string, clientId?: string) => {
    if (clientId) return clientId;
    return `ACC${userId.slice(-8).toUpperCase()}`;
  };

  const copyAccountNumber = () => {
    const accountNumber = generateAccountNumber(userProfile?.id || '', userProfile?.client_id);
    navigator.clipboard.writeText(accountNumber);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رقم الحساب إلى الحافظة"
    });
  };

  const calculateStats = () => {
    const totalDeposits = transactions
      .filter(t => t.transaction_type === 'deposit' || t.transaction_type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = transactions
      .filter(t => t.transaction_type === 'withdrawal' || t.transaction_type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    
    return { totalDeposits, totalWithdrawals, pendingTransactions };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/60 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-white/60 rounded-xl"></div>
                <div className="h-32 bg-white/60 rounded-xl"></div>
              </div>
              <div className="h-96 bg-white/60 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const accountNumber = generateAccountNumber(userProfile?.id || '', userProfile?.client_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <SEO 
        title="المحفظة الرقمية - شركة علي صالح محمد الشهري"
        description="إدارة أموالك وتتبع معاملاتك بسهولة وأمان مع نظام المحفظة الرقمية المتقدم"
      />
      
      <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Banking Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">المحفظة الرقمية</h1>
                <p className="text-slate-600">إدارة أموالك وتتبع معاملاتك بسهولة وأمان</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <Shield className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">محمي وآمن</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg text-slate-800">معلومات الحساب</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    نشط
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">اسم العميل</Label>
                    <p className="text-slate-800 font-semibold">{userProfile?.full_name || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">البريد الإلكتروني</Label>
                    <p className="text-slate-800 font-medium">{userProfile?.email}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-medium">رقم الحساب</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-mono font-bold text-slate-800 tracking-wider">
                          {accountNumberVisible ? accountNumber : '●●●●●●●●'}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAccountNumberVisible(!accountNumberVisible)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={copyAccountNumber}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <Label className="text-slate-600 font-medium">شركة علي صالح محمد الشهري</Label>
                      <p className="text-sm text-slate-500">المملكة العربية السعودية</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white/90 font-medium">رصيد المحفظة</CardTitle>
                  <Wallet className="h-6 w-6 text-white/70" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold tracking-tight">
                      <NumberFormatter number={wallet?.balance || 0} />
                    </span>
                    <span className="text-xl text-white/80 font-medium">ريال سعودي</span>
                  </div>
                  <p className="text-white/70 text-sm">الرصيد المتاح للاستخدام</p>
                </div>

                <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold"
                    >
                      <Plus className="h-5 w-5 ml-2" />
                      شحن المحفظة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-center text-slate-800">شحن المحفظة</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-slate-700 font-medium">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="amount"
                          type="number"
                          min="1"
                          step="0.01"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="أدخل المبلغ المراد شحنه"
                          className="text-lg font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">طريقة الدفع</Label>
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
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        {depositing ? 'جاري الشحن...' : 'تأكيد الشحن'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="h-5 w-5" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">إجمالي الإيداعات</span>
                  </div>
                  <span className="font-bold text-emerald-700">
                    <NumberFormatter number={stats.totalDeposits} suffix=" ريال" />
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100">
                  <div className="flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-sm font-medium text-rose-800">إجمالي المدفوعات</span>
                  </div>
                  <span className="font-bold text-rose-700">
                    <NumberFormatter number={stats.totalWithdrawals} suffix=" ريال" />
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">معاملات معلقة</span>
                  </div>
                  <span className="font-bold text-amber-700">
                    <NumberFormatter number={stats.pendingTransactions} />
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <CreditCard className="h-5 w-5" />
                  طرق الدفع المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.value} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <method.icon className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">{method.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction History */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <History className="h-5 w-5" />
              سجل المعاملات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">لا توجد معاملات</h3>
                <p className="text-slate-500 mb-4">ابدأ بشحن محفظتك لتظهر المعاملات هنا</p>
                <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100">
                      <Plus className="h-4 w-4 ml-2" />
                      شحن المحفظة الآن
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600">آخر {transactions.length} معاملة</span>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    عرض الكل
                    <ChevronRight className="h-4 w-4 mr-1" />
                  </Button>
                </div>
                
                {transactions.map((transaction, index) => (
                  <div key={transaction.id} className="group">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-rose-100 text-rose-600'
                        }`}>
                          {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? (
                            <ArrowUpCircle className="h-4 w-4" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4" />
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${getTransactionColor(transaction.transaction_type)} font-medium`}>
                              {getTransactionTypeLabel(transaction.transaction_type)}
                            </Badge>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {transaction.payment_method}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium">{transaction.description}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(transaction.created_at).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-left space-y-1">
                        <div className={`text-lg font-bold ${
                          transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}>
                          {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                          <NumberFormatter number={transaction.amount} suffix=" ريال" />
                        </div>
                        <div className="text-xs text-slate-500">
                          الرصيد: <NumberFormatter number={transaction.balance_after} suffix=" ريال" />
                        </div>
                      </div>
                    </div>
                    
                    {index < transactions.length - 1 && (
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2" />
                    )}
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