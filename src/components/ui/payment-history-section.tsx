import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { CreditCard, ArrowUpDown, Calendar, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  payment_date: string;
  reference_number?: string;
  notes?: string;
  transaction_id?: string;
  invoice_id?: string;
  user_id: string;
  created_at: string;
}

export function PaymentHistorySection() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast.error('خطأ في تحميل سجل المدفوعات');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'refunded': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'failed': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'refunded': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'pending': return 'معلقة';
      case 'failed': return 'فاشلة';
      case 'refunded': return 'مسترددة';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          سجل المدفوعات
        </CardTitle>
        <CardDescription>
          تاريخ جميع المعاملات المالية
        </CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد مدفوعات بعد</p>
            <p className="text-sm">ستظهر هنا جميع المعاملات المالية</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <Card 
                key={payment.id} 
                className="p-4 hover:shadow-md transition-all duration-200 hover-scale"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fade-in 0.5s ease-out forwards'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {payment.amount.toLocaleString()} {payment.currency}
                        </span>
                        <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(payment.status)}
                            {getStatusText(payment.status)}
                          </span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{payment.payment_method}</p>
                        {payment.reference_number && (
                          <p className="text-xs">المرجع: {payment.reference_number}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(payment.payment_date).toLocaleDateString('ar-SA')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(payment.payment_date).toLocaleTimeString('ar-SA')}
                    </div>
                  </div>
                </div>
                {payment.notes && (
                  <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                    <p className="text-muted-foreground">{payment.notes}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}