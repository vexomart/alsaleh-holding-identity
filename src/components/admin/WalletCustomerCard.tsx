import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Wallet, Mail, CreditCard, Plus, Minus } from "lucide-react";

interface WalletCustomerData {
  user_id: string;
  full_name: string;
  email: string | null;
  account_number: string;
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
    <Card className="hover:shadow-lg transition-shadow duration-200 border-muted">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {getInitials(customer.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {customer.full_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-mono">
                {customer.account_number}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* الرصيد */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-medium">الرصيد الحالي</span>
          </div>
          <div className="text-left">
            <div className={`text-xl font-bold ${getBalanceColor(customer.balance)}`}>
              {formatBalance(customer.balance)}
            </div>
            <Badge variant={customer.balance > 0 ? "default" : "secondary"} className="text-xs">
              {customer.balance > 0 ? "نشط" : "فارغ"}
            </Badge>
          </div>
        </div>

        {/* معلومات الاتصال */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {customer.email || "لا يوجد إيميل"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              عضو منذ {new Date(customer.created_at).toLocaleDateString('ar-SA')}
            </span>
          </div>
        </div>

        {/* أزرار العمليات */}
        <div className="grid grid-cols-1 gap-2 pt-3 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDeposit(customer.user_id, customer.full_name)}
              className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
            >
              <Plus className="h-4 w-4" />
              إيداع
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWithdraw(customer.user_id, customer.full_name)}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              disabled={customer.balance <= 0}
            >
              <Minus className="h-4 w-4" />
              سحب
            </Button>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onViewTransactions(customer.user_id, customer.full_name)}
            className="w-full"
          >
            عرض المعاملات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};