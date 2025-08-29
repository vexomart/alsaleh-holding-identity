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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

interface WalletData {
  id: string;
  balance: number;
  currency: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface TransactionData {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  status: string;
  created_at: string;
  reference_id?: string;
  metadata?: any;
}

const ClientWallet = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isUpdatesEnabled, setIsUpdatesEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states for payment methods
  const [rajhiForm, setRajhiForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    receipt: null as File | null
  });

  const [tamaraForm, setTamaraForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    amount: ''
  });

  const [stcForm, setStcForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    transactionId: ''
  });

  const [visaForm, setVisaForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: ''
  });
  const [animationIndex, setAnimationIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // جلب بيانات المحفظة الحقيقية
  const { data: walletData, isLoading: walletLoading, refetch: refetchWallet } = useQuery({
    queryKey: ['customer-wallet'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مصرح للمستخدم');

      const { data: wallet, error } = await supabase
        .from('customer_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('خطأ في جلب بيانات المحفظة:', error);
        throw error;
      }

      // إنشاء محفظة جديدة إذا لم توجد
      if (!wallet) {
        const { data: newWallet, error: createError } = await supabase
          .from('customer_wallets')
          .insert({
            user_id: user.id,
            balance: 0,
            currency: 'SAR'
          })
          .select()
          .single();

        if (createError) {
          console.error('خطأ في إنشاء المحفظة:', createError);
          throw createError;
        }

        return newWallet;
      }

      return wallet;
    }
  });

  // جلب تاريخ المعاملات الحقيقية
  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مصرح للمستخدم');

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('خطأ في جلب المعاملات:', error);
        throw error;
      }

      return data || [];
    }
  });

  // حساب الإحصائيات من المعاملات الحقيقية
  const calculateStats = () => {
    if (!transactions || transactions.length === 0) {
      return {
        totalDeposits: 0,
        totalWithdrawals: 0,
        pendingAmount: 0,
        pendingCount: 0,
        thisMonthTransactions: 0
      };
    }

    const deposits = transactions.filter(t => ['deposit', 'refund'].includes(t.transaction_type));
    const withdrawals = transactions.filter(t => ['withdrawal', 'payment'].includes(t.transaction_type));
    const pending = transactions.filter(t => t.status === 'pending');
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthTrans = transactions.filter(t => new Date(t.created_at) >= thisMonth);

    const totalDeposits = deposits.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + Number(t.amount), 0);
    const pendingAmount = pending.reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalDeposits,
      totalWithdrawals,
      pendingAmount,
      pendingCount: pending.length,
      thisMonthTransactions: thisMonthTrans.length
    };
  };

  const stats = calculateStats();
  const walletBalance = walletData?.balance || 0;
  const availableForWithdrawal = Math.max(0, walletBalance - (stats?.pendingAmount || 0));
  const accountNumber = walletData?.id?.slice(-10) || "0000000000";

  // تحديث الرصيد يدوياً
  const handleManualRefresh = async () => {
    setIsLoading(true);
    try {
      await Promise.all([refetchWallet(), refetchTransactions()]);
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث رصيد المحفظة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث البيانات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // نسخ رقم الحساب
  const copyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رقم الحساب إلى الحافظة",
    });
  };

  // تصفية المعاملات
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.transaction_type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  // الحصول على أيقونة نوع المعاملة
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="w-4 h-4 text-emerald-600" />;
      case 'withdrawal':
        return <ArrowDownLeft className="w-4 h-4 text-red-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'refund':
        return <RefreshCw className="w-4 h-4 text-emerald-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  // الحصول على لون حالة المعاملة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // تأثيرات الحركة المتسلسلة
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationIndex(prev => (prev + 1) % 6);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // الإحصائيات السريعة
  const quickStats = [
    {
      title: "إجمالي الإيداعات",
      amount: stats.totalDeposits,
      change: "+12.5%",
      isPositive: true,
      icon: ArrowUpRight,
      color: "emerald"
    },
    {
      title: "إجمالي المسحوبات",
      amount: stats.totalWithdrawals,
      change: `-${((stats.totalWithdrawals / (stats.totalDeposits || 1)) * 100).toFixed(1)}%`,
      isPositive: false,
      icon: ArrowDownLeft,
      color: "red"
    },
    {
      title: "معاملات في الانتظار",
      amount: stats.pendingAmount,
      change: `${stats.pendingCount} معاملات`,
      isPositive: true,
      icon: Clock,
      color: "amber"
    },
    {
      title: "معاملات هذا الشهر",
      amount: stats.thisMonthTransactions,
      change: "+معاملة جديدة",
      isPositive: true,
      icon: BarChart3,
      color: "blue"
    }
  ];

  if (walletLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Crown className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg font-medium">جاري تحميل المحفظة الرقمية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* رأس الصفحة مع التحديث اليدوي */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: animationIndex === 0 ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                المحفظة الرقمية المتطورة
              </h1>
              <p className="text-muted-foreground mt-1">
                شركة علي صالح محمد الشهري القابضة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleManualRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث يدوي
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsUpdatesEnabled(!isUpdatesEnabled)}
                variant={isUpdatesEnabled ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                <Bell className="w-4 h-4" />
                {isUpdatesEnabled ? "إيقاف التحديثات" : "تفعيل التحديثات"}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* طرق الدفع السريعة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-white to-gray-50/50 border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="w-6 h-6 text-primary" />
                طرق إيداع الأموال
              </CardTitle>
              <CardDescription>اختر طريقة الدفع المناسبة لك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Al Rajhi Bank */}
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <Card className="border-2 border-transparent hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                        <CardContent className="p-6 text-center">
                          <div className="mb-4 flex justify-center">
                            <div className="p-3 bg-emerald-500 rounded-full">
                              <Building2 className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h3 className="font-semibold text-emerald-800 mb-2">بنك الراجحي</h3>
                          <p className="text-sm text-emerald-600">تحويل بنكي فوري</p>
                          <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-200">موثوق</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-emerald-600" />
                        طلب تحويل - بنك الراجحي
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rajhi-name">الاسم الكامل</Label>
                        <Input
                          id="rajhi-name"
                          value={rajhiForm.name}
                          onChange={(e) => setRajhiForm({...rajhiForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-email">البريد الإلكتروني</Label>
                        <Input
                          id="rajhi-email"
                          type="email"
                          value={rajhiForm.email}
                          onChange={(e) => setRajhiForm({...rajhiForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-phone">رقم الجوال</Label>
                        <Input
                          id="rajhi-phone"
                          value={rajhiForm.phone}
                          onChange={(e) => setRajhiForm({...rajhiForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-amount">المبلغ (ر.س)</Label>
                        <Input
                          id="rajhi-amount"
                          type="number"
                          value={rajhiForm.amount}
                          onChange={(e) => setRajhiForm({...rajhiForm, amount: e.target.value})}
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-receipt">إيصال التحويل</Label>
                        <Input
                          id="rajhi-receipt"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setRajhiForm({...rajhiForm, receipt: e.target.files?.[0] || null})}
                        />
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        إرسال طلب التحويل
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* STC Pay */}
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <Card className="border-2 border-transparent hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
                        <CardContent className="p-6 text-center">
                          <div className="mb-4 flex justify-center">
                            <div className="p-3 bg-purple-500 rounded-full">
                              <Smartphone className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h3 className="font-semibold text-purple-800 mb-2">STC Pay</h3>
                          <p className="text-sm text-purple-600">دفع فوري آمن</p>
                          <Badge className="mt-2 bg-purple-100 text-purple-700 border-purple-200">سريع</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        دفع بواسطة STC Pay
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stc-name">الاسم الكامل</Label>
                        <Input
                          id="stc-name"
                          value={stcForm.name}
                          onChange={(e) => setStcForm({...stcForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-email">البريد الإلكتروني</Label>
                        <Input
                          id="stc-email"
                          type="email"
                          value={stcForm.email}
                          onChange={(e) => setStcForm({...stcForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-phone">رقم الجوال</Label>
                        <Input
                          id="stc-phone"
                          value={stcForm.phone}
                          onChange={(e) => setStcForm({...stcForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-amount">المبلغ (ر.س)</Label>
                        <Input
                          id="stc-amount"
                          type="number"
                          value={stcForm.amount}
                          onChange={(e) => setStcForm({...stcForm, amount: e.target.value})}
                          placeholder="100"
                        />
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        ادفع الآن
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Tamara */}
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <Card className="border-2 border-transparent hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-pink-50 to-pink-100/50">
                        <CardContent className="p-6 text-center">
                          <div className="mb-4 flex justify-center">
                            <div className="p-3 bg-pink-500 rounded-full">
                              <CreditCard className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h3 className="font-semibold text-pink-800 mb-2">تمارا</h3>
                          <p className="text-sm text-pink-600">ادفع لاحقاً - اشتري الآن</p>
                          <Badge className="mt-2 bg-pink-100 text-pink-700 border-pink-200">مرن</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-pink-600" />
                        دفع بواسطة تمارا
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tamara-name">الاسم الكامل</Label>
                        <Input
                          id="tamara-name"
                          value={tamaraForm.name}
                          onChange={(e) => setTamaraForm({...tamaraForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-email">البريد الإلكتروني</Label>
                        <Input
                          id="tamara-email"
                          type="email"
                          value={tamaraForm.email}
                          onChange={(e) => setTamaraForm({...tamaraForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-phone">رقم الجوال</Label>
                        <Input
                          id="tamara-phone"
                          value={tamaraForm.phone}
                          onChange={(e) => setTamaraForm({...tamaraForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-amount">المبلغ (ر.س)</Label>
                        <Input
                          id="tamara-amount"
                          type="number"
                          value={tamaraForm.amount}
                          onChange={(e) => setTamaraForm({...tamaraForm, amount: e.target.value})}
                          placeholder="100"
                        />
                      </div>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700">
                        ادفع بتمارا
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Visa/MasterCard */}
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <Card className="border-2 border-transparent hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
                        <CardContent className="p-6 text-center">
                          <div className="mb-4 flex justify-center">
                            <div className="p-3 bg-blue-500 rounded-full">
                              <CardIcon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h3 className="font-semibold text-blue-800 mb-2">فيزا / ماستركارد</h3>
                          <p className="text-sm text-blue-600">بطاقة ائتمانية</p>
                          <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-200">عالمي</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <CardIcon className="w-5 h-5 text-blue-600" />
                        دفع بالبطاقة الائتمانية
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="visa-name">الاسم الكامل</Label>
                        <Input
                          id="visa-name"
                          value={visaForm.name}
                          onChange={(e) => setVisaForm({...visaForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-email">البريد الإلكتروني</Label>
                        <Input
                          id="visa-email"
                          type="email"
                          value={visaForm.email}
                          onChange={(e) => setVisaForm({...visaForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-phone">رقم الجوال</Label>
                        <Input
                          id="visa-phone"
                          value={visaForm.phone}
                          onChange={(e) => setVisaForm({...visaForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-amount">المبلغ (ر.س)</Label>
                        <Input
                          id="visa-amount"
                          type="number"
                          value={visaForm.amount}
                          onChange={(e) => setVisaForm({...visaForm, amount: e.target.value})}
                          placeholder="100"
                        />
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        ادفع بالبطاقة
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* بطاقة الرصيد الرئيسية */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
            
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: animationIndex === 1 ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-lg"
                  >
                    <Wallet className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-white/80 text-sm">الرصيد المتاح</p>
                    <p className="text-white/60 text-xs">للسحب الفوري</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  className="text-white hover:bg-white/20 p-2"
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
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">متاح للسحب الفوري</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>متاح للسحب</span>
                  </div>
                  <p className="text-white text-lg font-semibold">
                    {isBalanceVisible ? `${availableForWithdrawal.toLocaleString('ar-SA')} ر.س` : '•••••'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    <span>في الانتظار</span>
                  </div>
                  <p className="text-white text-lg font-semibold">
                    {isBalanceVisible ? `${stats.pendingAmount.toLocaleString('ar-SA')} ر.س` : '•••••'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                    <User className="w-4 h-4" />
                    <span>رقم الحساب</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-white text-lg font-semibold">{accountNumber}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyAccountNumber}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Plus className="w-4 h-4 mr-2" />
                  إيداع
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <ArrowDownCircle className="w-4 h-4 mr-2" />
                  سحب
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Send className="w-4 h-4 mr-2" />
                  تحويل
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 group hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      animate={{ rotate: animationIndex === index + 2 ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-lg bg-${stat.color}-100 group-hover:bg-${stat.color}-200 transition-colors`}
                    >
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </motion.div>
                    <Badge variant={stat.isPositive ? "default" : "secondary"} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold">
                    {typeof stat.amount === 'number' 
                      ? stat.amount.toLocaleString('ar-SA') + (stat.title.includes('معاملات') ? '' : ' ر.س')
                      : stat.amount
                    }
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* سجل المعاملات المالية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: animationIndex === 5 ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 bg-primary/10 rounded-lg"
                  >
                    <History className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl">سجل المعاملات المالية</CardTitle>
                    <CardDescription>جميع العمليات المالية مع التفاصيل</CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في المعاملات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المعاملات</SelectItem>
                      <SelectItem value="deposit">إيداع</SelectItem>
                      <SelectItem value="withdrawal">سحب</SelectItem>
                      <SelectItem value="payment">دفع</SelectItem>
                      <SelectItem value="refund">استرداد</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    تصدير
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">لا توجد معاملات</p>
                  <p className="text-muted-foreground">ابدأ باستخدام محفظتك الرقمية</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {transaction.description || 'معاملة مالية'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString('ar-SA')} - {new Date(transaction.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {transaction.reference_id && (
                            <p className="text-xs text-muted-foreground">
                              مرجع: {transaction.reference_id}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-semibold ${
                            ['deposit', 'refund'].includes(transaction.transaction_type) 
                              ? 'text-emerald-600' 
                              : 'text-red-600'
                          }`}>
                            {['deposit', 'refund'].includes(transaction.transaction_type) ? '+' : '-'}
                            {Number(transaction.amount).toLocaleString('ar-SA')} ر.س
                          </p>
                          <p className="text-xs text-muted-foreground">
                            الرصيد: {Number(transaction.balance_after).toLocaleString('ar-SA')} ر.س
                          </p>
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status === 'completed' ? 'مكتمل' :
                           transaction.status === 'pending' ? 'في الانتظار' :
                           transaction.status === 'failed' ? 'فاشل' : transaction.status}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* طرق الدفع المتاحة - محدثة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                طرق الدفع المتاحة
              </CardTitle>
              <CardDescription>الطرق المدعومة للإيداع والسحب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {/* البنك الراجحي */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white">
                            <Building2 className="h-8 w-8" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">البنك الراجحي</h3>
                            <p className="text-sm text-slate-600">تحويل بنكي مع إرفاق الإيصال</p>
                            <Badge className="mt-2 bg-blue-100 text-blue-800">متاح</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-center flex items-center justify-center gap-2">
                        <Building2 className="h-5 w-5" />
                        طلب تحويل - البنك الراجحي
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rajhi-name">الاسم الكامل</Label>
                        <Input
                          id="rajhi-name"
                          value={rajhiForm.name}
                          onChange={(e) => setRajhiForm({...rajhiForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-email">البريد الإلكتروني</Label>
                        <Input
                          id="rajhi-email"
                          type="email"
                          value={rajhiForm.email}
                          onChange={(e) => setRajhiForm({...rajhiForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-phone">رقم الجوال</Label>
                        <Input
                          id="rajhi-phone"
                          value={rajhiForm.phone}
                          onChange={(e) => setRajhiForm({...rajhiForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-amount">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="rajhi-amount"
                          type="number"
                          value={rajhiForm.amount}
                          onChange={(e) => setRajhiForm({...rajhiForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-receipt">إيصال التحويل</Label>
                        <Input
                          id="rajhi-receipt"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setRajhiForm({...rajhiForm, receipt: e.target.files?.[0] || null})}
                        />
                        <p className="text-xs text-slate-500 mt-1">يرجى إرفاق إيصال التحويل البنكي</p>
                      </div>
                      <Button 
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* STC Pay */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white">
                            <Smartphone className="h-8 w-8" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">STC Pay</h3>
                            <p className="text-sm text-slate-600">الدفع عبر محفظة STC</p>
                            <Badge className="mt-2 bg-purple-100 text-purple-800">متاح</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-center flex items-center justify-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        طلب دفع - STC Pay
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stc-name">الاسم الكامل</Label>
                        <Input
                          id="stc-name"
                          value={stcForm.name}
                          onChange={(e) => setStcForm({...stcForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-email">البريد الإلكتروني</Label>
                        <Input
                          id="stc-email"
                          type="email"
                          value={stcForm.email}
                          onChange={(e) => setStcForm({...stcForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-phone">رقم الجوال</Label>
                        <Input
                          id="stc-phone"
                          value={stcForm.phone}
                          onChange={(e) => setStcForm({...stcForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-amount">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="stc-amount"
                          type="number"
                          value={stcForm.amount}
                          onChange={(e) => setStcForm({...stcForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-transaction">رقم المعاملة</Label>
                        <Input
                          id="stc-transaction"
                          value={stcForm.transactionId}
                          onChange={(e) => setStcForm({...stcForm, transactionId: e.target.value})}
                          placeholder="رقم المعاملة من STC Pay"
                        />
                      </div>
                      <Button 
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* تمارا */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white">
                            <CreditCard className="h-8 w-8" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">تمارا</h3>
                            <p className="text-sm text-slate-600">الدفع الآجل والتقسيط</p>
                            <Badge className="mt-2 bg-green-100 text-green-800">متاح</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-center flex items-center justify-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        طلب دفع - تمارا
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tamara-name">الاسم الكامل</Label>
                        <Input
                          id="tamara-name"
                          value={tamaraForm.name}
                          onChange={(e) => setTamaraForm({...tamaraForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-email">البريد الإلكتروني</Label>
                        <Input
                          id="tamara-email"
                          type="email"
                          value={tamaraForm.email}
                          onChange={(e) => setTamaraForm({...tamaraForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-phone">رقم الجوال</Label>
                        <Input
                          id="tamara-phone"
                          value={tamaraForm.phone}
                          onChange={(e) => setTamaraForm({...tamaraForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-whatsapp">رقم الواتساب</Label>
                        <Input
                          id="tamara-whatsapp"
                          value={tamaraForm.whatsapp}
                          onChange={(e) => setTamaraForm({...tamaraForm, whatsapp: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-amount">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="tamara-amount"
                          type="number"
                          value={tamaraForm.amount}
                          onChange={(e) => setTamaraForm({...tamaraForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <Button 
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Visa/MasterCard */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-indigo-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center text-white">
                            <CreditCard className="h-8 w-8" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">Visa/MasterCard</h3>
                            <p className="text-sm text-slate-600">بطاقة ائتمانية أو مدينة</p>
                            <Badge className="mt-2 bg-indigo-100 text-indigo-800">متاح</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-center flex items-center justify-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        طلب دفع - بطاقة ائتمانية
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="visa-name">الاسم الكامل</Label>
                        <Input
                          id="visa-name"
                          value={visaForm.name}
                          onChange={(e) => setVisaForm({...visaForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-email">البريد الإلكتروني</Label>
                        <Input
                          id="visa-email"
                          type="email"
                          value={visaForm.email}
                          onChange={(e) => setVisaForm({...visaForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-phone">رقم الجوال</Label>
                        <Input
                          id="visa-phone"
                          value={visaForm.phone}
                          onChange={(e) => setVisaForm({...visaForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-amount">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="visa-amount"
                          type="number"
                          value={visaForm.amount}
                          onChange={(e) => setVisaForm({...visaForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <Button 
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* معلومات الشركة المحدثة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Info className="w-5 h-5" />
                معلومات الشركة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">شركة علي صالح محمد الشهري القابضة</h4>
                  <p className="text-sm text-muted-foreground">
                    شركة رائدة في مجال التقنية والحلول الرقمية المتطورة
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">السجل التجاري:</span>
                    <span>1010000000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الرقم الضريبي:</span>
                    <span>300000000000003</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">العملة:</span>
                    <span>ريال سعودي (SAR)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* نافذة تفاصيل المعاملة */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل المعاملة</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                {getTransactionIcon(selectedTransaction.transaction_type)}
                <div>
                  <p className="font-medium">
                    {selectedTransaction.transaction_type === 'deposit' ? 'إيداع' :
                     selectedTransaction.transaction_type === 'withdrawal' ? 'سحب' :
                     selectedTransaction.transaction_type === 'payment' ? 'دفع' :
                     selectedTransaction.transaction_type === 'refund' ? 'استرداد' : 
                     selectedTransaction.transaction_type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransaction.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المبلغ:</span>
                  <span className={`font-semibold ${
                    ['deposit', 'refund'].includes(selectedTransaction.transaction_type) 
                      ? 'text-emerald-600' 
                      : 'text-red-600'
                  }`}>
                    {['deposit', 'refund'].includes(selectedTransaction.transaction_type) ? '+' : '-'}
                    {Number(selectedTransaction.amount).toLocaleString('ar-SA')} ر.س
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">الرصيد قبل:</span>
                  <span>{Number(selectedTransaction.balance_before).toLocaleString('ar-SA')} ر.س</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">الرصيد بعد:</span>
                  <span>{Number(selectedTransaction.balance_after).toLocaleString('ar-SA')} ر.س</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span>{new Date(selectedTransaction.created_at).toLocaleString('ar-SA')}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">الحالة:</span>
                  <Badge className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status === 'completed' ? 'مكتمل' :
                     selectedTransaction.status === 'pending' ? 'في الانتظار' :
                     selectedTransaction.status === 'failed' ? 'فاشل' : selectedTransaction.status}
                  </Badge>
                </div>

                {selectedTransaction.reference_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المرجع:</span>
                    <span className="font-mono text-sm">{selectedTransaction.reference_id}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientWallet;