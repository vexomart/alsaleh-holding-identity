import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { InvoiceViewer } from '@/components/InvoiceViewer';
import { FileText, Search, Plus, Mail, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  offer_title: string;
  amount: number;
  currency: string;
  status: string;
  issue_date: string;
  transaction_id?: string;
}

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

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
      console.error('خطأ في جلب الفواتير:', error);
      toast.error('فشل في تحميل الفواتير');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'secondary' as const, text: 'في الانتظار', className: 'bg-yellow-500' },
      'generated': { variant: 'outline' as const, text: 'تم الإنشاء', className: 'bg-blue-500' },
      'sent': { variant: 'default' as const, text: 'تم الإرسال', className: 'bg-purple-500' },
      'paid': { variant: 'default' as const, text: 'مدفوع', className: 'bg-green-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { variant: 'outline' as const, text: status, className: 'bg-gray-500' };

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="mr-4 text-lg">جاري تحميل الفواتير...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الفواتير</h1>
          <p className="text-muted-foreground">إدارة وتتبع جميع الفواتير</p>
        </div>
        <Button onClick={fetchInvoices}>
          <Plus className="w-4 h-4 mr-2" />
          تحديث
        </Button>
      </div>

      {/* شريط البحث */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث برقم الفاتورة أو اسم العميل أو الإيميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* قائمة الفواتير */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              الفواتير ({filteredInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد فواتير</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedInvoice === invoice.transaction_id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedInvoice(invoice.transaction_id || null)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{invoice.invoice_number}</h4>
                      <p className="text-sm text-muted-foreground">{invoice.customer_name}</p>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">الخدمة:</span> {invoice.offer_title}</p>
                    <p><span className="font-medium">المبلغ:</span> {invoice.amount} {invoice.currency}</p>
                    <p><span className="font-medium">التاريخ:</span> {new Date(invoice.issue_date).toLocaleDateString('ar-SA')}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // فتح الفاتورة في تبويب جديد
                        window.open(`/invoice/${invoice.id}`, '_blank');
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      عرض
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await supabase.functions.invoke('invoice-system', {
                            body: { 
                              transactionId: invoice.transaction_id,
                              action: 'send'
                            }
                          });
                          toast.success('تم إرسال الفاتورة');
                        } catch (error) {
                          toast.error('فشل في إرسال الفاتورة');
                        }
                      }}
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      إرسال
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* عرض تفاصيل الفاتورة */}
        <div>
          {selectedInvoice ? (
            <InvoiceViewer transactionId={selectedInvoice} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">اختر فاتورة لعرض التفاصيل</h3>
                  <p className="text-muted-foreground">
                    انقر على أي فاتورة من القائمة لعرض تفاصيلها
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;