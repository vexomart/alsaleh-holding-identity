import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Send, FileText, User } from 'lucide-react';
import { toast } from 'sonner';
// InvoiceViewer import removed as it's not used directly in this component

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  status: string;
  payment_status: string;
  offer_title: string;
  created_at: string;
  due_date?: string;
  notes?: string;
  issue_date: string;
}

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('خطأ في جلب الفواتير');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'في الانتظار', variant: 'secondary' as const },
      sent: { label: 'تم الإرسال', variant: 'default' as const },
      paid: { label: 'مدفوع', variant: 'default' as const },
      overdue: { label: 'متأخر', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">إدارة الفواتير</h1>
          <p className="text-muted-foreground">عرض وإدارة جميع الفواتير</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoices List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>قائمة الفواتير</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في الفواتير..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد فواتير</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedInvoice?.id === invoice.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{invoice.invoice_number}</h3>
                          <p className="text-sm text-muted-foreground">{invoice.customer_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{invoice.amount} {invoice.currency}</p>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">{invoice.offer_title}</p>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/invoice-viewer/${invoice.id}`, '_blank');
                          }}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الفاتورة</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInvoice ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{selectedInvoice.invoice_number}</h3>
                      <p className="text-muted-foreground">{selectedInvoice.offer_title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{selectedInvoice.amount} {selectedInvoice.currency}</p>
                      {getStatusBadge(selectedInvoice.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">العميل:</p>
                      <p className="font-medium">{selectedInvoice.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">البريد الإلكتروني:</p>
                      <p className="font-medium">{selectedInvoice.customer_email}</p>
                    </div>
                    {selectedInvoice.customer_phone && (
                      <div>
                        <p className="text-muted-foreground">رقم الهاتف:</p>
                        <p className="font-medium">{selectedInvoice.customer_phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">تاريخ الإصدار:</p>
                      <p className="font-medium">
                        {new Date(selectedInvoice.issue_date || selectedInvoice.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  {selectedInvoice.notes && (
                    <div>
                      <p className="text-muted-foreground text-sm">ملاحظات:</p>
                      <p className="text-sm bg-muted p-2 rounded">{selectedInvoice.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      className="flex-1"
                      onClick={() => window.open(`/invoice-viewer/${selectedInvoice.id}`, '_blank')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      عرض الفاتورة
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Send className="mr-2 h-4 w-4" />
                      إرسال
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">اختر فاتورة لعرض التفاصيل</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;