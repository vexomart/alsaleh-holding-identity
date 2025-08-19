import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SEO from '@/components/SEO';

const PaymentTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  
  const amount = searchParams.get('amount') || '0';
  const offer = searchParams.get('offer') || 'خدمة تقنية';
  const transaction = searchParams.get('transaction') || '';

  useEffect(() => {
    // محاكاة عملية دفع تجريبية
    const timer = setTimeout(() => {
      // يمكن تغيير هذا ليكون 'success' أو 'failed' حسب ما تريد اختباره
      setPaymentStatus('success');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTestPayment = (status: 'success' | 'failed') => {
    setPaymentStatus(status);
  };

  return (
    <>
      <SEO 
        title="صفحة دفع تجريبية - آش هولدينغ"
        description="صفحة اختبار الدفع - لا يتم خصم أي مبلغ"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-orange-100">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              صفحة دفع تجريبية
            </CardTitle>
            <p className="text-sm text-gray-600">
              هذه صفحة اختبار - لن يتم خصم أي مبلغ
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>تحذير:</strong> هذه صفحة تجريبية فقط. لم يتم خصم أي مبلغ من حسابك.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">العرض:</span>
                <span className="font-semibold">{offer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ:</span>
                <span className="font-bold text-green-600">{amount} ريال</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">رقم المعاملة:</span>
                <span className="font-mono text-xs">{transaction}</span>
              </div>
            </div>

            {paymentStatus === 'pending' && (
              <div className="text-center space-y-4">
                <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
                <p className="text-gray-600">جاري محاكاة عملية الدفع...</p>
                <div className="space-x-2 space-x-reverse">
                  <Button 
                    onClick={() => handleTestPayment('success')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    محاكاة نجاح
                  </Button>
                  <Button 
                    onClick={() => handleTestPayment('failed')}
                    variant="destructive"
                  >
                    محاكاة فشل
                  </Button>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-green-800">محاكاة دفع ناجحة!</h3>
                  <p className="text-sm text-gray-600">
                    في الوضع الحقيقي، سيتم خصم {amount} ريال
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/payment-success?test=true&amount=' + amount)}
                  className="w-full"
                >
                  الانتقال لصفحة النجاح
                </Button>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center space-y-4">
                <XCircle className="w-16 h-16 text-red-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-red-800">محاكاة فشل الدفع</h3>
                  <p className="text-sm text-gray-600">
                    في الوضع الحقيقي، لم يتم خصم أي مبلغ
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/payment-cancel')}
                  variant="destructive"
                  className="w-full"
                >
                  الانتقال لصفحة الإلغاء
                </Button>
              </div>
            )}

            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>

            <div className="text-xs text-center text-gray-500 space-y-1">
              <p>لتفعيل الدفع الحقيقي، يجب إضافة مفاتيح TAB الصحيحة</p>
              <p>في إعدادات Supabase Edge Functions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentTest;