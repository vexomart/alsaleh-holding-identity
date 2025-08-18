import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Receipt, Clock, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'pending' | 'failed'>('checking');
  const [loading, setLoading] = useState(true);
  const [contractUrl, setContractUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // البحث عن معرف المعاملة من URL parameters مختلفة
        const transactionNo = 
          searchParams.get('paymentId') || 
          searchParams.get('transaction_no') ||
          searchParams.get('transactionNo') ||
          searchParams.get('paylink_id') ||
          searchParams.get('charge_id') ||
          searchParams.get('order_id');
        
        console.log('Payment verification started:', { transactionNo, allParams: Object.fromEntries(searchParams) });

        if (!transactionNo) {
          console.log('No transaction info found in URL');
          setPaymentStatus('failed');
          setLoading(false);
          return;
        }

        // البحث عن المعاملة في قاعدة البيانات
        const { data: transactions, error } = await supabase
          .from('payment_transactions')
          .select('*')
          .or(`paylink_transaction_no.eq.${transactionNo},tap_charge_id.eq.${transactionNo},tamara_order_id.eq.${transactionNo},stc_pay_reference.eq.${transactionNo},id.eq.${transactionNo}`)
          .limit(1);

        if (error) {
          console.error('Error fetching transaction:', error);
          setPaymentStatus('failed');
          setLoading(false);
          return;
        }

        if (!transactions || transactions.length === 0) {
          console.log('No transaction found, checking if it exists by partial match');
          
          // محاولة ثانية للبحث بنص جزئي
          const { data: partialTransactions, error: partialError } = await supabase
            .from('payment_transactions')
            .select('*')
            .or(`paylink_transaction_no.ilike.%${transactionNo}%,offer_title.ilike.%${transactionNo}%`)
            .limit(1);

          if (partialError || !partialTransactions || partialTransactions.length === 0) {
            console.log('No transaction found even with partial match');
            setPaymentStatus('failed');
            setLoading(false);
            return;
          }
          
          setTransactionDetails(partialTransactions[0]);
        } else {
          setTransactionDetails(transactions[0]);
        }

        const transaction = transactions?.[0] || (await supabase
          .from('payment_transactions')
          .select('*')
          .or(`paylink_transaction_no.ilike.%${transactionNo}%`)
          .limit(1)).data?.[0];

        if (!transaction) {
          setPaymentStatus('failed');
          setLoading(false);
          return;
        }

        // التحقق من حالة الدفع عبر verify-payment-status
        console.log('Verifying payment for transaction:', transaction.id);
        const { data: verificationResult, error: verifyError } = await supabase.functions.invoke('verify-payment-status', {
          body: { transactionId: transaction.id }
        });

        console.log('Verification result:', verificationResult);

        if (verifyError) {
          console.error('Payment verification error:', verifyError);
          setPaymentStatus('failed');
        } else if (verificationResult?.status === 'PAID' || verificationResult?.status === 'COMPLETED') {
          setPaymentStatus('success');
          console.log('Payment successful! Emails should be sent automatically.');
        } else if (verificationResult?.status === 'PENDING' || verificationResult?.status === 'INITIATED') {
          setPaymentStatus('pending');
        } else {
          setPaymentStatus('failed');
        }

      } catch (error) {
        console.error('Payment verification failed:', error);
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const generateContractPDF = async () => {
    if (!transactionDetails) return;

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('contract-email', {
        body: {
          to: transactionDetails.customer_email,
          contractData: {
            client_name: transactionDetails.customer_name,
            client_email: transactionDetails.customer_email,
            client_phone: transactionDetails.customer_phone,
            service_type: transactionDetails.offer_title,
            service_price: transactionDetails.amount,
            payment_method: transactionDetails.payment_method
          }
        }
      });

      if (error) {
        console.error('Error generating contract:', error);
        alert('حدث خطأ في إنشاء العقد');
      } else {
        alert('تم إرسال العقد إلى بريدك الإلكتروني');
      }
    } catch (error) {
      console.error('Contract generation failed:', error);
      alert('حدث خطأ في إنشاء العقد');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReceipt = async () => {
    const receiptElement = document.getElementById('payment-receipt');
    if (!receiptElement) return;

    try {
      const canvas = await html2canvas(receiptElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
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
      
      pdf.save(`receipt-${transactionDetails?.paylink_transaction_no || 'payment'}.pdf`);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-8"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">جاري التحقق من عملية الدفع...</h2>
            <p className="text-gray-600">يرجى الانتظار بينما نتحقق من حالة دفعتك</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {paymentStatus === 'success' && (
            <div className="text-center mb-12">
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
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 mb-6">
                <Clock className="w-12 h-12 text-yellow-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                ⏳ عملية الدفع قيد المعالجة
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                يتم معالجة دفعتك حالياً
              </p>
              <p className="text-lg text-gray-500">
                سنرسل إليك تأكيد عند اكتمال العملية
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                ❌ لم تكتمل عملية الدفع
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                حدث خطأ في معالجة الدفع
              </p>
              <p className="text-lg text-gray-500">
                يرجى المحاولة مرة أخرى أو التواصل مع الدعم
              </p>
            </div>
          )}

          {paymentStatus === 'checking' && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                <Clock className="w-12 h-12 text-blue-600 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                🔍 جاري التحقق من الدفع
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                يرجى الانتظار قليلاً
              </p>
            </div>
          )}

          {transactionDetails && (
            <div id="payment-receipt" className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل المعاملة</h2>
                <p className="text-gray-600">إيصال الدفع الرسمي</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">معلومات العميل</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">الاسم:</span> {transactionDetails.customer_name}</p>
                    <p><span className="font-medium">البريد الإلكتروني:</span> {transactionDetails.customer_email}</p>
                    {transactionDetails.customer_phone && (
                      <p><span className="font-medium">الهاتف:</span> {transactionDetails.customer_phone}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">تفاصيل الدفع</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">المبلغ:</span> {transactionDetails.amount} {transactionDetails.currency || 'SAR'}</p>
                    <p><span className="font-medium">الخدمة:</span> {transactionDetails.offer_title}</p>
                    <p><span className="font-medium">طريقة الدفع:</span> {transactionDetails.payment_method}</p>
                    <p><span className="font-medium">رقم المرجع:</span> {transactionDetails.paylink_transaction_no || transactionDetails.tap_charge_id || transactionDetails.id}</p>
                    <p><span className="font-medium">التاريخ:</span> {new Date(transactionDetails.created_at || Date.now()).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">الدعم المتخصص</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">فريق دعم متخصص متاح 24/7 لمساعدتك</p>
                <Button variant="outline" className="w-full">
                  تواصل معنا ⭐
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">دليل المستخدم</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">تحميل دليل شامل لاستخدام جميع مميزات النظام</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={downloadReceipt}
                >
                  💾 تحميل الدليل
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">ابدأ الأتمتة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">ادخل إلى نظام الأتمتة وابدأ في إنشاء أول سير عمل لك</p>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => navigate('/automation-system')}
                >
                  ➤ ابدأ الآن
                </Button>
              </CardContent>
            </Card>
          </div>

          {paymentStatus === 'success' && (
            <Alert className="mb-8 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>تم إرسال الإيميلات التالية:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• تأكيد الدفع وتفاصيل المعاملة</li>
                  <li>• الفاتورة الرسمية المختومة</li>
                  <li>• دليل الاستخدام والبدء</li>
                  <li>• تفاصيل تسجيل الدخول للنظام</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </Button>
              
              {transactionDetails && (
                <Button 
                  onClick={downloadReceipt}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  تحميل الإيصال
                </Button>
              )}

              {paymentStatus === 'success' && (
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

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">تفاصيل العملية</h3>
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
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;