import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Wallet,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Users,
  Search,
  Filter,
  Download,
  CreditCard,
  Building,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Mail,
  Phone,
  User,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  FileText,
  Receipt
} from 'lucide-react';

interface WalletTransaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  reference_id?: string;
  metadata?: any;
  user_email?: string;
  user_name?: string;
}

interface WalletSummary {
  total_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  pending_transactions: number;
  active_users: number;
  today_transactions: number;
  this_month_volume: number;
}

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
}

const AdminWalletEnhanced = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<WalletTransaction[]>([]);
  const [walletSummary, setWalletSummary] = useState<WalletSummary>({
    total_balance: 0,
    total_deposits: 0,
    total_withdrawals: 0,
    pending_transactions: 0,
    active_users: 0,
    today_transactions: 0,
    this_month_volume: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isDeductFundsOpen, setIsDeductFundsOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showBalances, setShowBalances] = useState(false);

  // Add Funds Form
  const [addFundsForm, setAddFundsForm] = useState({
    userId: '',
    amount: '',
    description: '',
    notifyEmail: true,
    requireApproval: false
  });

  // Deduct Funds Form
  const [deductFundsForm, setDeductFundsForm] = useState({
    userId: '',
    amount: '',
    reason: '',
    notifyEmail: true,
    requireApproval: true
  });

  useEffect(() => {
    fetchWalletData();
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterType, filterStatus, dateRange]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch wallet transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (transactionsError) throw transactionsError;

      // Get user details for each transaction
      const userIds = [...new Set(transactionsData?.map(t => t.user_id) || [])];
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      const usersMap = new Map(usersData?.map(user => [user.id, user]) || []);

      // Transform data
      const formattedTransactions: WalletTransaction[] = transactionsData?.map(transaction => ({
        id: transaction.id,
        user_id: transaction.user_id,
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        description: transaction.description,
        status: transaction.status,
        created_at: transaction.created_at,
        reference_id: transaction.reference_id,
        metadata: transaction.metadata,
        user_email: usersMap.get(transaction.user_id)?.email,
        user_name: usersMap.get(transaction.user_id)?.full_name
      })) || [];

      setTransactions(formattedTransactions);

      // Calculate summary
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const summary: WalletSummary = {
        total_balance: 0, // Will be calculated from customer_wallets
        total_deposits: formattedTransactions
          .filter(t => t.transaction_type === 'deposit' && t.status === 'completed')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        total_withdrawals: formattedTransactions
          .filter(t => t.transaction_type === 'withdrawal' && t.status === 'completed')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        pending_transactions: formattedTransactions.filter(t => t.status === 'pending').length,
        active_users: new Set(formattedTransactions.map(t => t.user_id)).size,
        today_transactions: formattedTransactions
          .filter(t => new Date(t.created_at) >= today).length,
        this_month_volume: formattedTransactions
          .filter(t => new Date(t.created_at) >= thisMonth && t.status === 'completed')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      };

      // Get total balance from customer_wallets
      const { data: walletsData } = await supabase
        .from('customer_wallets')
        .select('balance');
      
      summary.total_balance = walletsData?.reduce((sum, wallet) => sum + wallet.balance, 0) || 0;

      setWalletSummary(summary);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "خطأ في تحميل بيانات المحفظة",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone')
        .order('full_name');

      if (error) throw error;

      const formattedUsers: User[] = usersData?.map(user => ({
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.full_name,
          phone: user.phone
        }
      })) || [];

      setAvailableUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.transaction_type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === filterStatus);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(transaction => new Date(transaction.created_at) >= startDate);
    }

    setFilteredTransactions(filtered);
  };

  const handleAddFunds = async () => {
    try {
      if (!addFundsForm.userId || !addFundsForm.amount || !addFundsForm.description) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      const amount = parseFloat(addFundsForm.amount);
      if (amount <= 0) {
        toast({
          title: "خطأ في المبلغ",
          description: "يجب أن يكون المبلغ أكبر من صفر",
          variant: "destructive",
        });
        return;
      }

      // Find user details
      const user = availableUsers.find(u => u.id === addFundsForm.userId);
      if (!user) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على المستخدم المحدد",
          variant: "destructive",
        });
        return;
      }

      console.log('Adding funds to wallet:', {
        userId: addFundsForm.userId,
        amount,
        description: addFundsForm.description
      });

      // Call wallet RPC function
      const { data, error } = await supabase.rpc('process_wallet_transaction', {
        p_user_id: addFundsForm.userId,
        p_transaction_type: 'deposit',
        p_amount: amount,
        p_description: addFundsForm.description,
        p_reference_id: `ADMIN_${Date.now()}`,
        p_metadata: {
          added_by: 'admin',
          requires_approval: addFundsForm.requireApproval,
          notify_email: addFundsForm.notifyEmail
        }
      });

      console.log('RPC response:', { data, error });

      if (error) {
        console.error('Wallet transaction error:', error);
        throw new Error(error.message || 'خطأ في معالجة المعاملة');
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('لم يتم إرجاع بيانات صحيحة من قاعدة البيانات');
      }

      const transaction = data[0];
      const newBalance = transaction?.new_balance || 0;
      const transactionId = transaction?.transaction_id || 'N/A';

      // Send notification email if enabled
      if (addFundsForm.notifyEmail) {
        try {
          await supabase.functions.invoke('customer-notifications', {
            body: {
              type: 'wallet_deposit',
              customer_email: user.email,
              customer_name: user.user_metadata?.full_name || user.email,
              data: {
                amount: amount,
                description: addFundsForm.description,
                new_balance: newBalance,
                transaction_id: transactionId,
                requires_approval: addFundsForm.requireApproval
              }
            }
          });
        } catch (emailError) {
          console.warn('Failed to send notification email:', emailError);
          // Don't fail the whole operation if email fails
        }
      }

      toast({
        title: "تم إضافة الرصيد بنجاح",
        description: `تم إضافة ${amount} ريال إلى محفظة ${user.user_metadata?.full_name || user.email}. الرصيد الجديد: ${newBalance} ريال`,
      });

      setIsAddFundsOpen(false);
      setAddFundsForm({
        userId: '',
        amount: '',
        description: '',
        notifyEmail: true,
        requireApproval: false
      });
      
      // Refresh the data
      await fetchWalletData();
    } catch (error: any) {
      console.error('Error adding funds:', error);
      
      let errorMessage = 'حدث خطأ أثناء إضافة الرصيد';
      
      // Handle specific error types
      if (error.message) {
        if (error.message.includes('Load failed')) {
          errorMessage = 'فشل في الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى';
        } else if (error.message.includes('JWT')) {
          errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى';
        } else if (error.message.includes('permission')) {
          errorMessage = 'ليس لديك صلاحية لتنفيذ هذه العملية';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "خطأ في إضافة الرصيد",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeductFunds = async () => {
    try {
      if (!deductFundsForm.userId || !deductFundsForm.amount || !deductFundsForm.reason) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      const amount = parseFloat(deductFundsForm.amount);
      if (amount <= 0) {
        toast({
          title: "خطأ في المبلغ",
          description: "يجب أن يكون المبلغ أكبر من صفر",
          variant: "destructive",
        });
        return;
      }

      // Find user details
      const user = availableUsers.find(u => u.id === deductFundsForm.userId);
      if (!user) return;

      // Call wallet RPC function
      const { data, error } = await supabase.rpc('process_wallet_transaction', {
        p_user_id: deductFundsForm.userId,
        p_transaction_type: 'withdrawal',
        p_amount: amount,
        p_description: deductFundsForm.reason,
        p_reference_id: `ADMIN-DEDUCT-${Date.now()}`,
        p_metadata: {
          deducted_by: 'admin',
          requires_approval: deductFundsForm.requireApproval,
          notify_email: deductFundsForm.notifyEmail
        }
      });

      if (error) throw error;

      // Send notification email if enabled
      if (deductFundsForm.notifyEmail) {
        await supabase.functions.invoke('customer-notifications', {
          body: {
            type: 'wallet_withdrawal',
            customer_email: user.email,
            customer_name: user.user_metadata?.full_name || user.email,
            data: {
              amount: amount,
              reason: deductFundsForm.reason,
              new_balance: (data as any)?.[0]?.new_balance || 0,
              transaction_id: (data as any)?.[0]?.transaction_id || 'N/A',
              requires_approval: deductFundsForm.requireApproval
            }
          }
        });
      }

      toast({
        title: "تم خصم الرصيد بنجاح",
        description: `تم خصم ${amount} ريال من محفظة ${user.user_metadata?.full_name || user.email}`,
      });

      setIsDeductFundsOpen(false);
      setDeductFundsForm({
        userId: '',
        amount: '',
        reason: '',
        notifyEmail: true,
        requireApproval: true
      });
      fetchWalletData();
    } catch (error: any) {
      console.error('Error deducting funds:', error);
      toast({
        title: "خطأ في خصم الرصيد",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['رقم المعاملة', 'العميل', 'النوع', 'المبلغ', 'الحالة', 'التاريخ', 'الوصف'].join(','),
      ...filteredTransactions.map(transaction => [
        transaction.id,
        transaction.user_name || transaction.user_email,
        getTransactionTypeText(transaction.transaction_type),
        transaction.amount,
        getStatusText(transaction.status),
        new Date(transaction.created_at).toLocaleDateString('ar-SA'),
        transaction.description
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wallet_transactions_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTransactionTypeText = (type: string) => {
    const typeMap = {
      deposit: 'إيداع',
      withdrawal: 'سحب',
      payment: 'دفع',
      refund: 'استرداد',
      transfer: 'تحويل'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getTransactionTypeColor = (type: string) => {
    const colorMap = {
      deposit: 'text-green-600',
      withdrawal: 'text-red-600',
      payment: 'text-blue-600',
      refund: 'text-purple-600',
      transfer: 'text-orange-600'
    };
    return colorMap[type as keyof typeof colorMap] || 'text-gray-600';
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'قيد المراجعة',
      completed: 'مكتمل',
      failed: 'فاشل',
      cancelled: 'ملغي'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTransactionIcon = (type: string) => {
    const iconMap = {
      deposit: <ArrowUpRight className="w-4 h-4 text-green-600" />,
      withdrawal: <ArrowDownLeft className="w-4 h-4 text-red-600" />,
      payment: <CreditCard className="w-4 h-4 text-blue-600" />,
      refund: <RefreshCw className="w-4 h-4 text-purple-600" />,
      transfer: <ArrowUpRight className="w-4 h-4 text-orange-600" />
    };
    return iconMap[type as keyof typeof iconMap] || <DollarSign className="w-4 h-4" />;
  };

  const getStatusIcon = (status: string) => {
    const iconMap = {
      pending: <Clock className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      failed: <AlertCircle className="w-4 h-4" />,
      cancelled: <AlertCircle className="w-4 h-4" />
    };
    return iconMap[status as keyof typeof iconMap] || <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            إدارة المحفظة الرقمية
          </h1>
          <p className="text-muted-foreground mt-2">
            متابعة وإدارة أرصدة العملاء والمعاملات المالية
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
          <Dialog open={isDeductFundsOpen} onOpenChange={setIsDeductFundsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                <Minus className="w-4 h-4 ml-2" />
                خصم رصيد
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Plus className="w-4 h-4 ml-2" />
                إضافة رصيد
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الأرصدة</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${showBalances ? '' : 'blur-sm'}`}>
                    {walletSummary.total_balance.toLocaleString()} ريال
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalances(!showBalances)}
                  >
                    {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإيداعات</p>
                <p className="text-2xl font-bold text-green-600">
                  {walletSummary.total_deposits.toLocaleString()} ريال
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي السحوبات</p>
                <p className="text-2xl font-bold text-red-600">
                  {walletSummary.total_withdrawals.toLocaleString()} ريال
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معاملات معلقة</p>
                <p className="text-2xl font-bold text-orange-600">
                  {walletSummary.pending_transactions}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">عملاء نشطون</p>
                <p className="text-2xl font-bold text-purple-600">
                  {walletSummary.active_users}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-border/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="البحث بالعميل أو المرجع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type">نوع المعاملة</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="deposit">إيداع</SelectItem>
                  <SelectItem value="withdrawal">سحب</SelectItem>
                  <SelectItem value="payment">دفع</SelectItem>
                  <SelectItem value="refund">استرداد</SelectItem>
                  <SelectItem value="transfer">تحويل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">الحالة</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="failed">فاشل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">الفترة الزمنية</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفترات</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">الأسبوع الماضي</SelectItem>
                  <SelectItem value="month">الشهر الماضي</SelectItem>
                  <SelectItem value="quarter">الربع الماضي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={fetchWalletData}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            المعاملات المالية ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{transaction.user_name || transaction.user_email}</h4>
                      <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="mr-1">{getStatusText(transaction.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                      </span>
                      {transaction.reference_id && (
                        <span className="flex items-center gap-1">
                          <Receipt className="w-3 h-3" />
                          {transaction.reference_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <p className={`text-lg font-bold ${getTransactionTypeColor(transaction.transaction_type)}`}>
                    {transaction.transaction_type === 'withdrawal' ? '-' : '+'}
                    {Math.abs(transaction.amount).toLocaleString()} ريال
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getTransactionTypeText(transaction.transaction_type)}
                  </p>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد معاملات</h3>
                <p className="text-muted-foreground">
                  لا توجد معاملات تطابق المعايير المحددة
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Funds Dialog */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            إضافة رصيد للعميل
          </DialogTitle>
          <DialogDescription>
            إضافة رصيد جديد إلى محفظة العميل مع إشعار عبر البريد الإلكتروني
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="client">العميل</Label>
            <Select value={addFundsForm.userId} onValueChange={(value) => setAddFundsForm({...addFundsForm, userId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="اختر العميل" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user.user_metadata?.full_name || user.email}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">المبلغ (ريال)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={addFundsForm.amount}
              onChange={(e) => setAddFundsForm({...addFundsForm, amount: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="description">وصف المعاملة</Label>
            <Textarea
              id="description"
              placeholder="سبب إضافة الرصيد..."
              value={addFundsForm.description}
              onChange={(e) => setAddFundsForm({...addFundsForm, description: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                إرسال إشعار بالبريد الإلكتروني
              </Label>
              <input
                type="checkbox"
                id="notifyEmail"
                checked={addFundsForm.notifyEmail}
                onChange={(e) => setAddFundsForm({...addFundsForm, notifyEmail: e.target.checked})}
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requireApproval" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                يتطلب موافقة العميل
              </Label>
              <input
                type="checkbox"
                id="requireApproval"
                checked={addFundsForm.requireApproval}
                onChange={(e) => setAddFundsForm({...addFundsForm, requireApproval: e.target.checked})}
                className="h-4 w-4"
              />
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              سيتم إضافة الرصيد فوراً إلى محفظة العميل {addFundsForm.notifyEmail && 'مع إرسال إشعار بالبريد الإلكتروني'}
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddFunds} className="flex-1">
              <Plus className="w-4 h-4 ml-2" />
              إضافة الرصيد
            </Button>
            <Button variant="outline" onClick={() => setIsAddFundsOpen(false)} className="flex-1">
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Deduct Funds Dialog */}
      <Dialog open={isDeductFundsOpen} onOpenChange={setIsDeductFundsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-600" />
              خصم رصيد من العميل
            </DialogTitle>
            <DialogDescription>
              خصم مبلغ من محفظة العميل مع إشعار عبر البريد الإلكتروني
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="deductClient">العميل</Label>
              <Select value={deductFundsForm.userId} onValueChange={(value) => setDeductFundsForm({...deductFundsForm, userId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العميل" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {user.user_metadata?.full_name || user.email}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deductAmount">المبلغ (ريال)</Label>
              <Input
                id="deductAmount"
                type="number"
                placeholder="0.00"
                value={deductFundsForm.amount}
                onChange={(e) => setDeductFundsForm({...deductFundsForm, amount: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="reason">سبب الخصم</Label>
              <Textarea
                id="reason"
                placeholder="سبب خصم الرصيد..."
                value={deductFundsForm.reason}
                onChange={(e) => setDeductFundsForm({...deductFundsForm, reason: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="deductNotifyEmail" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  إرسال إشعار بالبريد الإلكتروني
                </Label>
                <input
                  type="checkbox"
                  id="deductNotifyEmail"
                  checked={deductFundsForm.notifyEmail}
                  onChange={(e) => setDeductFundsForm({...deductFundsForm, notifyEmail: e.target.checked})}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="deductRequireApproval" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  يتطلب موافقة العميل
                </Label>
                <input
                  type="checkbox"
                  id="deductRequireApproval"
                  checked={deductFundsForm.requireApproval}
                  onChange={(e) => setDeductFundsForm({...deductFundsForm, requireApproval: e.target.checked})}
                  className="h-4 w-4"
                />
              </div>
            </div>

            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                تأكد من صحة المبلغ والسبب قبل المتابعة. هذا الإجراء لا يمكن التراجع عنه.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleDeductFunds} variant="destructive" className="flex-1">
                <Minus className="w-4 h-4 ml-2" />
                خصم الرصيد
              </Button>
              <Button variant="outline" onClick={() => setIsDeductFundsOpen(false)} className="flex-1">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWalletEnhanced;