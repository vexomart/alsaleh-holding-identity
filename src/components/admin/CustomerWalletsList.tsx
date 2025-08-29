import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WalletCustomerCard } from "./WalletCustomerCard";
import { WalletTransactionForm } from "./WalletTransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Wallet, Users, DollarSign, TrendingUp, TrendingDown, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface WalletCustomerData {
  user_id: string;
  full_name: string;
  email: string | null;
  account_number: string;
  phone: string | null;
  balance: number;
  currency: string;
  wallet_id: string;
  wallet_number: string; // رقم المحفظة الفعلي
  created_at: string;
  has_wallet?: boolean; // هل يمتلك محفظة
}

interface WalletStats {
  totalCustomers: number;
  totalBalance: number;
  activeWallets: number;
  emptyWallets: number;
  averageBalance: number;
}

export const CustomerWalletsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // جلب بيانات المحافظ مع معلومات العملاء الحقيقية
  const { data: walletsData, isLoading: walletsLoading, refetch: refetchWallets } = useQuery({
    queryKey: ['customer-wallets'],
    queryFn: async () => {
      console.log('🔍 جاري جلب بيانات العملاء والمحافظ...');
      
      // جلب جميع العملاء من profiles أولاً
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email, account_number, phone, created_at')
        .order('created_at', { ascending: false });
        
      if (profilesError) {
        console.error('❌ خطأ في جلب بيانات العملاء:', profilesError);
        throw profilesError;
      }

      // جلب بيانات المحافظ لكل العملاء
      const { data: wallets, error: walletsError } = await supabase
        .from('customer_wallets')
        .select('user_id, balance, currency, id, created_at');
        
      if (walletsError) {
        console.error('❌ خطأ في جلب بيانات المحافظ:', walletsError);
        throw walletsError;
      }

      console.log('✅ تم جلب البيانات:', allProfiles?.length, 'عميل،', wallets?.length, 'محفظة');
      
      // دمج البيانات - الربط بـ user_id بدلاً من id
      return allProfiles?.map((profile: any, index: number) => {
        const wallet = wallets?.find((w: any) => w.user_id === profile.user_id);
        
        return {
          user_id: profile.user_id, // استخدام user_id بدلاً من id
          full_name: profile.full_name || 'غير محدد',
          email: profile.email,
          account_number: profile.account_number || 'غير محدد',
          phone: profile.phone,
          balance: wallet?.balance || 0,
          currency: wallet?.currency || 'SAR',
          wallet_id: wallet?.id || '0',
          wallet_number: wallet ? `WAL-${String(wallet.id).padStart(6, '0')}` : 'لا توجد محفظة',
          created_at: profile.created_at,
          has_wallet: !!wallet
        };
      }) || [];
    },
    refetchInterval: 5000, // تحديث كل 5 ثواني
  });

  // إضافة Realtime subscription للتحديث الفوري
  useEffect(() => {
    const channel = supabase
      .channel('wallet-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_wallets'
        },
        () => {
          refetchWallets();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_transactions'
        },
        () => {
          refetchWallets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchWallets]);

  // حساب الإحصائيات
  const walletStats: WalletStats = {
    totalCustomers: walletsData?.length || 0,
    totalBalance: walletsData?.reduce((sum, wallet) => sum + wallet.balance, 0) || 0,
    activeWallets: walletsData?.filter(wallet => wallet.balance > 0).length || 0,
    emptyWallets: walletsData?.filter(wallet => wallet.balance === 0).length || 0,
    averageBalance: walletsData?.length ? 
      (walletsData.reduce((sum, wallet) => sum + wallet.balance, 0) / walletsData.length) : 0
  };

  // تصفية البيانات
  const filteredWallets = walletsData?.filter(wallet => {
    const matchesSearch = 
      wallet.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.wallet_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.account_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBalance = 
      balanceFilter === 'all' ||
      (balanceFilter === 'active' && wallet.balance > 0) ||
      (balanceFilter === 'empty' && wallet.balance === 0) ||
      (balanceFilter === 'high' && wallet.balance >= 1000) ||
      (balanceFilter === 'low' && wallet.balance > 0 && wallet.balance < 100);

    return matchesSearch && matchesBalance;
  }) || [];

  const handleDeposit = (userId: string, fullName: string) => {
    setSelectedUser({ id: userId, name: fullName });
    setTransactionType('deposit');
    setShowTransactionForm(true);
  };

  const handleWithdraw = (userId: string, fullName: string) => {
    setSelectedUser({ id: userId, name: fullName });
    setTransactionType('withdraw');
    setShowTransactionForm(true);
  };

  const handleViewTransactions = (userId: string, fullName: string) => {
    // سيتم تنفيذ هذه الوظيفة لاحقاً
    toast.info(`عرض معاملات ${fullName} - قريباً`);
  };

  const handleTransactionSuccess = () => {
    refetchWallets();
    toast.success('تم تحديث البيانات بنجاح');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (walletsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">جاري تحميل بيانات المحافظ...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">إجمالي العملاء</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {walletStats.totalCustomers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">إجمالي الأرصدة</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(walletStats.totalBalance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-muted-foreground">محافظ نشطة</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {walletStats.activeWallets}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-muted-foreground">محافظ فارغة</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {walletStats.emptyWallets}
            </div>
          </CardContent>
        </Card>

        {/* معاملات جديدة هذا الشهر */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-muted-foreground">معاملات هذا الشهر</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600">
              {filteredWallets.reduce((sum, w) => sum + (w.has_wallet ? 1 : 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التصفية والبحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالاسم، الإيميل، رقم المحفظة، أو رقم الحساب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={balanceFilter} onValueChange={setBalanceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="تصفية الأرصدة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المحافظ</SelectItem>
                <SelectItem value="active">محافظ نشطة (رصيد &gt; 0)</SelectItem>
                <SelectItem value="empty">محافظ فارغة (رصيد = 0)</SelectItem>
                <SelectItem value="high">أرصدة عالية (≥ 1000 ريال)</SelectItem>
                <SelectItem value="low">أرصدة منخفضة (&lt; 100 ريال)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetchWallets()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* نتائج البحث */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">قائمة المحافظ</h3>
          <p className="text-sm text-muted-foreground">
            عرض {filteredWallets.length} من أصل {walletsData?.length || 0} محفظة
          </p>
        </div>
        {balanceFilter !== 'all' && (
          <Badge variant="secondary">
            تصفية نشطة: {balanceFilter}
          </Badge>
        )}
      </div>

      {/* قائمة المحافظ مع تحسينات العرض */}
      {filteredWallets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد محافظ</h3>
            <p className="text-muted-foreground">
              {searchTerm || balanceFilter !== 'all' 
                ? 'لم يتم العثور على محافظ تطابق معايير البحث المحددة'
                : 'لا توجد محافظ عملاء في النظام حالياً'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            💡 نصيحة: العملاء الذين لديهم محافظ يظهرون برصيدهم الحقيقي، والعملاء بدون محافظ يظهر لهم "لا توجد محفظة"
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWallets.map((customer) => (
              <WalletCustomerCard
                key={customer.user_id}
                customer={customer}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                onViewTransactions={handleViewTransactions}
              />
            ))}
          </div>
        </div>
      )}

      {/* نموذج المعاملات */}
      {showTransactionForm && selectedUser && (
        <WalletTransactionForm
          isOpen={showTransactionForm}
          onClose={() => {
            setShowTransactionForm(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.id}
          customerName={selectedUser.name}
          transactionType={transactionType}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};