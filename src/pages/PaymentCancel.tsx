import { useNavigate } from "react-router-dom";
import { XCircle, ArrowRight, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Cancel Icon and Message */}
          <div className="space-y-4">
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
            <h1 className="text-4xl font-bold text-foreground">
              تم إلغاء عملية الدفع
            </h1>
            <p className="text-xl text-muted-foreground">
              لم تكتمل عملية الدفع. يمكنك المحاولة مرة أخرى متى شئت
            </p>
          </div>

          {/* Reasons for Cancellation */}
          <Card>
            <CardHeader>
              <CardTitle>أسباب محتملة للإلغاء</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-right">
              <ul className="space-y-2 text-muted-foreground">
                <li>• تم إغلاق نافذة الدفع</li>
                <li>• انتهت مهلة عملية الدفع</li>
                <li>• تم الضغط على زر الإلغاء</li>
                <li>• مشكلة في بيانات البطاقة</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/current-offers")}
                className="flex items-center gap-2"
                size="lg"
              >
                <RefreshCw className="w-4 h-4" />
                المحاولة مرة أخرى
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
                size="lg"
              >
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle>هل تحتاج المساعدة؟</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                إذا كنت تواجه مشاكل في عملية الدفع، لا تتردد في التواصل معنا
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/contact")}
                  className="w-full"
                >
                  تواصل مع الدعم الفني
                </Button>
                <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground justify-center">
                  <span>📧 info@alialshehriholding.com</span>
                  <span>📱 0555812567</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Payment Methods */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">طرق دفع أخرى</h3>
            <p className="text-muted-foreground mb-4">
              يمكنك أيضاً التواصل معنا لترتيب طرق دفع أخرى مثل التحويل البنكي
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate("/payment-methods")}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              مشاهدة طرق الدفع الأخرى
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCancel;