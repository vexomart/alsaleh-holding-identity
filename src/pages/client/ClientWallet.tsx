import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NumberFormatter } from '@/components/NumberFormatter';
import { useRealtimePayments } from '@/hooks/useRealtimePayments';
import { 
  Wallet, 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  History,
  Eye,
  EyeOff,
  Download,
  Filter,
  Search,
  Zap,
  Smartphone,
  Building2,
  Upload,
  Info,
  Copy,
  User,
  Shield,
  ChevronRight,
  Bell,
  Settings,
  RefreshCw,
  DollarSign,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  CreditCard as CardIcon,
  Banknote,
  Star,
  Globe,
  Sparkles,
  Layers,
  Activity,
  Target,
  Award,
  Briefcase,
  Crown,
  Diamond,
  Gem,
  Infinity,
  Lock,
  MousePointer,
  Palette,
  Percent,
  Repeat,
  RotateCw,
  Send,
  ShoppingBag,
  Smartphone as Phone,
  Users,
  Verified,
  Wallet2,
  X
} from 'lucide-react';

interface WalletData {
  id: string;
  balance: number;
  currency: string;
  user_id: string;
}

interface UserProfile {
  id: string;
  user_id?: string;
  full_name?: string;
  client_id?: string;
  email?: string;
  phone?: string;
  company?: string;
  created_at?: string;
  updated_at?: string;
  user_role?: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  created_at: string;
  status: string;
  reference_id?: string;
  balance_before?: number;
  balance_after?: number;
}

interface PaymentMethodDB {
  id: string;
  name: string;
  name_ar: string;
  provider: string;
  icon_name: string;
  is_active: boolean;
  configuration: any;
}

export default function ClientWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethodDB[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [accountNumberVisible, setAccountNumberVisible] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const { toast } = useToast();

  // Animation sequence effect
  useEffect(() => {
    const sequence = async () => {
      for (let i = 0; i <= 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setAnimationStep(i);
      }
    };
    if (!loading) sequence();
  }, [loading]);

  const iconMap = {
    CreditCard,
    Smartphone,
    Building2,
    Calendar,
    Shield: TrendingUp,
    Globe: TrendingDown
  };

  // Disable real-time updates completely to avoid spam
  const handleManualRefresh = async () => {
    setLoading(true);
    await fetchWalletData();
    toast({
      title: "تم التحديث",
      description: "تم تحديث بيانات المحفظة",
      duration: 2000,
    });
    setLoading(false);
  };

  // Only use realtime if explicitly enabled by user
  const { getStatusText } = useRealtimePayments({
    onUpdate: realtimeEnabled ? () => {
      // Silent update without notifications when realtime is enabled
      fetchWalletData();
    } : undefined,
    showNotifications: false, // Always disable automatic notifications
  });

  const toggleRealtimeUpdates = () => {
    const newValue = !realtimeEnabled;
    setRealtimeEnabled(newValue);
    localStorage.setItem('realtimeUpdates', JSON.stringify(newValue));
    
    if (newValue) {
      toast({
        title: "تم تفعيل التحديثات الفورية",
        description: "سيتم تحديث المحفظة تلقائياً",
        duration: 3000,
      });
    } else {
      toast({
        title: "تم إيقاف التحديثات الفورية", 
        description: "استخدم زر التحديث اليدوي للتحديث",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchPaymentMethods();
    
    // Load realtime preference from localStorage
    const storedRealtimePref = localStorage.getItem('realtimeUpdates');
    if (storedRealtimePref !== null) {
      setRealtimeEnabled(JSON.parse(storedRealtimePref));
    }
  }, []);

  // Save realtime preference when changed
  useEffect(() => {
    localStorage.setItem('realtimeUpdates', JSON.stringify(realtimeEnabled));
  }, [realtimeEnabled]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('name_ar');

      if (error) throw error;
      setAvailablePaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchWalletData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      // Fetch user profile with maybeSingle to avoid errors
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      // إذا لم يوجد ملف شخصي، قم بإنشاء واحد
      let userProfileData = profileData;
      if (!profileData) {
        console.log('Creating new profile for user:', user.id, user.email);
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم جديد',
            email: user.email
          })
          .select()
          .single();

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          // في حالة فشل إنشاء الملف الشخصي، استخدم بيانات افتراضية
          userProfileData = {
            id: user.id,
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم جديد',
            email: user.email,
            client_id: '',
            phone: '',
            company: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_role: 'user'
          };
        } else {
          userProfileData = newProfile;
        }
      }

      setUserProfile({
        id: user.id,
        full_name: userProfileData?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم جديد',
        client_id: userProfileData?.client_id,
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
          console.error('Error creating wallet:', createError);
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

      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !paymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setDepositing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('wallet-deposit', {
        body: {
          user_id: user.id,
          amount: parseFloat(depositAmount),
          payment_method: paymentMethod,
          description: `إيداع بمبلغ ${depositAmount} ر.س عبر ${paymentMethod}`,
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "تم الإيداع بنجاح",
        description: `تم إيداع ${depositAmount} ر.س في محفظتك`,
      });

      setDepositAmount('');
      setPaymentMethod('');
      setIsDepositOpen(false);
      await fetchWalletData();

    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "خطأ في الإيداع",
        description: "حدث خطأ أثناء معالجة طلب الإيداع",
        variant: "destructive",
      });
    } finally {
      setDepositing(false);
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'إيداع';
      case 'withdrawal': return 'سحب';
      case 'payment': return 'دفع';
      case 'refund': return 'استرداد';
      case 'transfer': return 'تحويل';
      default: return type;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-emerald-100';
      case 'withdrawal': return 'bg-rose-100';
      case 'payment': return 'bg-blue-100';
      case 'refund': return 'bg-green-100';
      case 'transfer': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const generateUniqueAccountNumber = (userId: string, clientId?: string) => {
    const baseId = clientId || userId;
    const hash = baseId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const positiveHash = Math.abs(hash);
    const accountNumber = (1000000000 + (positiveHash % 900000000)).toString();
    return accountNumber;
  };

  const copyAccountNumber = () => {
    const accountNumber = generateUniqueAccountNumber(userProfile?.id || '', userProfile?.client_id);
    navigator.clipboard.writeText(accountNumber);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رقم الحساب إلى الحافظة",
    });
  };

  const calculateStats = () => {
    const deposits = transactions.filter(t => t.transaction_type === 'deposit');
    const withdrawals = transactions.filter(t => t.transaction_type === 'withdrawal');
    const pending = transactions.filter(t => t.status === 'pending');

    return {
      totalDeposits: deposits.reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: withdrawals.reduce((sum, t) => sum + t.amount, 0),
      pendingTransactions: pending.length,
    };
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = typeFilter === 'all' || transaction.transaction_type === typeFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const stats = calculateStats();
  const accountNumber = generateUniqueAccountNumber(userProfile?.id || '', userProfile?.client_id);
  const walletBalance = wallet?.balance || 0;

  // Bank account details
  const bankDetails = {
    companyName: "شركة علي صالح محمد الشهري القابضة",
    accountNumber: "161000010006086071040",
    iban: "SA1980000161608016071040",
    bankName: "البنك الأهلي السعودي"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      {/* Header Section */}
      <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${animationStep >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Wallet2 className="w-8 h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  المحفظة الرقمية المتميزة
                </h1>
                <p className="text-gray-600 mt-1">إدارة أموالك بأمان وسهولة تامة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleManualRefresh}
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white border-gray-200 shadow-sm"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
              
              <Button
                onClick={toggleRealtimeUpdates}
                variant={realtimeEnabled ? "default" : "outline"}
                size="sm"
                className={realtimeEnabled 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  : "bg-white/80 hover:bg-white border-gray-200 shadow-sm"
                }
              >
                <Zap className="w-4 h-4 ml-2" />
                {realtimeEnabled ? 'مُفعّل' : 'تفعيل التحديثات'}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Balance Card */}
            <div className={`transition-all duration-1000 delay-200 transform ${animationStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-20 -translate-x-20"></div>
                
                <CardContent className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-white/90 text-lg font-medium">الرصيد المتاح</h2>
                        <p className="text-white/70 text-sm">للاستخدام الفوري</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      {isBalanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </Button>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-white">
                        {isBalanceVisible ? (
                          `${walletBalance.toLocaleString('ar-SA')} ر.س`
                        ) : (
                          '••••••'
                        )}
                      </span>
                      {isBalanceVisible && (
                        <span className="text-white/70 text-xl font-medium">ر.س</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-300">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">متاح للسحب الفوري</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                          <Plus className="w-5 h-5 ml-2" />
                          شحن المحفظة
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-right">شحن المحفظة</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label>المبلغ (ر.س)</Label>
                            <Input
                              type="number"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder="أدخل المبلغ"
                              className="text-right"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>طريقة الدفع</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر طريقة الدفع" />
                              </SelectTrigger>
                              <SelectContent>
                                {availablePaymentMethods.map((method) => (
                                  <SelectItem key={method.id} value={method.provider}>
                                    {method.name_ar}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Button 
                            onClick={handleDeposit} 
                            disabled={depositing}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                          >
                            {depositing ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                جاري المعالجة...
                              </div>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 ml-2" />
                                تأكيد الشحن
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                      onClick={() => setShowBankDetails(!showBankDetails)}
                    >
                      <Building2 className="w-5 h-5 ml-2" />
                      التحويل البنكي
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className={`transition-all duration-1000 delay-400 transform ${animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-600 font-medium text-sm">إجمالي الإيداعات</p>
                        <p className="text-2xl font-bold text-emerald-700">
                          {stats.totalDeposits.toLocaleString('ar-SA')} ر.س
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <ArrowUpCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-red-50 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-rose-600 font-medium text-sm">إجمالي المسحوبات</p>
                        <p className="text-2xl font-bold text-rose-700">
                          {stats.totalWithdrawals.toLocaleString('ar-SA')} ر.س
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                        <ArrowDownCircle className="w-6 h-6 text-rose-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-600 font-medium text-sm">معاملات في الانتظار</p>
                        <p className="text-2xl font-bold text-amber-700">{stats.pendingTransactions}</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Transaction History */}
            <div className={`transition-all duration-1000 delay-600 transform ${animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <History className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">سجل المعاملات المالية</CardTitle>
                        <CardDescription>جميع العمليات المالية مع التفاصيل</CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 ml-2" />
                        تصدير
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 ml-2" />
                        فلترة
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="البحث في المعاملات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-10"
                          />
                        </div>
                      </div>
                      
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع المعاملات</SelectItem>
                          <SelectItem value="deposit">إيداعات</SelectItem>
                          <SelectItem value="withdrawal">سحوبات</SelectItem>
                          <SelectItem value="payment">مدفوعات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      {filteredTransactions.map((transaction, index) => (
                        <div 
                          key={transaction.id} 
                          className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTransactionColor(transaction.transaction_type)} transition-all duration-300 group-hover:scale-110`}>
                                {transaction.transaction_type === 'deposit' ? (
                                  <ArrowUpCircle className="w-6 h-6 text-emerald-600" />
                                ) : transaction.transaction_type === 'withdrawal' ? (
                                  <ArrowDownCircle className="w-6 h-6 text-rose-600" />
                                ) : (
                                  <CreditCard className="w-6 h-6 text-blue-600" />
                                )}
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {getTransactionTypeLabel(transaction.transaction_type)}
                                </h4>
                                <p className="text-sm text-gray-500">{transaction.description}</p>
                                <p className="text-xs text-gray-400">
                                  {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-left">
                              <p className={`text-lg font-bold ${
                                transaction.transaction_type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'
                              }`}>
                                {transaction.transaction_type === 'deposit' ? '+' : '-'}
                                {transaction.amount.toLocaleString('ar-SA')} ر.س
                              </p>
                              <Badge 
                                variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {getStatusText(transaction.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {filteredTransactions.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <History className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">لا توجد معاملات مالية</p>
                        <p className="text-gray-400 text-sm">ستظهر هنا جميع معاملاتك المالية</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Account Info */}
            <div className={`transition-all duration-1000 delay-300 transform ${animationStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">معلومات الحساب</CardTitle>
                      <CardDescription>البيانات الشخصية والحساب</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 font-medium">اسم العميل</span>
                      <span className="font-semibold">{userProfile?.full_name || 'غير محدد'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-600 font-medium">البريد الإلكتروني</span>
                      <span className="font-semibold text-sm">{userProfile?.email}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600 font-medium">رقم الحساب المصرفي</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {accountNumberVisible ? accountNumber : '••••••••••'}
                        </span>
                        <Button 
                          onClick={() => setAccountNumberVisible(!accountNumberVisible)}
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          {accountNumberVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button 
                          onClick={copyAccountNumber}
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 font-medium">حالة التحديثات الفورية</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${realtimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-sm font-medium">
                          {realtimeEnabled ? 'مُفعّل' : 'معطّل'}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={toggleRealtimeUpdates}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Bell className="w-4 h-4 ml-2" />
                      {realtimeEnabled ? 'إيقاف التحديثات الفورية' : 'تفعيل التحديثات الفورية'}
                    </Button>
                    
                    <Button 
                      onClick={handleManualRefresh}
                      variant="outline" 
                      size="sm"
                      className="w-full mt-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                    >
                      <RefreshCw className="w-4 h-4 ml-2" />
                      تحديث يدوي
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div className={`transition-all duration-1000 delay-500 transform ${animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">طرق الدفع المتاحة</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {availablePaymentMethods.map((method) => {
                      const Icon = iconMap[method.icon_name as keyof typeof iconMap] || CreditCard;
                      return (
                        <div 
                          key={method.id} 
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium">{method.name_ar}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            متاح
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Company Info */}
            <div className={`transition-all duration-1000 delay-700 transform ${animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-amber-800">{bankDetails.companyName}</h3>
                      <p className="text-amber-700 text-sm">{bankDetails.bankName}</p>
                      <div className="space-y-1 text-xs text-amber-600">
                        <p><span className="font-semibold">رقم الحساب:</span> {bankDetails.accountNumber}</p>
                        <p><span className="font-semibold">IBAN:</span> {bankDetails.iban}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}