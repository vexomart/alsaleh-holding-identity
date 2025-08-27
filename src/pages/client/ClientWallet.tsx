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
  Copy
} from 'lucide-react';

interface WalletData {
  id: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  created_at: string;
  status: string;
  reference_id?: string;
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
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
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

  // Bank account details
  const bankDetails = {
    companyName: "شركة علي صالح الشهري القابضة",
    accountNumber: "161000010006086071040",
    iban: "SA1980000161608016071040",
    bankName: "البنك الأهلي السعودي"
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${label} بنجاح`
    });
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
          payment_method: paymentMethod,
          description: `شحن المحفظة بمبلغ ${amount} ريال سعودي`,
          receipt_file: receiptFile ? await fileToBase64(receiptFile) : null
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
        if (data.payment_url) {
          // Redirect to payment gateway
          window.location.href = data.payment_url;
        } else {
          // Payment was processed immediately (bank transfer)
          toast({
            title: "تم إرسال طلب الشحن",
            description: "سيتم مراجعة إيصال التحويل وإضافة المبلغ خلال 24 ساعة",
            variant: "default"
          });
          
          setDepositAmount('');
          setPaymentMethod('');
          setReceiptFile(null);
          setIsDepositOpen(false);
          await fetchWalletData();
        }
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const walletBalance = wallet?.balance || 0;
  const totalDeposits = transactions.filter(t => t.transaction_type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalPayments = Math.abs(transactions.filter(t => t.transaction_type === 'payment').reduce((sum, t) => sum + t.amount, 0));
  const totalRefunds = transactions.filter(t => t.transaction_type === 'refund').reduce((sum, t) => sum + t.amount, 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpCircle className="w-5 h-5 text-green-500" />;
      case 'payment':
        return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
      case 'refund':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <History className="w-5 h-5 text-muted-foreground" />;
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
      'completed': { label: 'مكتمل', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      'pending': { label: 'قيد المعالجة', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      'failed': { label: 'فشل', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    };
    return statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = typeFilter === 'all' || transaction.transaction_type === typeFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-muted rounded-xl"></div>
              <div className="h-32 bg-muted rounded-xl"></div>
              <div className="h-32 bg-muted rounded-xl"></div>
            </div>
            <div className="h-96 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10" dir="rtl">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 animate-fade-in">
              <div className="p-3 bg-gradient-to-r from-primary to-primary/70 rounded-2xl shadow-lg">
                <Wallet className="h-8 w-8 text-primary-foreground" />
              </div>
              المحفظة الرقمية
            </h1>
            <p className="text-lg text-muted-foreground">
              إدارة أموالك وتتبع معاملاتك بسهولة وأمان
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              تصدير كشف حساب
            </Button>
          </div>
        </div>

        {/* Main Balance Card */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 border-0 shadow-2xl animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <CardContent className="relative p-8 text-center text-primary-foreground">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Wallet className="h-12 w-12" />
              </div>
            </div>
            
            <h2 className="text-2xl font-medium mb-4 opacity-90">رصيد المحفظة</h2>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-6xl font-bold">
                {isBalanceVisible ? walletBalance.toFixed(2) : '••••••'}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-primary-foreground hover:bg-white/20"
              >
                {isBalanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            
            <p className="text-xl opacity-90 mb-8">ريال سعودي</p>
            
            <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="secondary" className="hover-scale bg-white text-primary hover:bg-white/90 shadow-lg">
                  <Plus className="h-5 w-5 ml-2" />
                  شحن المحفظة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl">شحن المحفظة</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium">المبلغ (ريال سعودي)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="أدخل المبلغ المراد شحنه"
                      className="text-lg h-12"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 500, 1000].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setDepositAmount(amount.toString())}
                        className="h-10"
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">طريقة الدفع</Label>
                    <Select value={paymentMethod} onValueChange={(value) => {
                      setPaymentMethod(value);
                      setShowBankDetails(value === 'bank_transfer');
                      if (value !== 'bank_transfer') {
                        setReceiptFile(null);
                      }
                    }}>
                      <SelectTrigger className="h-12">
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
                    <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          تفاصيل التحويل البنكي
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">اسم الشركة:</p>
                          <div className="flex items-center justify-between bg-white dark:bg-blue-900 p-2 rounded border">
                            <span className="text-sm">{bankDetails.companyName}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(bankDetails.companyName, "اسم الشركة")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">رقم الحساب:</p>
                          <div className="flex items-center justify-between bg-white dark:bg-blue-900 p-2 rounded border">
                            <span className="text-sm font-mono">{bankDetails.accountNumber}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(bankDetails.accountNumber, "رقم الحساب")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">الآيبان:</p>
                          <div className="flex items-center justify-between bg-white dark:bg-blue-900 p-2 rounded border">
                            <span className="text-sm font-mono">{bankDetails.iban}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(bankDetails.iban, "الآيبان")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                            ⚠️ مهم: يرجى رفع إيصال التحويل البنكي أدناه
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* File Upload for Bank Transfer */}
                  {showBankDetails && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">رفع إيصال التحويل البنكي</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="receipt-upload"
                        />
                        <label htmlFor="receipt-upload" className="cursor-pointer">
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              اضغط لرفع الإيصال (JPG, PNG, PDF)
                            </p>
                            {receiptFile && (
                              <p className="text-sm text-green-600 font-medium">
                                تم اختيار: {receiptFile.name}
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
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    <Zap className="h-5 w-5 ml-2" />
                    {depositing ? 'جاري الشحن...' : 'تأكيد الشحن'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover-scale bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">إجمالي الإيداعات</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {totalDeposits.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600/70">ريال سعودي</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">إجمالي المدفوعات</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {totalPayments.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600/70">ريال سعودي</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-full">
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">إجمالي المبالغ المستردة</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {totalRefunds.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600/70">ريال سعودي</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <ArrowUpCircle className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Section */}
        <Card className="shadow-xl">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <History className="h-6 w-6 text-primary" />
                  سجل المعاملات
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  تاريخ جميع معاملات المحفظة والمدفوعات
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث في المعاملات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
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
          
          <CardContent className="p-6">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="p-6 bg-muted/50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Wallet className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">لا توجد معاملات</h3>
                <p className="text-muted-foreground mb-6">
                  {transactions.length === 0 ? 'ابدأ بشحن محفظتك لتظهر المعاملات هنا' : 'لا توجد معاملات تطابق البحث'}
                </p>
                {transactions.length === 0 && (
                  <Button onClick={() => setIsDepositOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    شحن المحفظة الآن
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction, index) => {
                  const status = getTransactionStatus(transaction.status);
                  return (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all duration-300 hover:shadow-md animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-muted rounded-full">
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold text-foreground text-lg">
                            {transaction.description}
                          </h4>
                          
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(transaction.created_at).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>

                            {transaction.reference_id && (
                              <span className="text-xs text-muted-foreground">
                                #{transaction.reference_id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-left space-y-1">
                        <div className={`text-xl font-bold ${
                          transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                          {Math.abs(transaction.amount).toFixed(2)} ريال
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getTransactionTypeText(transaction.transaction_type)}
                        </div>
                      </div>
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