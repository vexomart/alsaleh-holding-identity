import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Plus, 
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  Trash2,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle,
  History,
  Crown,
  Building,
  CreditCard,
  Banknote,
  UserCheck,
  UserX,
  Settings,
  FileText,
  Activity,
  Target,
  Award
} from 'lucide-react';

interface WalletData {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
    client_id?: string;
  };
}

interface TransactionData {
  id: string;
  user_id: string;
  wallet_id: string;
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

const AdminWallets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [newTransactionForm, setNewTransactionForm] = useState({
    user_id: '',
    transaction_type: 'deposit',
    amount: '',
    description: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // جلب جميع المحافظ
  const { data: wallets, isLoading: walletsLoading, refetch: refetchWallets } = useQuery({
    queryKey: ['admin-wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_wallets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب المحافظ:', error);
        throw error;
      }

      return data || [];
    }
  });

  // جلب إحصائيات المحافظ
  const { data: walletStats } = useQuery({
    queryKey: ['wallet-stats'],
    queryFn: async () => {
      const { data: walletsData, error: walletsError } = await supabase
        .from('customer_wallets')
        .select('balance');

      if (walletsError) throw walletsError;

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('transaction_type, amount, status')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (transactionsError) throw transactionsError;

      const totalBalance = walletsData?.reduce((sum, w) => sum + Number(w.balance), 0) || 0;
      const totalDeposits = transactionsData?.filter(t => t.transaction_type === 'deposit').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalWithdrawals = transactionsData?.filter(t => t.transaction_type === 'withdrawal').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const pendingTransactions = transactionsData?.filter(t => t.status === 'pending').length || 0;

      return {
        totalWallets: walletsData?.length || 0,
        totalBalance,
        totalDeposits,
        totalWithdrawals,
        pendingTransactions
      };
    }
  });

  // جلب معاملات المحفظة المحددة
  const { data: walletTransactions } = useQuery({
    queryKey: ['wallet-transactions', selectedWallet?.id],
    queryFn: async () => {
      if (!selectedWallet) return [];

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', selectedWallet.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedWallet
  });

  // إنشاء معاملة جديدة
  const handleCreateTransaction = async () => {
    try {
      const amount = parseFloat(newTransactionForm.amount);
      if (!amount || amount <= 0) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى إدخال مبلغ صحيح",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.rpc('process_wallet_transaction', {
        p_user_id: newTransactionForm.user_id,
        p_transaction_type: newTransactionForm.transaction_type,
        p_amount: amount,
        p_description: newTransactionForm.description || 'معاملة من لوحة الإدمن',
        p_reference_id: `ADMIN-${Date.now()}`,
        p_metadata: { created_by_admin: true }
      });

      if (error) throw error;

      toast({
        title: "تم إنشاء المعاملة",
        description: "تم إنشاء المعاملة بنجاح",
      });

      // إعادة تحميل البيانات
      refetchWallets();
      queryClient.invalidateQueries({ queryKey: ['wallet-stats'] });
      
      // إغلاق النافذة وإعادة تعيين النموذج
      setIsTransactionDialogOpen(false);
      setNewTransactionForm({
        user_id: '',
        transaction_type: 'deposit',
        amount: '',
        description: ''
      });

    } catch (error) {
      console.error('خطأ في إنشاء المعاملة:', error);
      toast({
        title: "خطأ في إنشاء المعاملة",
        description: "حدث خطأ أثناء إنشاء المعاملة",
        variant: "destructive"
      });
    }
  };

  // تصفية المحافظ
  const filteredWallets = wallets?.filter(wallet => {
    const matchesSearch = 
      wallet.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && wallet.balance > 0) ||
      (filterStatus === 'empty' && wallet.balance === 0);

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

  if (walletsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Crown className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg font-medium">جاري تحميل نظام المحافظ الرقمية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              إدارة المحافظ الرقمية
            </h1>
            <p className="text-muted-foreground mt-1">
              نظام شامل لإدارة وإصدار المحافظ الرقمية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => refetchWallets()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
          <Button onClick={() => setIsTransactionDialogOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            معاملة جديدة
          </Button>
        </div>
      </div>

      {/* الإحصائيات الشاملة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            title: "إجمالي المحافظ",
            value: walletStats?.totalWallets || 0,
            icon: Wallet,
            color: "blue",
            suffix: "محفظة"
          },
          {
            title: "إجمالي الأرصدة",
            value: walletStats?.totalBalance || 0,
            icon: Banknote,
            color: "emerald",
            suffix: "ر.س",
            format: true
          },
          {
            title: "إجمالي الإيداعات",
            value: walletStats?.totalDeposits || 0,
            icon: ArrowUpRight,
            color: "green",
            suffix: "ر.س",
            format: true
          },
          {
            title: "إجمالي المسحوبات",
            value: walletStats?.totalWithdrawals || 0,
            icon: ArrowDownLeft,
            color: "red",
            suffix: "ر.س",
            format: true
          },
          {
            title: "معاملات في الانتظار",
            value: walletStats?.pendingTransactions || 0,
            icon: Clock,
            color: "amber",
            suffix: "معاملة"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold">
                  {stat.format 
                    ? `${Number(stat.value).toLocaleString('ar-SA')} ${stat.suffix}`
                    : `${stat.value} ${stat.suffix}`
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* جدول المحافظ */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">قائمة المحافظ الرقمية</CardTitle>
              <CardDescription>إدارة شاملة لجميع المحافظ المسجلة</CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالاسم أو الإيميل أو معرف العميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المحافظ</SelectItem>
                  <SelectItem value="active">محافظ نشطة</SelectItem>
                  <SelectItem value="empty">محافظ فارغة</SelectItem>
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
          <div className="space-y-4">
            {filteredWallets.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">لا توجد محافظ</p>
                <p className="text-muted-foreground">ابدأ بإنشاء المحافظ الرقمية</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredWallets.map((wallet, index) => (
                  <motion.div
                    key={wallet.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Wallet className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            مستخدم: {wallet.user_id.slice(-8)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            محفظة رقمية
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          معرف المستخدم: {wallet.user_id.slice(-12)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          معرف المحفظة: {wallet.id.slice(-12)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {Number(wallet.balance).toLocaleString('ar-SA')} ر.س
                        </p>
                        <p className="text-xs text-muted-foreground">
                          الرصيد الحالي
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={wallet.balance > 0 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {wallet.balance > 0 ? 'نشط' : 'فارغ'}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedWallet(wallet)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* نافذة تفاصيل المحفظة */}
      <Dialog open={!!selectedWallet} onOpenChange={() => setSelectedWallet(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Wallet className="w-6 h-6" />
              تفاصيل المحفظة الرقمية
            </DialogTitle>
          </DialogHeader>
          
          {selectedWallet && (
            <div className="space-y-6">
              {/* معلومات المحفظة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      معلومات العميل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">نوع المحفظة:</span>
                      <span className="font-medium">محفظة رقمية</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">حالة المحفظة:</span>
                      <span className="font-medium">
                        {selectedWallet.balance > 0 ? 'نشط' : 'فارغ'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">العملة:</span>
                      <span className="font-medium">{selectedWallet.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">معرف المستخدم:</span>
                      <span className="font-mono text-sm">
                        {selectedWallet.user_id.slice(-12)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Banknote className="w-5 h-5" />
                      معلومات المحفظة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الرصيد الحالي:</span>
                      <span className="font-bold text-lg text-primary">
                        {Number(selectedWallet.balance).toLocaleString('ar-SA')} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">العملة:</span>
                      <span className="font-medium">{selectedWallet.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                      <span className="font-medium">
                        {new Date(selectedWallet.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">آخر تحديث:</span>
                      <span className="font-medium">
                        {new Date(selectedWallet.updated_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* سجل المعاملات */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="w-5 h-5" />
                    سجل المعاملات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!walletTransactions || walletTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">لا توجد معاملات</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-auto">
                      {walletTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(transaction.transaction_type)}
                            <div>
                              <p className="font-medium text-sm">
                                {transaction.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleString('ar-SA')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`font-semibold text-sm ${
                                ['deposit', 'refund'].includes(transaction.transaction_type) 
                                  ? 'text-emerald-600' 
                                  : 'text-red-600'
                              }`}>
                                {['deposit', 'refund'].includes(transaction.transaction_type) ? '+' : '-'}
                                {Number(transaction.amount).toLocaleString('ar-SA')} ر.س
                              </p>
                            </div>
                            <Badge className={getStatusColor(transaction.status) + ' text-xs'}>
                              {transaction.status === 'completed' ? 'مكتمل' :
                               transaction.status === 'pending' ? 'انتظار' :
                               transaction.status === 'failed' ? 'فاشل' : transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة إنشاء معاملة جديدة */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إنشاء معاملة مالية جديدة</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="user_id">معرف المستخدم</Label>
              <Input
                id="user_id"
                value={newTransactionForm.user_id}
                onChange={(e) => setNewTransactionForm(prev => ({
                  ...prev,
                  user_id: e.target.value
                }))}
                placeholder="معرف المستخدم (UUID)"
              />
            </div>

            <div>
              <Label htmlFor="transaction_type">نوع المعاملة</Label>
              <Select 
                value={newTransactionForm.transaction_type} 
                onValueChange={(value) => setNewTransactionForm(prev => ({
                  ...prev,
                  transaction_type: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">إيداع</SelectItem>
                  <SelectItem value="withdrawal">سحب</SelectItem>
                  <SelectItem value="payment">دفع</SelectItem>
                  <SelectItem value="refund">استرداد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">المبلغ (ر.س)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={newTransactionForm.amount}
                onChange={(e) => setNewTransactionForm(prev => ({
                  ...prev,
                  amount: e.target.value
                }))}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={newTransactionForm.description}
                onChange={(e) => setNewTransactionForm(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="وصف المعاملة..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsTransactionDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleCreateTransaction}>
                <Plus className="w-4 h-4 mr-2" />
                إنشاء المعاملة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWallets;