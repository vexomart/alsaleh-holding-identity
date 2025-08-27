import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpCircle, 
  ArrowDownCircle,
  CreditCard,
  Banknote,
  Calendar,
  TrendingUp,
  TrendingDown,
  History,
  Shield
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
}

export default function ClientWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchWalletData();
  }, []);

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

  const walletBalance = wallet?.balance || 0;
  const totalDeposits = transactions.filter(t => t.transaction_type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalPayments = Math.abs(transactions.filter(t => t.transaction_type === 'payment').reduce((sum, t) => sum + t.amount, 0));
  const totalRefunds = transactions.filter(t => t.transaction_type === 'refund').reduce((sum, t) => sum + t.amount, 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpCircle className="w-4 h-4 text-green-600" />;
      case 'payment':
        return <ArrowDownCircle className="w-4 h-4 text-red-600" />;
      case 'refund':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return <History className="w-4 h-4" />;
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

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const filteredTransactions = transactions.filter(transaction => {
    return typeFilter === 'all' || transaction.transaction_type === typeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">المحفظة الرقمية</h1>
          <p className="text-muted-foreground">إدارة رصيد المحفظة والمعاملات المالية</p>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <ResponsiveCard size="lg" className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-lg font-medium text-muted-foreground mb-2">رصيد المحفظة الحالي</h2>
          <div className="text-4xl font-bold text-primary mb-6">
            {walletBalance.toLocaleString()} ريال
          </div>
          <div className="flex gap-4 justify-center">
            <Button className="flex-1 max-w-xs">
              <Plus className="w-4 h-4 mr-2" />
              إضافة رصيد
            </Button>
            <Button variant="outline" className="flex-1 max-w-xs">
              <CreditCard className="w-4 h-4 mr-2" />
              سحب رصيد
            </Button>
          </div>
        </div>
      </ResponsiveCard>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-3" gap="md">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalDeposits.toLocaleString()}</div>
              <div className="text-sm text-green-700 dark:text-green-300">إجمالي الإيداعات</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalPayments.toLocaleString()}</div>
              <div className="text-sm text-red-700 dark:text-red-300">إجمالي المدفوعات</div>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRefunds.toLocaleString()}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي المبالغ المستردة</div>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Quick Deposit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة رصيد سريع
          </CardTitle>
          <CardDescription>
            أضف رصيد إلى محفظتك بسرعة وأمان
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="المبلغ بالريال السعودي"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              type="number"
              className="flex-1"
            />
            <div className="flex gap-2">
              {[1000, 2000, 5000].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setDepositAmount(amount.toString())}
                >
                  {amount.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              إضافة رصيد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                سجل المعاملات
              </CardTitle>
              <CardDescription>
                تاريخ جميع معاملات المحفظة
              </CardDescription>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{transaction.description}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(transaction.created_at).toLocaleDateString('ar-SA')}</span>
                      <Badge variant="outline" className="text-xs">
                        {getTransactionTypeText(transaction.transaction_type)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getAmountColor(transaction.amount)}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} ريال
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}