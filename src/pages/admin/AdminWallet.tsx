import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Wallet,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  DollarSign,
  Calendar,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Smartphone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface WalletTransaction {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  transaction_type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  reference_id?: string;
}

interface WalletSummary {
  total_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  pending_transactions: number;
  active_users: number;
}

const AdminWallet = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<WalletTransaction[]>([]);
  const [summary, setSummary] = useState<WalletSummary>({
    total_balance: 0,
    total_deposits: 0,
    total_withdrawals: 0,
    pending_transactions: 0,
    active_users: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [availableUsers, setAvailableUsers] = useState<Array<{id: string, name: string, email: string}>>([]);

  useEffect(() => {
    fetchWalletData();
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const fetchAvailableUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .limit(20);

      if (error) throw error;

      const users = profiles?.map(profile => ({
        id: profile.id,
        name: profile.full_name || 'غير محدد',
        email: profile.email || 'غير محدد'
      })) || [];

      setAvailableUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      // Fetch wallet transactions
      const { data: walletTransactions, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Transform data
      const transactionsData: WalletTransaction[] = walletTransactions?.map(transaction => ({
        id: transaction.id,
        user_id: transaction.user_id,
        user_name: 'عميل ' + transaction.user_id.slice(-6),
        user_email: 'user@example.com',
        transaction_type: transaction.transaction_type as any,
        amount: transaction.amount,
        description: transaction.description,
        status: transaction.status as any,
        created_at: transaction.created_at,
        reference_id: transaction.reference_id
      })) || [];

      // Fetch wallet summary
      const { data: wallets, error: walletsError } = await supabase
        .from('customer_wallets')
        .select('balance');

      if (walletsError) throw walletsError;

      const totalBalance = wallets?.reduce((sum, wallet) => sum + (wallet.balance || 0), 0) || 0;
      
      const summaryData: WalletSummary = {
        total_balance: totalBalance,
        total_deposits: transactionsData
          .filter(t => t.transaction_type === 'deposit' && t.status === 'completed')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        total_withdrawals: transactionsData
          .filter(t => t.transaction_type === 'withdrawal' && t.status === 'completed')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        pending_transactions: transactionsData.filter(t => t.status === 'pending').length,
        active_users: wallets?.length || 0
      };

      setTransactions(transactionsData);
      setSummary(summaryData);
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

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.transaction_type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionTypeText = (type: string) => {
    const typeMap = {
      deposit: 'إيداع',
      withdrawal: 'سحب',
      payment: 'دفع',
      refund: 'استرداد'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getTransactionTypeColor = (type: string) => {
    const colorMap = {
      deposit: 'bg-green-100 text-green-800 border-green-200',
      withdrawal: 'bg-red-100 text-red-800 border-red-200',
      payment: 'bg-blue-100 text-blue-800 border-blue-200',
      refund: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      completed: 'مكتمل',
      pending: 'في الانتظار',
      failed: 'فشل'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTransactionIcon = (type: string) => {
    const iconMap = {
      deposit: <ArrowDownRight className="w-4 h-4" />,
      withdrawal: <ArrowUpRight className="w-4 h-4" />,
      payment: <CreditCard className="w-4 h-4" />,
      refund: <RefreshCw className="w-4 h-4" />
    };
    return iconMap[type as keyof typeof iconMap] || <CreditCard className="w-4 h-4" />;
  };

  const getStatusIcon = (status: string) => {
    const iconMap = {
      completed: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      failed: <AlertCircle className="w-4 h-4" />
    };
    return iconMap[status as keyof typeof iconMap] || <Clock className="w-4 h-4" />;
  };

  const handleAddFunds = async () => {
    if (!selectedUserId || !amount) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the new admin wallet deposit function
      const { data, error } = await supabase.functions.invoke('admin-wallet-deposit', {
        body: {
          user_id: selectedUserId,
          amount: parseFloat(amount),
          description: description || 'إيداع من الإدارة',
          admin_notes: `إضافة رصيد من لوحة الإدارة - ${new Date().toLocaleString('ar-SA')}`
        }
      });

      if (error) {
        throw new Error(error.message || 'فشل في إضافة الرصيد');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "تم إضافة الرصيد بنجاح",
        description: `تم إضافة ${amount} ريال إلى المحفظة وإرسال إشعار بالبريد الإلكتروني`,
      });
      
      setIsAddFundsDialogOpen(false);
      setSelectedUserId('');
      setAmount('');
      setDescription('');
      
      // Refresh data immediately
      await fetchWalletData();
      
    } catch (error: any) {
      console.error('Error adding funds:', error);
      toast({
        title: "خطأ في إضافة الرصيد",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        
        <Dialog open={isAddFundsDialogOpen} onOpenChange={setIsAddFundsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="w-4 h-4 ml-2" />
              إضافة رصيد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة رصيد للعميل</DialogTitle>
              <DialogDescription>
                إضافة رصيد جديد إلى محفظة العميل
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user">العميل</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} - {user.email}
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  placeholder="وصف العملية..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleAddFunds} className="w-full">
                إضافة الرصيد
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الأرصدة</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.total_balance.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإيداعات</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summary.total_deposits.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ArrowDownRight className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي السحوبات</p>
                <p className="text-2xl font-bold text-red-600">
                  {summary.total_withdrawals.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ArrowUpRight className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معاملات معلقة</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pending_transactions}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">عملاء نشطون</p>
                <p className="text-2xl font-bold text-purple-600">{summary.active_users}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* بيانات الحساب البنكي للشركة */}
      <Card className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 border-2 border-emerald-200 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-emerald-800">
            <Building2 className="w-6 h-6 text-emerald-600" />
            بيانات الحساب البنكي للشركة - بنك الراجحي
          </CardTitle>
          <CardDescription className="text-emerald-700">
            بيانات الحساب المصرفي لاستقبال تحويلات العملاء
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* اسم الحساب */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-800">اسم الحساب</span>
              </div>
              <p className="text-lg font-bold text-emerald-900 bg-emerald-100 p-3 rounded-lg">
                شركة علي صالح محمد الشهري القابضة
              </p>
            </div>

            {/* رقم الحساب */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">رقم الحساب</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('123456789012345')}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 p-2"
                >
                  <CreditCard className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-lg font-bold text-emerald-900 bg-emerald-100 p-3 rounded-lg font-mono">
                123456789012345
              </p>
            </div>

            {/* رقم الآيبان */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">رقم الآيبان</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('SA1234567890123456789012')}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 p-2"
                >
                  <CreditCard className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-lg font-bold text-emerald-900 bg-emerald-100 p-3 rounded-lg font-mono">
                SA1234567890123456789012
              </p>
            </div>

            {/* اسم البنك */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-800">اسم البنك</span>
              </div>
              <p className="text-lg font-bold text-emerald-900 bg-emerald-100 p-3 rounded-lg">
                مصرف الراجحي
              </p>
            </div>

          </div>

          {/* تعليمات للأدمين */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">ملاحظات للإدارة:</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• هذه البيانات معروضة للعملاء في لوحة التحكم الخاصة بهم</li>
                  <li>• يجب مراجعة طلبات التحويل الواردة يومياً</li>
                  <li>• التأكد من مطابقة بيانات التحويل مع طلبات العملاء</li>
                  <li>• إضافة الرصيد للعميل بعد التأكد من صحة التحويل</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="نوع المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="deposit">إيداع</SelectItem>
                <SelectItem value="withdrawal">سحب</SelectItem>
                <SelectItem value="payment">دفع</SelectItem>
                <SelectItem value="refund">استرداد</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="حالة المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="failed">فشل</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>

            <Button variant="outline" onClick={fetchWalletData}>
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>سجل المعاملات</CardTitle>
          <CardDescription>
            جميع المعاملات المالية في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getTransactionTypeColor(transaction.transaction_type).replace('text-', 'bg-').replace('800', '100')}`}>
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{transaction.user_name}</span>
                      <Badge className={`text-xs ${getTransactionTypeColor(transaction.transaction_type)}`}>
                        {getTransactionTypeText(transaction.transaction_type)}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="mr-1">{getStatusText(transaction.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.user_email} • {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                
                <div className="text-left">
                  <p className={`text-lg font-bold ${
                    transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                    {Math.abs(transaction.amount).toLocaleString()} ريال
                  </p>
                  {transaction.reference_id && (
                    <p className="text-xs text-muted-foreground font-mono">
                      {transaction.reference_id}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد معاملات</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على معاملات تطابق معايير البحث
              </p>
            </div>
          )}
        </CardContent>
      </Card>
        {/* إضافة قسم طرق الدفع للأدمن */}
        <Card className="border border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              طرق الدفع المتاحة للعملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center bg-blue-50">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-sm">البنك الراجحي</p>
                <Badge className="mt-1 bg-blue-100 text-blue-800">متاح</Badge>
              </div>
              <div className="p-4 border rounded-lg text-center bg-purple-50">
                <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium text-sm">STC Pay</p>
                <Badge className="mt-1 bg-purple-100 text-purple-800">متاح</Badge>
              </div>
              <div className="p-4 border rounded-lg text-center bg-green-50">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium text-sm">تمارا</p>
                <Badge className="mt-1 bg-green-100 text-green-800">متاح</Badge>
              </div>
              <div className="p-4 border rounded-lg text-center bg-indigo-50">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <p className="font-medium text-sm">Visa/MasterCard</p>
                <Badge className="mt-1 bg-indigo-100 text-indigo-800">متاح</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* استمرار باقي المحتوى */}
      </div>
  );
};

export default AdminWallet;