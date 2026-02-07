import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Server, 
  Globe, 
  Clock,
  Bell,
  CheckCircle
} from "lucide-react";

export default function HostingServices() {
  const navigate = useNavigate();

  const handleContactUs = () => {
    navigate("/contact");
  };

  const handleBookConsultation = () => {
    navigate("/book-consultation");
  };

  return (
    <PageContainer>
      <PageHeader 
        title="الاستضافات و الخوادم"
        description="خدمات الاستضافة والخوادم المتقدمة"
      />

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Coming Soon Card */}
          <Card className="shadow-2xl border-2 border-primary/20">
            <CardHeader className="pb-8">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Server className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-4xl font-bold gradient-text mb-4">
                قريباً
              </CardTitle>
              <p className="text-xl text-muted-foreground">
                يتم إطلاق الخدمة الرسمية
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-8">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  نحن نعمل حالياً على تطوير مجموعة شاملة من خدمات الاستضافة والخوادم المتقدمة 
                  لتلبية احتياجاتكم بأعلى معايير الجودة والأمان.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center justify-center space-x-3 space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>حجز النطاقات</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>استضافة المواقع</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>إدارة الخوادم</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>الحلول السحابية</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-primary ml-2" />
                  <h3 className="text-lg font-semibold">احصل على إشعار عند الإطلاق</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  سجل اهتمامك وسنرسل لك إشعاراً فور إطلاق الخدمة
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleContactUs}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                >
                  <Globe className="w-4 h-4 ml-2" />
                  تواصل معنا
                </Button>
                <Button 
                  onClick={handleBookConsultation}
                  size="lg" 
                  variant="outline"
                >
                  <Clock className="w-4 h-4 ml-2" />
                  احجز استشارة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}