import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Receipt, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'pending' | 'failed'>('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get transaction details from URL parameters
        const chargeId = searchParams.get("tap_id");
        const amount = searchParams.get("amount") || searchParams.get("amt");
        const currency = searchParams.get("currency") || searchParams.get("curr") || "SAR";
        
        if (chargeId) {
          setTransactionDetails({
            chargeId,
            amount,
            currency,
            timestamp: new Date().toISOString(),
          });

          // التحقق من حالة المعاملة في قاعدة البيانات
          const { data: transaction, error } = await supabase
            .from('payment_transactions')
            .select('*')
            .or(`tap_charge_id.eq.${chargeId},paylink_transaction_no.eq.${chargeId}`)
            .single();

          if (error) {
            console.error('Error fetching transaction:', error);
            setPaymentStatus('failed');
          } else if (transaction) {
            // التحقق من حالة المعاملة
            if (transaction.status === 'PAID' || transaction.status === 'COMPLETED') {
              setPaymentStatus('success');
            } else if (transaction.status === 'INITIATED' || transaction.status === 'PENDING') {
              setPaymentStatus('pending');
            } else {
              setPaymentStatus('failed');
            }
          } else {
            setPaymentStatus('pending');
          }
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 md:pt-32">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {loading ? (
            <div className="space-y-4">
              <Clock className="w-20 h-20 text-blue-500 mx-auto animate-spin" />
              <h1 className="text-2xl font-bold text-foreground">
                جاري التحقق من حالة الدفع...
              </h1>
            </div>
          ) : (
            <>
              {/* Success/Pending/Failed States */}
              {paymentStatus === 'success' && (
                <div className="space-y-4">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
                  <h1 className="text-4xl font-bold text-foreground">
                    تم الدفع بنجاح!
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    شكراً لك على ثقتك بنا. تم تأكيد عملية الدفع بنجاح
                  </p>
                </div>
              )}

              {paymentStatus === 'pending' && (
                <div className="space-y-4">
                  <Clock className="w-20 h-20 text-orange-500 mx-auto" />
                  <h1 className="text-3xl font-bold text-foreground">
                    عملية الدفع قيد المعالجة
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    عملية الدفع قيد المراجعة. سيتم إشعارك فور اكتمالها
                  </p>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-right">
                      قد تستغرق عملية التأكيد من 5-10 دقائق. يرجى عدم القلق
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="space-y-4">
                  <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
                  <h1 className="text-3xl font-bold text-foreground">
                    خطأ في عملية الدفع
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    لم يتم العثور على تفاصيل المعاملة أو حدث خطأ
                  </p>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-right">
                      يرجى التواصل مع فريق الدعم للمساعدة
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}

          {/* Transaction Details */}
          {transactionDetails && (
            <Card className="text-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Receipt className="w-5 h-5" />
                  تفاصيل المعاملة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">رقم المعاملة:</span>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {transactionDetails.chargeId}
                  </span>
                </div>
                {transactionDetails.amount && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">المبلغ:</span>
                    <span className="text-lg font-bold text-green-600">
                      {transactionDetails.amount} {transactionDetails.currency || 'SAR'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-medium">تاريخ العملية:</span>
                  <span>{new Date().toLocaleDateString('ar-SA')}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps - only show for success */}
          {paymentStatus === 'success' && (
            <Card>
              <CardHeader>
                <CardTitle>الخطوات التالية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  سيتم التواصل معك خلال 24 ساعة لتأكيد تفاصيل الخدمة وبدء العمل
                </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/current-offers")}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  مشاهدة العروض الأخرى
                </Button>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Pending Status Actions */}
          {paymentStatus === 'pending' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    العودة للرئيسية
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2"
                  >
                    تحديث الصفحة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Failed Status Actions */}
          {paymentStatus === 'failed' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    العودة للرئيسية
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/software-products")}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    إعادة المحاولة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">هل تحتاج المساعدة؟</h3>
            <p className="text-muted-foreground mb-4">
              فريق الدعم الفني متاح على مدار الساعة لمساعدتك
            </p>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <span>📧 support@emkan.dev</span>
              <span>📱 +966 50 000 0000</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;