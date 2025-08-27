import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { 
  CreditCard, 
  Search, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  RefreshCw,
  Banknote
} from 'lucide-react';

const mockPayments = [
  {
    id: '1',
    invoice_id: 'INV-2024-001',
    amount: 15000,
    status: 'completed',
    payment_method: 'bank_transfer',
    payment_date: '2024-01-20',
    project_name: 'تطوير موقع إلكتروني',
    transaction_id: 'TXN-123456789'
  },
  {
    id: '2',
    invoice_id: 'INV-2024-002',
    amount: 7500,
    status: 'pending',
    payment_method: 'credit_card',
    payment_date: '2024-01-18',
    project_name: 'تصميم هوية بصرية',
    transaction_id: 'TXN-987654321'
  },
  {
    id: '3',
    invoice_id: 'INV-2024-003',
    amount: 25000,
    status: 'failed',
    payment_method: 'wallet',
    payment_date: '2024-01-15',
    project_name: 'تطبيق جوال للتسوق',
    transaction_id: 'TXN-456789123'
  },
  {
    id: '4',
    invoice_id: 'INV-2024-004',
    amount: 12000,
    status: 'processing',
    payment_method: 'stc_pay',
    payment_date: '2024-01-12',
    project_name: 'نظام إدارة المحتوى',
    transaction_id: 'TXN-789123456'
  }
];

export default function ClientPayments() {
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'completed': 'مكتمل',
      'pending': 'في الانتظار',
      'processing': 'قيد المعالجة',
      'failed': 'فشل',
      'refunded': 'مسترد'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'bank_transfer': 'تحويل بنكي',
      'credit_card': 'بطاقة ائتمان',
      'wallet': 'محفظة رقمية',
      'stc_pay': 'STC Pay',
      'cash': 'نقداً'
    };
    return methodMap[method] || method;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.payment_method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    failed: payments.filter(p => p.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">المدفوعات</h1>
          <p className="text-muted-foreground">إدارة ومتابعة جميع المدفوعات والمعاملات المالية</p>
        </div>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total.toLocaleString()}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي المدفوعات</div>
            </div>
            <Banknote className="w-8 h-8 text-blue-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed.toLocaleString()}</div>
              <div className="text-sm text-green-700 dark:text-green-300">مدفوعات مكتملة</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending.toLocaleString()}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">في الانتظار</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</div>
              <div className="text-sm text-red-700 dark:text-red-300">مدفوعات فاشلة</div>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في المدفوعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="failed">فشل</SelectItem>
                <SelectItem value="refunded">مسترد</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                <SelectItem value="wallet">محفظة رقمية</SelectItem>
                <SelectItem value="stc_pay">STC Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Grid */}
      {filteredPayments.length > 0 ? (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredPayments.map((payment) => (
            <ResponsiveCard key={payment.id} size="md" className="hover-scale">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {payment.invoice_id}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {payment.project_name}
                    </p>
                    <div className="text-2xl font-bold text-primary">
                      {payment.amount.toLocaleString()} ريال
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(payment.status)}>
                    {getStatusIcon(payment.status)}
                    <span className="mr-1">{getStatusText(payment.status)}</span>
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>طريقة الدفع:</span>
                    <span className="font-medium">{getPaymentMethodText(payment.payment_method)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>تاريخ الدفع:</span>
                    <span>{new Date(payment.payment_date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>رقم المعاملة:</span>
                    <span className="font-mono text-xs">{payment.transaction_id}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد مدفوعات</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || methodFilter !== 'all' 
                ? 'لا توجد مدفوعات مطابقة لمعايير البحث'
                : 'لم يتم إجراء أي مدفوعات حتى الآن'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}