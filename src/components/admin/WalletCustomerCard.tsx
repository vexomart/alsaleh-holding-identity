import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Wallet, Mail, CreditCard, Plus, Minus } from "lucide-react";
import { WalletTransactionsView } from "./WalletTransactionsView";

interface WalletCustomerData {
  user_id: string;
  full_name: string;
  email: string | null;
  account_number: string;
  phone: string | null;
  balance: number;
  currency: string;
  wallet_id: string;
  created_at: string;
}

interface WalletCustomerCardProps {
  customer: WalletCustomerData;
  onDeposit: (userId: string, fullName: string) => void;
  onWithdraw: (userId: string, fullName: string) => void;
  onViewTransactions: (userId: string, fullName: string) => void;
}

export const WalletCustomerCard = ({ 
  customer, 
  onDeposit, 
  onWithdraw, 
  onViewTransactions 
}: WalletCustomerCardProps) => {
  const [showTransactions, setShowTransactions] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(balance);
  };

  const getBalanceColor = (balance: number) => {
    if (balance >= 1000) return 'text-emerald-600';
    if (balance >= 100) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary/60 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg">
              {getInitials(customer.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold truncate text-slate-800 dark:text-slate-100">
              {customer.full_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {customer.account_number}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* الرصيد مع تصميم محسن */}
        <div className="relative p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">الرصيد الحالي</span>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getBalanceColor(customer.balance)}`}>
                {formatBalance(customer.balance)}
              </div>
              <Badge 
                variant={customer.balance > 0 ? "default" : "secondary"} 
                className={`text-xs mt-1 ${customer.balance > 0 ? 'bg-emerald-600' : 'bg-slate-400'}`}
              >
                {customer.balance > 0 ? "نشط" : "فارغ"}
              </Badge>
            </div>
          </div>
        </div>

        {/* معلومات الاتصال محسنة */}
        <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
          <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">معلومات التواصل</h4>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-300 flex-1">
              {customer.email || "لا يوجد إيميل مسجل"}
            </span>
          </div>

          {customer.phone && (
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-slate-600 dark:text-slate-300">{customer.phone}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
              <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-slate-600 dark:text-slate-300">
              عضو منذ {new Date(customer.created_at).toLocaleDateString('ar-SA')}
            </span>
          </div>
        </div>

        {/* أزرار العمليات محسنة */}
        <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/50">
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              onClick={() => onDeposit(customer.user_id, customer.full_name)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              إيداع
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWithdraw(customer.user_id, customer.full_name)}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 shadow-sm hover:shadow-md transition-all duration-200"
              disabled={customer.balance <= 0}
            >
              <Minus className="h-4 w-4" />
              سحب
            </Button>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowTransactions(true)}
            className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-500 shadow-sm hover:shadow-md transition-all duration-200"
          >
            عرض المعاملات والسجل
          </Button>
        </div>
      </CardContent>

      {/* مكون عرض المعاملات */}
      <WalletTransactionsView
        isOpen={showTransactions}
        onClose={() => setShowTransactions(false)}
        userId={customer.user_id}
        customerName={customer.full_name}
      />
    </Card>
  );
};