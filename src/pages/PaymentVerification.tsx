import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, AlertTriangle, Home, Download, Receipt, FileText, Loader2 } from 'lucide-react';
import { db, supabase } from '@/integrations/supabase/db';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { downloadInvoicePdf, type InvoiceDataLegacy } from '@/lib/invoices';
import { useToast } from '@/hooks/use-toast';

interface PaymentTransaction {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  offer_title: string;
  payment_method: string;
  paylink_transaction_no?: string;
  tap_charge_id?: string;
  tamara_order_id?: string;
  status: string;
  created_at: string;
}

interface ProductOrder {
  id: string;
  order_number: string;
  product_name: string;
  product_version: string;
  status: string;
  created_at: string;
}

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [productOrder, setProductOrder] = useState<ProductOrder | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'verifying' | 'success' | 'failed' | 'pending' | 'not_found'>('loading');
  const [verificationProgress, setVerificationProgress] = useState(0);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get transaction ID from URL parameters
        const transactionId = searchParams.get('transactionId') || 
                             searchParams.get('transaction_no') ||
                             searchParams.get('paymentId') ||
                             searchParams.get('id');

        console.log('Starting payment verification for:', transactionId);

        if (!transactionId) {
          setVerificationStatus('not_found');
          return;
        }

        setVerificationProgress(20);

        // Fetch transaction details
        const { data: transactions, error: fetchError } = await db
          .from('payment_transactions')
          .select('*')
          .or(`id.eq.${transactionId},paylink_transaction_no.eq.${transactionId},tap_charge_id.eq.${transactionId},tamara_order_id.eq.${transactionId}`)
          .limit(1);

        if (fetchError || !transactions || transactions.length === 0) {
          console.error('Transaction not found:', fetchError);
          setVerificationStatus('not_found');
          return;
        }

        const transactionData = transactions[0] as any;
        setTransaction(transactionData);
        setVerificationProgress(40);

        // Fetch related product order if exists
        const metadata = transactionData.metadata as any;
        const paymentReference = metadata?.paylink_transaction_no || 
                                metadata?.tap_charge_id || 
                                metadata?.tamara_order_id || 
                                transactionData.transaction_id;
        
        const { data: orders } = await db
          .from('product_orders')
          .select('*')
          .eq('payment_reference', paymentReference)
          .limit(1);

        if (orders && orders.length > 0) {
          setProductOrder(orders[0]);
        }

        setVerificationProgress(60);
        setVerificationStatus('verifying');

        // Verify payment status with payment gateway
        const { data: verificationResult, error: verifyError } = await supabase.functions.invoke('verify-payment-status', {
          body: { transactionId: transactionData.id }
        });

        setVerificationProgress(80);

        if (verifyError) {
          console.error('Payment verification error:', verifyError);
          setVerificationStatus('failed');
        } else {
          console.log('Verification result:', verificationResult);
          
          if (verificationResult?.success) {
            if (verificationResult.status === 'PAID' || verificationResult.status === 'paid') {
              setVerificationStatus('success');
            } else if (verificationResult.status === 'PENDING' || verificationResult.status === 'pending') {
              setVerificationStatus('pending');
            } else {
              setVerificationStatus('failed');
            }
          } else {
            setVerificationStatus('failed');
          }
        }

        setVerificationProgress(100);

      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerificationStatus('failed');
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Download invoice function
  const downloadInvoice = async () => {
    if (!transaction) return;
    
    try {
      const amount = Number(transaction.amount) || 0;
      const vatRate = 0.15;
      const subtotal = amount / (1 + vatRate);
      const vatAmount = amount - subtotal;
      
      const invoiceData: InvoiceDataLegacy = {
        invoiceNumber: `INV-${transaction.paylink_transaction_no || transaction.tap_charge_id || transaction.id}`,
        date: new Date().toISOString(),
        seller: {
          name: 'شركة علي صالح الشهري القابضة',
          vatNumber: '310123456789012',
        },
        buyer: {
          name: transaction.customer_name || 'عميل',
        },
        items: [{
          description: transaction.offer_title || 'خدمة',
          quantity: 1,
          unitPrice: subtotal,
        }],
        subtotal,
        vatRate,
        vatAmount,
        total: amount,
        currency: transaction.currency || 'SAR',
        notes: verificationStatus === 'success' ? 'تم الدفع بنجاح' : 
               verificationStatus === 'pending' ? 'قيد المعالجة' : 'ملغى',
      };
      
      await downloadInvoicePdf(invoiceData);
      toast({
        title: "تم تحميل الفاتورة",
        description: "تم تحميل الفاتورة بنجاح"
      });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل الفاتورة"
      });
    }
  };

  // Send invoice via email
  const sendInvoiceEmail = async () => {
    if (!transaction) return;
    
    try {
      const invoiceData = {
        customerEmail: transaction.customer_email,
        customerName: transaction.customer_name || 'عميل',
        invoiceNumber: `INV-${transaction.paylink_transaction_no || transaction.tap_charge_id || transaction.id}`,
        amount: Number(transaction.amount) || 0,
        currency: transaction.currency || 'SAR',
        serviceName: transaction.offer_title || 'خدمة',
        transactionId: transaction.paylink_transaction_no || transaction.tap_charge_id || transaction.id,
        orderStatus: verificationStatus === 'success' ? '✅ تم الدفع - جاري التنفيذ' : 
                    verificationStatus === 'pending' ? '⏳ قيد المعالجة' : '❌ مُلغى',
      };
      
      const response = await supabase.functions.invoke('send-invoice-email', {
        body: invoiceData
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast({
        title: "تم إرسال الفاتورة",
        description: "تم إرسال الفاتورة إلى إيميلك بنجاح"
      });
    } catch (error) {
      console.error('Error sending invoice email:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الفاتورة"
      });
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-600" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-600" />;
      case 'not_found':
        return <AlertTriangle className="w-16 h-16 text-orange-600" />;
      default:
        return <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return '🎉 تم الدفع بنجاح!';
      case 'pending':
        return '⏳ الدفع قيد المعالجة';
      case 'failed':
        return '❌ فشل في الدفع';
      case 'not_found':
        return '🔍 لم يتم العثور على المعاملة';
      case 'verifying':
        return '🔍 جاري التحقق من الدفع...';
      default:
        return '⚡ جاري تحميل البيانات...';
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case 'success':
        return 'تم تأكيد دفعتك بنجاح وسيتم معالجة طلبك فوراً';
      case 'pending':
        return 'دفعتك قيد المراجعة، سنرسل إليك تأكيد عند اكتمال العملية';
      case 'failed':
        return 'لم تكتمل عملية الدفع، يرجى المحاولة مرة أخرى أو التواصل مع الدعم';
      case 'not_found':
        return 'لم يتم العثور على معاملة الدفع، تأكد من صحة الرابط';
      case 'verifying':
        return 'نتحقق من حالة دفعتك مع البنك...';
      default:
        return 'جاري تحميل معلومات المعاملة...';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success':
        return 'from-green-50 to-emerald-50';
      case 'pending':
        return 'from-yellow-50 to-orange-50';
      case 'failed':
        return 'from-red-50 to-pink-50';
      case 'not_found':
        return 'from-orange-50 to-yellow-50';
      default:
        return 'from-blue-50 to-indigo-50';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getStatusColor()}`}>
      <SEO 
        title="التحقق من حالة الدفع" 
        description="صفحة التحقق من حالة الدفع والمعاملات المالية" 
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Status Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-6">
              {getStatusIcon()}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {getStatusTitle()}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {getStatusDescription()}
            </p>
            
            {/* Progress Bar */}
            {(verificationStatus === 'loading' || verificationStatus === 'verifying') && (
              <div className="max-w-md mx-auto mb-6">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${verificationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{verificationProgress}% مكتمل</p>
              </div>
            )}
          </div>

          {/* Transaction Details */}
          {transaction && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center">تفاصيل المعاملة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">معلومات العميل</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">الاسم:</span> {transaction.customer_name}</p>
                      <p><span className="font-medium">البريد الإلكتروني:</span> {transaction.customer_email}</p>
                      {transaction.customer_phone && (
                        <p><span className="font-medium">الهاتف:</span> {transaction.customer_phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">تفاصيل الدفع</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">المبلغ:</span> {transaction.amount} {transaction.currency}</p>
                      <p><span className="font-medium">الخدمة:</span> {transaction.offer_title}</p>
                      <p><span className="font-medium">طريقة الدفع:</span> {transaction.payment_method}</p>
                      <p><span className="font-medium">رقم المرجع:</span> {transaction.paylink_transaction_no || transaction.tap_charge_id || transaction.tamara_order_id || transaction.id}</p>
                      <p><span className="font-medium">التاريخ:</span> {new Date(transaction.created_at).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                </div>

                {productOrder && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">تفاصيل الطلب</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">رقم الطلب:</span> {productOrder.order_number}</p>
                        <p><span className="font-medium">المنتج:</span> {productOrder.product_name}</p>
                        <p><span className="font-medium">الإصدار:</span> {productOrder.product_version}</p>
                        <p><span className="font-medium">حالة الطلب:</span> 
                          <Badge className="mr-2" variant={productOrder.status === 'completed' ? 'default' : 'secondary'}>
                            {productOrder.status === 'completed' ? 'مكتمل' : 
                             productOrder.status === 'pending' ? 'قيد التنفيذ' : 'جديد'}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <Separator className="my-6" />
                
                <div className={`p-4 rounded-lg ${
                  verificationStatus === 'success' ? 'bg-green-50' :
                  verificationStatus === 'pending' ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">حالة الدفع:</span>
                    <Badge variant={
                      verificationStatus === 'success' ? 'default' : 
                      verificationStatus === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {verificationStatus === 'success' ? '✅ تم الدفع بنجاح' : 
                       verificationStatus === 'pending' ? '⏳ قيد المعالجة' : 
                       verificationStatus === 'failed' ? '❌ فشل' : '🔍 جاري التحقق'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                الصفحة الرئيسية
              </Link>
            </Button>
            
            {transaction && verificationStatus === 'success' && (
              <>
                <Button 
                  onClick={downloadInvoice}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  تحميل الفاتورة
                </Button>
                
                <Button 
                  onClick={sendInvoiceEmail}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  إرسال الفاتورة للإيميل
                </Button>
                
                <Button asChild variant="outline">
                  <Link to="/user-guide">
                    <Download className="w-4 h-4 mr-2" />
                    دليل المستخدم
                  </Link>
                </Button>
              </>
            )}
            
            {verificationStatus === 'failed' && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/software-products">
                  إعادة المحاولة
                </Link>
              </Button>
            )}
            
            <Button asChild variant="outline">
              <Link to="/contact">
                تواصل مع الدعم
              </Link>
            </Button>
          </div>

          {/* Next Steps */}
          {verificationStatus === 'success' && (
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">الخطوات التالية</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Receipt className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">تحميل الفاتورة</h4>
                    <p className="text-sm opacity-90">احتفظ بنسخة من فاتورتك</p>
                  </div>
                  <div className="text-center">
                    <Download className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">دليل المستخدم</h4>
                    <p className="text-sm opacity-90">تعلم كيفية استخدام المنتج</p>
                  </div>
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">الدعم الفني</h4>
                    <p className="text-sm opacity-90">نحن هنا لمساعدتك 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentVerification;