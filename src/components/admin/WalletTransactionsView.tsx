import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, Calendar, CreditCard, User, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface WalletTransactionsViewProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  customerName: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  status: string;
  payment_method: string;
  payment_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  metadata: any;
  created_at: string;
}

export const WalletTransactionsView = ({
  isOpen,
  onClose,
  userId,
  customerName
}: WalletTransactionsViewProps) => {
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['wallet-transactions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: isOpen && !!userId
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'pending':
        return 'معلقة';
      case 'failed':
        return 'فاشلة';
      default:
        return status;
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    return type === 'deposit' ? (
      <ArrowDownRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-600" />
    );
  };

  const getTransactionTypeText = (type: string) => {
    return type === 'deposit' ? 'إيداع' : 'سحب';
  };

  const getTransactionTypeColor = (type: string) => {
    return type === 'deposit' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-5 w-5 text-primary" />
            سجل معاملات المحفظة - {customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات العميل */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{customerName}</p>
                  <p className="text-sm text-muted-foreground">معرف المستخدم: {userId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* قائمة المعاملات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                سجل المعاملات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="mr-2">جاري تحميل المعاملات...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">حدث خطأ في تحميل المعاملات</p>
                </div>
              ) : !transactions || transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لا توجد معاملات لهذا العميل</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {transactions.map((transaction, index) => (
                      <div key={transaction.id}>
                        <div className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full border ${getTransactionTypeColor(transaction.transaction_type)}`}>
                              {getTransactionTypeIcon(transaction.transaction_type)}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {getTransactionTypeText(transaction.transaction_type)}
                                </span>
                                <Badge className={getStatusColor(transaction.status)}>
                                  {getStatusText(transaction.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {transaction.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(transaction.created_at), 'dd MMM yyyy - HH:mm', { locale: ar })}
                                </div>
                                {transaction.payment_method && (
                                  <div className="flex items-center gap-1">
                                    <CreditCard className="h-3 w-3" />
                                    {transaction.payment_method}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-left space-y-1">
                            <div className={`text-lg font-bold ${
                              transaction.transaction_type === 'deposit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.transaction_type === 'deposit' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              الرصيد بعد: {formatCurrency(transaction.balance_after)}
                            </div>
                          </div>
                        </div>
                        {index < transactions.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* زر الإغلاق */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};