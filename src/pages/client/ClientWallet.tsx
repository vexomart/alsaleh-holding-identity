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
  ChevronRight
} from 'lucide-react';

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
  const { toast } = useToast();

  const iconMap = {
    CreditCard,
    Smartphone,
    Building2,
    Calendar,
    Shield: TrendingUp,
    Globe: TrendingDown
  };

  useEffect(() => {
    fetchWalletData();
    fetchPaymentMethods();
  }, []);

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
      if (!user) return;

      // Fetch user profile with maybeSingle to avoid errors
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      // إذا لم يوجد ملف شخصي، قم بإنشاء واحد
      let userProfileData = profileData;
      if (!profileData) {
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
            title: "تم إرسال طلب الشحن",
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
      title: "تم النسخ بنجاح",
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
        return <ArrowUpCircle className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <ArrowDownCircle className="w-4 h-4 text-rose-600" />;
      case 'refund':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return <History className="w-4 h-4 text-slate-600" />;
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
      title: "تم النسخ",
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
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
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-slate-600 font-medium">الرقم المالي المعتمد</Label>
                         <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                           للتحقق المالي
                         </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 rounded-lg p-3 flex-1">
                          <p className="text-xl font-mono font-bold text-slate-800 tracking-wider">
                            {accountNumberVisible ? accountNumber : '●●●●●●●●●●●●●●●●'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            رقم التحقق المالي الرسمي
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAccountNumberVisible(!accountNumberVisible)}
                            className="h-9 w-9 p-0 bg-slate-100 hover:bg-slate-200"
                          >
                            {accountNumberVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyAccountNumber}
                            className="h-9 w-9 p-0 bg-slate-100 hover:bg-slate-200"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                     <div className="text-right">
                       <Label className="text-slate-600 font-medium">شركة علي صالح محمد الشهري</Label>
                       <p className="text-sm text-slate-500">المملكة العربية السعودية</p>
                       <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                         <div className="flex items-start gap-2">
                           <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                           <div className="text-xs text-amber-800 leading-relaxed">
                             <p className="font-semibold">تنبيه مهم:</p>
                             <p>هذا الحساب مخصص للتحقق من جميع عملياتك المالية داخل الشركة وفقاً للأنظمة المالية المعمول بها.</p>
                           </div>
                         </div>
                       </div>
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
                      {isBalanceVisible ? (
                        <NumberFormatter number={walletBalance} />
                      ) : (
                        '••••••'
                      )}
                    </span>
                    <span className="text-xl text-white/80 font-medium">ريال سعودي</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                      className="text-white/70 hover:bg-white/20 h-8 w-8 p-0"
                    >
                      {isBalanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
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
                        <Select value={paymentMethod} onValueChange={(value) => {
                          setPaymentMethod(value);
                          setShowBankDetails(value === 'bank_transfer');
                          if (value !== 'bank_transfer') {
                            setReceiptFile(null);
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر طريقة الدفع" />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePaymentMethods.map((method) => {
                              const IconComponent = iconMap[method.icon_name as keyof typeof iconMap] || CreditCard;
                              return (
                                <SelectItem key={method.id} value={method.provider}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    {method.name_ar}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Bank Details */}
                      {showBankDetails && (
                        <Card className="border border-blue-200 bg-blue-50">
                          <CardHeader className="pb-2 pt-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-600" />
                              تفاصيل التحويل البنكي
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 pt-2">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-blue-700">اسم الشركة:</p>
                              <div className="flex items-center justify-between bg-white p-2 rounded border text-xs">
                                <span className="truncate">{bankDetails.companyName}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(bankDetails.companyName, "اسم الشركة")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-blue-700">رقم الحساب:</p>
                              <div className="flex items-center justify-between bg-white p-2 rounded border text-xs">
                                <span className="font-mono">{bankDetails.accountNumber}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(bankDetails.accountNumber, "رقم الحساب")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-blue-700">الآيبان:</p>
                              <div className="flex items-center justify-between bg-white p-2 rounded border text-xs">
                                <span className="font-mono">{bankDetails.iban}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(bankDetails.iban, "الآيبان")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* File Upload for Bank Transfer */}
                      {showBankDetails && (
                        <div className="space-y-1">
                          <Label className="text-sm">رفع إيصال التحويل</Label>
                          <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center">
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="receipt-upload"
                            />
                            <label htmlFor="receipt-upload" className="cursor-pointer">
                              <div className="space-y-1">
                                <Upload className="h-6 w-6 mx-auto text-slate-500" />
                                <p className="text-xs text-slate-500">
                                  اضغط لرفع الإيصال
                                </p>
                                {receiptFile && (
                                  <p className="text-xs text-green-600 font-medium truncate">
                                    {receiptFile.name}
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
                {availablePaymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">{method.name_ar}</span>
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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <History className="h-5 w-5" />
                سجل المعاملات
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في المعاملات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-10 w-64"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 ml-2" />
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
                  <span className="text-sm text-slate-600">آخر {filteredTransactions.length} معاملة</span>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    عرض الكل
                    <ChevronRight className="h-4 w-4 mr-1" />
                  </Button>
                </div>
                
                {filteredTransactions.map((transaction, index) => {
                  const status = getTransactionStatus(transaction.status);
                  return (
                    <div key={transaction.id} className="group cursor-pointer">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100 hover:shadow-sm transition-all duration-300 border border-slate-100 hover:border-slate-200">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl shadow-sm ${
                            transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                              ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700'
                              : 'bg-gradient-to-br from-rose-100 to-rose-50 text-rose-700'
                          }`}>
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`${status.className} font-medium text-xs`}>
                                {getTransactionTypeText(transaction.transaction_type)}
                              </Badge>
                              <Badge variant="outline" className={`${status.className} text-xs`}>
                                {status.label}
                              </Badge>
                              {transaction.reference_id && (
                                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs font-mono">
                                  #{transaction.reference_id.slice(-6)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-800 font-semibold">{transaction.description}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(transaction.created_at).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {transaction.balance_before && transaction.balance_after && (
                                <span className="text-slate-400">•</span>
                              )}
                              {transaction.balance_before && transaction.balance_after && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {transaction.balance_before} → {transaction.balance_after} ريال
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-left space-y-2">
                          <div className={`text-xl font-bold ${
                            transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }`}>
                            {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                            <NumberFormatter number={transaction.amount} suffix=" ريال" />
                          </div>
                          {transaction.balance_after && (
                            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              الرصيد النهائي: <NumberFormatter number={transaction.balance_after} suffix=" ريال" />
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 text-xs px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(transaction.id, "معرف المعاملة");
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            نسخ
                          </Button>
                        </div>
                      </div>
                      
                      {index < filteredTransactions.length - 1 && (
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-3" />
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