import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, AlertCircle, Home, Download, Receipt, FileText, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { downloadInvoicePDF } from '@/components/InvoicePDF';
import { useToast } from '@/hooks/use-toast';

interface TransactionDetails {
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

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let verificationAttempts = 0;
    const maxAttempts = 5;
    
    const verifyPayment = async () => {
      try {
        verificationAttempts++;
        console.log(`🔍 Payment verification attempt ${verificationAttempts}/${maxAttempts}`);
        
        const transactionId = searchParams.get('transactionId') || 
                            searchParams.get('transaction_no') ||
                            searchParams.get('paymentId') ||
                            searchParams.get('tap_id') ||
                            searchParams.get('charge_id');
        
        console.log('Verifying payment:', transactionId);

        if (!transactionId) {
          setPaymentStatus('failed');
          setLoading(false);
          return;
        }

        // Fetch transaction details - enhanced search
        const { data: transactions, error } = await supabase
          .from('payment_transactions')
          .select('*')
          .or(`id.eq.${transactionId},transaction_id.eq.${transactionId},paylink_transaction_no.eq.${transactionId},tap_charge_id.eq.${transactionId}`)
          .limit(1);

        if (error || !transactions || transactions.length === 0) {
          console.error('Transaction not found:', error);
          setPaymentStatus('failed');
          setLoading(false);
          return;
        }

        const transaction = transactions[0];
        setTransactionDetails(transaction);

        // Verify payment status with improved error handling
        const { data: verificationResult, error: verifyError } = await supabase.functions.invoke('verify-payment-status', {
          body: { transactionId: transaction.id }
        });

        console.log('🔍 Verification result:', verificationResult);

        if (verifyError) {
          console.error('Payment verification error:', verifyError);
          // If it's not the last attempt and status is still unknown, retry
          if (verificationAttempts < maxAttempts && transaction.status === 'PENDING') {
            setTimeout(verifyPayment, 3000); // Retry after 3 seconds
            return;
          }
          setPaymentStatus('failed');
        } else if (verificationResult?.success) {
          const status = verificationResult.status;
          if (status === 'PAID' || status === 'COMPLETED') {
            setPaymentStatus('success');
          } else if (status === 'PENDING' || status === 'PROCESSING') {
            setPaymentStatus('pending');
            // Auto-retry for pending payments
            if (verificationAttempts < maxAttempts) {
              setTimeout(verifyPayment, 5000); // Retry after 5 seconds
              return;
            }
          } else {
            setPaymentStatus('failed');
          }
        } else {
          setPaymentStatus('failed');
        }

      } catch (error) {
        console.error('Payment verification failed:', error);
        // Retry on error if not last attempt
        if (verificationAttempts < maxAttempts) {
          setTimeout(verifyPayment, 3000);
          return;
        }
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Function to download invoice PDF
  const downloadInvoice = async () => {
    if (!transactionDetails) return;
    
    try {
      const invoiceData = {
        invoiceNumber: `INV-${transactionDetails.paylink_transaction_no || Date.now()}`,
        date: new Date().toLocaleDateString('ar-SA'),
        customerName: transactionDetails.customer_name || 'عميل',
        customerEmail: transactionDetails.customer_email || '',
        customerPhone: transactionDetails.customer_phone || '',
        amount: Number(transactionDetails.amount) || 0,
        currency: transactionDetails.currency || 'SAR',
        serviceName: transactionDetails.offer_title || 'خدمة',
        transactionId: transactionDetails.paylink_transaction_no || transactionDetails.id,
        paymentMethod: transactionDetails.payment_method || 'بايلينك',
        orderStatus: paymentStatus === 'success' ? '✅ تم الدفع - جاري التنفيذ' : 
                    paymentStatus === 'pending' ? '⏳ قيد المعالجة' : '❌ مُلغى',
      };
      
      await downloadInvoicePDF(invoiceData);
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

  // Function to send invoice via email
  const sendInvoiceEmail = async () => {
    if (!transactionDetails) return;
    
    try {
      const invoiceData = {
        customerEmail: transactionDetails.customer_email,
        customerName: transactionDetails.customer_name || 'عميل',
        invoiceNumber: `INV-${transactionDetails.paylink_transaction_no || Date.now()}`,
        amount: Number(transactionDetails.amount) || 0,
        currency: transactionDetails.currency || 'SAR',
        serviceName: transactionDetails.offer_title || 'خدمة',
        transactionId: transactionDetails.paylink_transaction_no || transactionDetails.id,
        orderStatus: paymentStatus === 'success' ? '✅ تم الدفع - جاري التنفيذ' : 
                    paymentStatus === 'pending' ? '⏳ قيد المعالجة' : '❌ مُلغى',
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

  // Generate contract PDF and send via email
  const generateContractPDF = async () => {
    if (!transactionDetails) return;
    
    setGenerating(true);
    try {
      const contractData = {
        customer_name: transactionDetails.customer_name,
        customer_email: transactionDetails.customer_email,
        customer_phone: transactionDetails.customer_phone,
        service_type: transactionDetails.offer_title,
        service_price: transactionDetails.amount,
        currency: transactionDetails.currency || 'SAR',
        payment_method: 'مدفوع مسبقاً',
        notes: `تم الدفع عبر المعاملة رقم: ${transactionDetails.paylink_transaction_no || transactionDetails.id}`
      };

      const response = await supabase.functions.invoke('contract-email', {
        body: contractData
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "تم إنشاء العقد",
        description: "تم إرسال العقد إلى إيميلك بنجاح"
      });
    } catch (error) {
      console.error('Error generating contract:', error);
      toast({
        title: "خطأ في الإنشاء",
        description: "حدث خطأ أثناء إنشاء العقد"
      });
    } finally {
      setGenerating(false);
    }
  };

  // Function to download receipt as PDF
  const downloadReceipt = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`receipt-${searchParams.get('transaction_no') || Date.now()}.pdf`);
      toast({
        title: "تم تحميل الإيصال",
        description: "تم تحميل الإيصال بنجاح"
      });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل الإيصال"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <SEO title="جاري التحقق من الدفع" description="التحقق من حالة الدفع" />
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-100 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🔍 جاري التحقق من حالة الدفع
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              يرجى الانتظار قليلاً أثناء التحقق من المعاملة
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center space-x-1 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                قد تستغرق هذه العملية بضع ثواني...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <SEO 
        title={paymentStatus === 'success' ? 'تم الدفع بنجاح' : paymentStatus === 'pending' ? 'الدفع قيد المعالجة' : 'مشكلة في الدفع'} 
        description="صفحة تأكيد حالة الدفع" 
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Payment Status Header */}
          <div className="text-center mb-12">
            {paymentStatus === 'success' && (
              <>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  🎉 تم الدفع بنجاح!
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  مرحباً بك في عالم الأتمتة الذكية
                </p>
                <p className="text-lg text-gray-500">
                  تم إرسال تأكيد الدفع والفاتورة إلى بريدك الإلكتروني
                </p>
              </>
            )}

            {paymentStatus === 'pending' && (
              <>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 mb-6 animate-pulse">
                  <Clock className="w-12 h-12 text-amber-600 animate-spin" style={{animationDuration: '3s'}} />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  ⏳ عملية الدفع قيد المعالجة
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  يتم معالجة دفعتك حالياً، سنرسل إليك تأكيد عند اكتمال العملية
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 text-sm">
                    💡 قد تستغرق عملية التحقق من بضع دقائق إلى ساعة حسب طريقة الدفع المستخدمة
                  </p>
                </div>
              </>
            )}

            {paymentStatus === 'failed' && (
              <>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 mb-6">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  ❌ لم تكتمل عملية الدفع
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  حدث خطأ في معالجة الدفع، يرجى المحاولة مرة أخرى
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm">
                    📞 إذا استمرت المشكلة، يرجى التواصل معنا على: 0555812567
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Transaction Details */}
          {transactionDetails && (
            <div id="receipt-content" className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل المعاملة</h2>
                <p className="text-gray-600">إيصال الدفع الرسمي</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">معلومات العميل</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">الاسم:</span> {transactionDetails.customer_name}</p>
                    <p><span className="font-medium">البريد الإلكتروني:</span> {transactionDetails.customer_email}</p>
                    {transactionDetails.customer_phone && (
                      <p><span className="font-medium">الهاتف:</span> {transactionDetails.customer_phone}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">تفاصيل الدفع</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">المبلغ:</span> {transactionDetails.amount} {transactionDetails.currency}</p>
                    <p><span className="font-medium">الخدمة:</span> {transactionDetails.offer_title}</p>
                    <p><span className="font-medium">طريقة الدفع:</span> {transactionDetails.payment_method}</p>
                    <p><span className="font-medium">رقم المرجع:</span> {transactionDetails.paylink_transaction_no || transactionDetails.tap_charge_id || transactionDetails.id}</p>
                    <p><span className="font-medium">التاريخ:</span> {new Date(transactionDetails.created_at).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">الحالة:</span>
                  <Badge variant={paymentStatus === 'success' ? 'default' : paymentStatus === 'pending' ? 'secondary' : 'destructive'}>
                    {paymentStatus === 'success' ? '✅ تم الدفع' : 
                     paymentStatus === 'pending' ? '⏳ قيد المعالجة' : '❌ فشل'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {paymentStatus === 'success' && (
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <Button 
                asChild 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  الصفحة الرئيسية
                </Link>
              </Button>
              
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
                <FileText className="w-4 h-4 mr-2" />
                إرسال الفاتورة للإيميل
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/user-guide">
                  <Download className="w-4 h-4 mr-2" />
                  دليل المستخدم
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/contact">
                  تواصل مع الدعم
                </Link>
              </Button>
              
              {(transactionDetails?.offer_title?.includes('موقع') || 
                transactionDetails?.offer_title?.includes('تطبيق') ||
                transactionDetails?.offer_title?.includes('نظام')) && (
                <Button 
                  onClick={generateContractPDF}
                  disabled={generating}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Receipt className="w-4 h-4" />
                  {generating ? 'جاري الإنشاء...' : 'إنشاء العقد'}
                </Button>
              )}
            </div>
          )}

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">ملخص العملية</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>حالة الدفع:</strong> {
                  paymentStatus === 'success' ? '✅ تم بنجاح' :
                  paymentStatus === 'pending' ? '⏳ قيد المعالجة' :
                  paymentStatus === 'failed' ? '❌ فشل' : '🔍 جاري التحقق'
                }</p>
                <p><strong>المعرف:</strong> {searchParams.get('paymentId') || searchParams.get('transaction_no') || 'غير متوفر'}</p>
              </div>
              <div>
                <p><strong>الوقت:</strong> {new Date().toLocaleString('ar-SA')}</p>
                <p><strong>الإيميلات:</strong> {paymentStatus === 'success' ? '✅ تم الإرسال' : '⏳ في الانتظار'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;