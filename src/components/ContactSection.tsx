import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-20 bg-gradient-primary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            تواصل معنا
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            نحن هنا للإجابة على استفساراتكم ومناقشة الفرص الاستثمارية المتاحة
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">معلومات التواصل</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">البريد الإلكتروني</p>
                      <p className="text-muted-foreground">info@ash.holdings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">الهاتف</p>
                      <p className="text-muted-foreground direction-ltr">0555812567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">المقر الرئيسي</p>
                      <p className="text-muted-foreground">المملكة العربية السعودية</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">الموقع الإلكتروني</p>
                      <p className="text-muted-foreground">ash.holdings</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-primary-foreground">
            <h3 className="text-3xl font-bold mb-6">
              شراكة نحو المستقبل
            </h3>
            <p className="text-lg leading-relaxed mb-8 text-primary-foreground/90">
              نؤمن بقوة الشراكات الاستراتيجية في بناء مستقبل أفضل. إذا كنت تملك فكرة مبتكرة 
              أو مشروع تقني واعد، فنحن نرحب بالتواصل معك لاستكشاف إمكانيات التعاون والاستثمار.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-reverse space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span className="text-primary-foreground/90">استثمارات تقنية مبتكرة</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span className="text-primary-foreground/90">دعم الشركات الناشئة</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span className="text-primary-foreground/90">شراكات استراتيجية</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="mt-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold shadow-glow transition-all duration-300"
            >
              ابدأ المحادثة
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;