import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { 
  Receipt, 
  Search, 
  Calendar, 
  Download,
  Eye,
  FileText,
  DollarSign,
  CheckCircle,
  Filter,
  Printer,
  Mail
} from 'lucide-react';

const mockReceipts = [
  {
    id: '1',
    receipt_number: 'RCP-2024-001',
    invoice_number: 'INV-2024-001',
    amount: 15000,
    vat_amount: 2250,
    total_amount: 17250,
    date: '2024-01-20',
    project_name: 'تطوير موقع إلكتروني',
    payment_method: 'bank_transfer',
    status: 'paid',
    currency: 'SAR'
  },
  {
    id: '2',
    receipt_number: 'RCP-2024-002',
    invoice_number: 'INV-2024-002',
    amount: 7500,
    vat_amount: 1125,
    total_amount: 8625,
    date: '2024-01-18',
    project_name: 'تصميم هوية بصرية',
    payment_method: 'credit_card',
    status: 'paid',
    currency: 'SAR'
  },
  {
    id: '3',
    receipt_number: 'RCP-2024-003',
    invoice_number: 'INV-2024-003',
    amount: 25000,
    vat_amount: 3750,
    total_amount: 28750,
    date: '2024-01-15',
    project_name: 'تطبيق جوال للتسوق',
    payment_method: 'wallet',
    status: 'paid',
    currency: 'SAR'
  },
  {
    id: '4',
    receipt_number: 'RCP-2024-004',
    invoice_number: 'INV-2024-004',
    amount: 12000,
    vat_amount: 1800,
    total_amount: 13800,
    date: '2024-01-12',
    project_name: 'نظام إدارة المحتوى',
    payment_method: 'stc_pay',
    status: 'paid',
    currency: 'SAR'
  }
];

export default function ClientReceipts() {
  const [receipts, setReceipts] = useState(mockReceipts);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');

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

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const receiptDate = new Date(receipt.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'this_month':
          matchesDate = receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear();
          break;
        case 'last_month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          matchesDate = receiptDate.getMonth() === lastMonth.getMonth() && receiptDate.getFullYear() === lastMonth.getFullYear();
          break;
        case 'this_year':
          matchesDate = receiptDate.getFullYear() === now.getFullYear();
          break;
      }
    }

    let matchesAmount = true;
    if (amountFilter !== 'all') {
      switch (amountFilter) {
        case 'under_10k':
          matchesAmount = receipt.total_amount < 10000;
          break;
        case '10k_to_25k':
          matchesAmount = receipt.total_amount >= 10000 && receipt.total_amount <= 25000;
          break;
        case 'over_25k':
          matchesAmount = receipt.total_amount > 25000;
          break;
      }
    }
    
    return matchesSearch && matchesDate && matchesAmount;
  });

  const stats = {
    total: receipts.length,
    totalAmount: receipts.reduce((sum, r) => sum + r.total_amount, 0),
    totalVat: receipts.reduce((sum, r) => sum + r.vat_amount, 0),
    thisMonth: receipts.filter(r => {
      const date = new Date(r.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الإيصالات</h1>
          <p className="text-muted-foreground">عرض وتحميل جميع إيصالات الدفع</p>
        </div>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي الإيصالات</div>
            </div>
            <Receipt className="w-8 h-8 text-blue-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalAmount.toLocaleString()}</div>
              <div className="text-sm text-green-700 dark:text-green-300">إجمالي المبلغ</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalVat.toLocaleString()}</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">إجمالي الضريبة</div>
            </div>
            <FileText className="w-8 h-8 text-orange-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.thisMonth}</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">هذا الشهر</div>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
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
                placeholder="البحث في الإيصالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="فترة زمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفترات</SelectItem>
                <SelectItem value="this_month">هذا الشهر</SelectItem>
                <SelectItem value="last_month">الشهر الماضي</SelectItem>
                <SelectItem value="this_year">هذا العام</SelectItem>
              </SelectContent>
            </Select>
            <Select value={amountFilter} onValueChange={setAmountFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="المبلغ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المبالغ</SelectItem>
                <SelectItem value="under_10k">أقل من 10,000</SelectItem>
                <SelectItem value="10k_to_25k">10,000 - 25,000</SelectItem>
                <SelectItem value="over_25k">أكثر من 25,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Receipts Grid */}
      {filteredReceipts.length > 0 ? (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredReceipts.map((receipt) => (
            <ResponsiveCard key={receipt.id} size="md" className="hover-scale">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {receipt.receipt_number}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      فاتورة: {receipt.invoice_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {receipt.project_name}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    مدفوع
                  </Badge>
                </div>

                <div className="space-y-2 border rounded-lg p-3 bg-muted/30">
                  <div className="flex justify-between text-sm">
                    <span>المبلغ:</span>
                    <span className="font-medium">{receipt.amount.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span className="font-medium">{receipt.vat_amount.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t pt-2">
                    <span>المجموع:</span>
                    <span className="text-primary">{receipt.total_amount.toLocaleString()} ريال</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>تاريخ الدفع:</span>
                    <span>{new Date(receipt.date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>طريقة الدفع:</span>
                    <span className="font-medium">{getPaymentMethodText(receipt.payment_method)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد إيصالات</h3>
            <p className="text-muted-foreground">
              {searchTerm || dateFilter !== 'all' || amountFilter !== 'all'
                ? 'لا توجد إيصالات مطابقة لمعايير البحث'
                : 'لم يتم إصدار أي إيصالات حتى الآن'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>تصدير وطباعة الإيصالات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              تحميل جميع الإيصالات (PDF)
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              تصدير إلى Excel
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              إرسال الإيصالات بالبريد
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}