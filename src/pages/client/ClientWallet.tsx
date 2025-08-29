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
  Sparkles
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
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const { toast } = useToast();

  const iconMap = {
    CreditCard,
    Smartphone,
    Building2,
    Calendar,
    Shield: TrendingUp,
    Globe: TrendingDown
  };

  // Real-time updates with better notification control
  const { getStatusText } = useRealtimePayments({
    onUpdate: () => {
      const currentTime = Date.now();
      // Only show notification if more than 30 seconds passed since last update AND notifications are enabled
      if (enableNotifications && currentTime - lastUpdateTime > 30000) {
        // Custom animated notification
        showCustomNotification();
        setLastUpdateTime(currentTime);
      }
      // Always fetch data but control notifications
      fetchWalletData();
    }
  });

  // Custom notification with beautiful animation
  const showCustomNotification = () => {
    const notificationElement = document.createElement('div');
    notificationElement.className = `
      fixed top-4 right-4 z-50 
      bg-gradient-to-r from-green-500 to-emerald-600 
      text-white px-6 py-4 rounded-lg shadow-lg 
      transform translate-x-full opacity-0
      transition-all duration-500 ease-out
      flex items-center gap-3
      border border-green-400/30
      backdrop-blur-sm
    `;
    
    notificationElement.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <div class="font-semibold text-sm">تم تحديث الرصيد</div>
          <div class="text-xs opacity-90">تم تحديث رصيد محفظتك بنجاح</div>
        </div>
        <div class="w-1 h-8 bg-white/30 rounded-full animate-pulse ml-2"></div>
      </div>
    `;
    
    document.body.appendChild(notificationElement);
    
    // Animate in
    setTimeout(() => {
      notificationElement.style.transform = 'translateX(0)';
      notificationElement.style.opacity = '1';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notificationElement.style.transform = 'translateX(full)';
      notificationElement.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notificationElement);
      }, 500);
    }, 4000);
  };

  useEffect(() => {
    fetchWalletData();
    fetchPaymentMethods();
    
    // Load notification preferences from localStorage
    const storedNotificationPref = localStorage.getItem('walletNotifications');
    if (storedNotificationPref !== null) {
      setEnableNotifications(JSON.parse(storedNotificationPref));
    }
  }, []);

  // Save notification preference when changed
  useEffect(() => {
    localStorage.setItem('walletNotifications', JSON.stringify(enableNotifications));
  }, [enableNotifications]);

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

    // Validate bank transfer receipt
    if (paymentMethod === 'bank_transfer' && !receiptFile) {
      toast({
        title: "مطلوب إيصال البنك",
        description: "يرجى رفع إيصال التحويل البنكي",
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
          payment_method: paymentMethod === 'electronic_payment' ? 'tap_now' : paymentMethod,
          description: `شحن المحفظة بمبلغ ${amount} ريال سعودي`,
          receipt_file: receiptFile ? receiptFile.name : null
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw response.error;
      }

      const { data } = response;
      
      if (data?.success) {
        if (data.payment_url) {
          setDepositAmount('');
          setPaymentMethod('');
          setReceiptFile(null);
          setIsDepositOpen(false);
          window.location.href = data.payment_url;
        } else {
          toast({
            title: "✅ تم إرسال طلب الشحن",
            description: data.message || "سيتم مراجعة إيصال التحويل وإضافة المبلغ خلال 24 ساعة",
            variant: "default"
          });
          
          setDepositAmount('');
          setPaymentMethod('');
          setReceiptFile(null);
          setIsDepositOpen(false);
          await fetchWalletData();
        }
      } else {
        throw new Error(data?.error || 'Unknown error occurred');
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          title: "خطأ في حجم الملف",
          description: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
          variant: "destructive"
        });
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "نوع ملف غير مدعوم",
          description: "يرجى اختيار ملف من نوع JPG, PNG أو PDF",
          variant: "destructive"
        });
        return;
      }
      
      setReceiptFile(file);
    }
  };

  const generateUniqueAccountNumber = (userId: string, clientId?: string) => {
    if (clientId) return clientId;
    
    // إنشاء رقم حساب فريد ثابت من 9 أرقام للتحقق المالي
    const userHash = userId.replace(/-/g, '');
    // استخدام hash ثابت بدلاً من رقم عشوائي
    const firstDigit = parseInt(userHash.charAt(0), 16) % 10; // أول رقم ثابت
    const remainingDigits = userHash.slice(-8); // آخر 8 أرقام
    return `${firstDigit}${remainingDigits}`.slice(0, 9);
  };

  const copyAccountNumber = () => {
    const accountNumber = generateUniqueAccountNumber(userProfile?.id || '', userProfile?.client_id);
    navigator.clipboard.writeText(accountNumber);
    toast({
      title: "✅ تم النسخ بنجاح",
      description: "تم نسخ رقم الحساب المعتمد للتحقق المالي",
      duration: 3000
    });
  };

  const calculateStats = () => {
    const totalDeposits = transactions
      .filter(t => t.transaction_type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = transactions
      .filter(t => (t.transaction_type === 'withdrawal' || t.transaction_type === 'payment') && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    
    return { totalDeposits, totalWithdrawals, pendingTransactions };
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpCircle className="w-5 h-5 text-emerald-600" />;
      case 'payment':
        return <ArrowDownCircle className="w-5 h-5 text-rose-600" />;
      case 'refund':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <History className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTransactionTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'deposit': 'إيداع',
      'payment': 'دفع',
      'refund': 'استرداد'
    };
    return typeMap[type] || type;
  };

  const getTransactionStatus = (status: string) => {
    const statusMap: { [key: string]: { label: string, className: string } } = {
      'completed': { label: 'مكتمل', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'pending': { label: 'قيد المعالجة', className: 'bg-amber-50 text-amber-700 border-amber-200' },
      'failed': { label: 'فشل', className: 'bg-rose-50 text-rose-700 border-rose-200' }
    };
    return statusMap[status] || { label: status, className: 'bg-slate-50 text-slate-700 border-slate-200' };
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ تم النسخ",
      description: `تم نسخ ${label} بنجاح`
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = typeFilter === 'all' || transaction.transaction_type === typeFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const stats = calculateStats();
  const accountNumber = generateUniqueAccountNumber(userProfile?.id || '', userProfile?.client_id);
  const walletBalance = wallet?.balance || 0;

  // Bank account details
  const bankDetails = {
    companyName: "شركة علي صالح محمد الشهري",
    accountNumber: "161000010006086071040",
    iban: "SA1980000161608016071040",
    bankName: "البنك الأهلي السعودي"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-gradient-to-r from-white/60 to-blue-100/60 rounded-2xl backdrop-blur-sm"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="h-64 bg-gradient-to-r from-white/60 to-blue-100/60 rounded-2xl backdrop-blur-sm"></div>
                <div className="h-48 bg-gradient-to-r from-white/60 to-blue-100/60 rounded-2xl backdrop-blur-sm"></div>
              </div>
              <div className="h-96 bg-gradient-to-r from-white/60 to-blue-100/60 rounded-2xl backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Professional Banking Header */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-xl">
                    <Wallet className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    المحفظة الرقمية
                  </h1>
                  <p className="text-slate-600 text-lg">إدارة أموالك وتتبع معاملاتك بسهولة وأمان</p>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      متاح 24/7
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      محمي ومؤمن
                    </span>
                    <span className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${enableNotifications ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      {enableNotifications ? 'التحديثات مُفعّلة' : 'التحديثات معطّلة'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">حساب مُفعّل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEnableNotifications(!enableNotifications)}
                    className={`bg-white/50 hover:bg-white/80 ${
                      enableNotifications 
                        ? 'text-blue-700 border-blue-200' 
                        : 'text-slate-500 border-slate-200'
                    }`}
                  >
                    <Bell className="h-4 w-4 ml-2" />
                    {enableNotifications ? 'إيقاف التنبيهات' : 'تفعيل التنبيهات'}
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/80">
                    <Settings className="h-4 w-4 ml-2" />
                    الإعدادات
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Premium Account Card */}
            <Card className="relative overflow-hidden bg-white/90 backdrop-blur-md border-white/20 shadow-xl animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50"></div>
              <CardHeader className="relative pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl text-slate-800">معلومات الحساب</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse">
                      <CheckCircle className="h-3 w-3 ml-1" />
                      حساب نشط
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Star className="h-3 w-3 ml-1" />
                      عضو مميز
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-slate-600 font-semibold">اسم العميل</Label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-800 font-bold text-lg">{userProfile?.full_name || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-slate-600 font-semibold">البريد الإلكتروني</Label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-800 font-semibold">{userProfile?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-600 font-semibold">الرقم المالي المعتمد</Label>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs animate-pulse">
                        <Shield className="h-3 w-3 ml-1" />
                        للتحقق المالي
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                            <p className="text-2xl font-mono font-bold text-slate-800 tracking-wider">
                              {accountNumberVisible ? accountNumber : '●●●●●●●●●'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              رقم التحقق المالي الرسمي
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setAccountNumberVisible(!accountNumberVisible)}
                              className="h-10 w-10 p-0 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
                            >
                              {accountNumberVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={copyAccountNumber}
                              className="h-10 w-10 p-0 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-slate-600 font-semibold">معلومات الشركة</Label>
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-2">
                              <p className="font-semibold text-amber-800">شركة علي صالح محمد الشهري</p>
                              <p className="text-sm text-amber-700">المملكة العربية السعودية</p>
                              <div className="text-xs text-amber-800 leading-relaxed">
                                <p className="font-semibold">تنبيه مهم:</p>
                                <p>هذا الحساب مخصص للتحقق من جميع عملياتك المالية داخل الشركة وفقاً للأنظمة المالية المعمول بها.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Balance Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white border-none shadow-2xl animate-scale-in">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white/90 font-semibold text-xl">رصيد المحفظة</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <Sparkles className="h-5 w-5 text-white/80" />
                    </div>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      محفظة متميزة
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-8">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl lg:text-6xl font-bold tracking-tight">
                      {isBalanceVisible ? (
                        <NumberFormatter number={walletBalance} />
                      ) : (
                        '••••••'
                      )}
                    </span>
                    <span className="text-2xl text-white/80 font-semibold">ريال سعودي</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                      className="text-white/70 hover:bg-white/20 h-10 w-10 p-0 ml-2"
                    >
                      {isBalanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                  <p className="text-white/70 text-lg">الرصيد المتاح للاستخدام</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="lg" 
                        className="bg-white text-blue-600 hover:bg-white/90 font-bold text-lg py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Plus className="h-6 w-6 ml-2" />
                        شحن المحفظة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-center text-slate-800 text-xl">شحن المحفظة الرقمية</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="amount" className="text-slate-700 font-semibold">المبلغ (ريال سعودي)</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="1"
                            step="0.01"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="أدخل المبلغ المراد شحنه"
                            className="text-xl font-bold py-6 rounded-xl border-2"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-slate-700 font-semibold">طريقة الدفع</Label>
                          <Select value={paymentMethod} onValueChange={(value) => {
                            setPaymentMethod(value);
                            setShowBankDetails(value === 'bank_transfer');
                            if (value !== 'bank_transfer') {
                              setReceiptFile(null);
                            }
                          }}>
                            <SelectTrigger className="py-6 rounded-xl border-2">
                              <SelectValue placeholder="اختر طريقة الدفع" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePaymentMethods.map((method) => {
                                const IconComponent = iconMap[method.icon_name as keyof typeof iconMap] || CreditCard;
                                return (
                                  <SelectItem key={method.id} value={method.provider}>
                                    <div className="flex items-center gap-3">
                                      <IconComponent className="h-5 w-5" />
                                      <span className="font-medium">{method.name_ar}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Bank Details */}
                        {showBankDetails && (
                          <Card className="border-2 border-blue-200 bg-blue-50 animate-fade-in">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Info className="h-5 w-5 text-blue-600" />
                                تفاصيل التحويل البنكي
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-blue-700">اسم الشركة:</p>
                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border text-sm">
                                  <span className="truncate font-medium">{bankDetails.companyName}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => copyToClipboard(bankDetails.companyName, "اسم الشركة")}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-blue-700">رقم الحساب:</p>
                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border text-sm">
                                  <span className="font-mono font-bold">{bankDetails.accountNumber}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => copyToClipboard(bankDetails.accountNumber, "رقم الحساب")}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-blue-700">الآيبان:</p>
                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border text-sm">
                                  <span className="font-mono font-bold">{bankDetails.iban}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => copyToClipboard(bankDetails.iban, "الآيبان")}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* File Upload for Bank Transfer */}
                        {showBankDetails && (
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">رفع إيصال التحويل</Label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="receipt-upload"
                              />
                              <label htmlFor="receipt-upload" className="cursor-pointer">
                                <div className="space-y-3">
                                  <Upload className="h-8 w-8 mx-auto text-slate-500" />
                                  <p className="text-sm text-slate-600 font-medium">
                                    اضغط لرفع الإيصال
                                  </p>
                                  {receiptFile && (
                                    <p className="text-sm text-green-600 font-bold truncate bg-green-50 p-2 rounded-lg">
                                      ✅ {receiptFile.name}
                                    </p>
                                  )}
                                </div>
                              </label>
                            </div>
                          </div>
                        )}

                        <Button 
                          onClick={handleDeposit} 
                          disabled={depositing || !depositAmount || !paymentMethod || (paymentMethod === 'bank_transfer' && !receiptFile)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-lg py-6 rounded-xl shadow-xl disabled:opacity-50"
                          size="lg"
                        >
                          {depositing ? (
                            <div className="flex items-center gap-2">
                              <RefreshCw className="h-5 w-5 animate-spin" />
                              جاري الشحن...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5" />
                              تأكيد الشحن
                            </div>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-bold text-lg py-6 rounded-2xl backdrop-blur-sm"
                  >
                    <Download className="h-6 w-6 ml-2" />
                    كشف حساب
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Statistics Sidebar */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  إحصائيات فورية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-800">إجمالي الإيداعات</span>
                    </div>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-xl font-bold text-emerald-700">
                    <NumberFormatter number={stats.totalDeposits} suffix=" ريال" />
                  </span>
                </div>

                <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 rounded-xl border border-rose-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="h-5 w-5 text-rose-600" />
                      <span className="text-sm font-bold text-rose-800">إجمالي المدفوعات</span>
                    </div>
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                  </div>
                  <span className="text-xl font-bold text-rose-700">
                    <NumberFormatter number={stats.totalWithdrawals} suffix=" ريال" />
                  </span>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-bold text-amber-800">معاملات معلقة</span>
                    </div>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-xl font-bold text-amber-700">
                    <NumberFormatter number={stats.pendingTransactions} />
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Payment Methods */}
            <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  طرق الدفع المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availablePaymentMethods.map((method, index) => (
                  <div 
                    key={method.id} 
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <CreditCard className="h-5 w-5 text-slate-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{method.name_ar}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Quick Actions with Notification Settings */}
            <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => {
                    fetchWalletData();
                    toast({
                      title: "تم التحديث",
                      description: "تم تحديث بيانات المحفظة بنجاح",
                      duration: 2000,
                    });
                  }}
                  variant="outline" 
                  className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-semibold"
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث الرصيد
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:from-emerald-100 hover:to-green-100 text-emerald-700 font-semibold"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل كشف الحساب
                </Button>
                
                <Button 
                  onClick={() => setEnableNotifications(!enableNotifications)}
                  variant="outline" 
                  className={`w-full justify-start font-semibold ${
                    enableNotifications 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 text-purple-700'
                      : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:from-gray-100 hover:to-slate-100 text-gray-700'
                  }`}
                >
                  <Bell className="h-4 w-4 ml-2" />
                  {enableNotifications ? 'إيقاف التنبيهات الفورية' : 'تفعيل التنبيهات الفورية'}
                </Button>
                
                <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">حالة التحديثات:</span>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${enableNotifications ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-bold text-slate-600">
                        {enableNotifications ? 'مُفعّلة' : 'معطّلة'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {enableNotifications 
                      ? 'ستتلقى تنبيهات عند تحديث رصيدك (كل 5 ثوانٍ كحد أقصى)'
                      : 'لن تتلقى تنبيهات التحديثات الفورية'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Transaction History */}
        <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
                  <History className="h-6 w-6" />
                </div>
                سجل المعاملات المالية
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="البحث في المعاملات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-12 w-full sm:w-80 py-3 rounded-xl border-2"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-60 py-3 rounded-xl border-2">
                    <Filter className="h-5 w-5 ml-2" />
                    <SelectValue placeholder="نوع المعاملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المعاملات</SelectItem>
                    <SelectItem value="deposit">الإيداعات</SelectItem>
                    <SelectItem value="payment">المدفوعات</SelectItem>
                    <SelectItem value="refund">المبالغ المستردة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl w-fit mx-auto mb-6">
                  <Wallet className="h-12 w-12 text-slate-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-3">لا توجد معاملات مالية</h3>
                <p className="text-slate-500 mb-6 text-lg">ابدأ بشحن محفظتك لتظهر المعاملات هنا</p>
                <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl"
                    >
                      <Plus className="h-5 w-5 ml-2" />
                      شحن المحفظة الآن
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-600 font-semibold">آخر {filteredTransactions.length} معاملة مالية</span>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-semibold">
                    عرض جميع المعاملات
                    <ChevronRight className="h-4 w-4 mr-1" />
                  </Button>
                </div>
                
                {filteredTransactions.map((transaction, index) => {
                  const status = getTransactionStatus(transaction.status);
                  return (
                    <div 
                      key={transaction.id} 
                      className="group cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-50/80 to-white hover:from-slate-100 hover:to-blue-50 hover:shadow-lg transition-all duration-500 border border-slate-100 hover:border-blue-200 transform hover:scale-[1.02]">
                        <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-2xl shadow-lg ${
                            transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                              ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 shadow-emerald-200'
                              : 'bg-gradient-to-br from-rose-100 to-rose-50 text-rose-700 shadow-rose-200'
                          }`}>
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={`${status.className} font-bold text-sm px-3 py-1`}>
                                {getTransactionTypeText(transaction.transaction_type)}
                              </Badge>
                              <Badge variant="outline" className={`${status.className} text-sm px-3 py-1`}>
                                {status.label}
                              </Badge>
                              {transaction.reference_id && (
                                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-sm font-mono px-3 py-1">
                                  #{transaction.reference_id.slice(-6)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-800 font-bold text-lg">{transaction.description}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(transaction.created_at).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {transaction.balance_before && transaction.balance_after && (
                                <>
                                  <span className="text-slate-400">•</span>
                                  <span className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    {transaction.balance_before} → {transaction.balance_after} ريال
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-left space-y-3">
                          <div className={`text-3xl font-bold ${
                            transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }`}>
                            {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                            <NumberFormatter number={transaction.amount} suffix=" ريال" />
                          </div>
                          {transaction.balance_after && (
                            <div className="text-sm text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
                              الرصيد النهائي: <NumberFormatter number={transaction.balance_after} suffix=" ريال" />
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 text-sm px-3 font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(transaction.id, "معرف المعاملة");
                            }}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            نسخ المعرف
                          </Button>
                        </div>
                      </div>
                      
                      {index < filteredTransactions.length - 1 && (
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}