import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Lightbulb, Zap } from "lucide-react";

const VisionSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            رؤيتنا وأهدافنا
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نسعى لبناء مستقبل رقمي متميز من خلال الاستثمار في التقنيات المبتكرة والمواهب المتميزة
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Card className="shadow-elegant border-0 bg-gradient-primary">
              <CardContent className="p-8 text-center">
                <Eye className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-primary-foreground mb-4">رؤيتنا</h3>
                <p className="text-primary-foreground/90 leading-relaxed">
                  أن نكون الشركة القابضة الرائدة في المملكة العربية السعودية في مجال الاستثمار التقني والإعلامي والتعليمي، ونساهم في تحقيق رؤية المملكة 2030 من خلال دعم التحول الرقمي والابتكار.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-elegant border-0 bg-card">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-primary mb-4">مهمتنا</h3>
                <p className="text-foreground leading-relaxed">
                  تقديم حلول تقنية وإعلامية وتعليمية متكاملة عالية الجودة، ودعم الشركات الناشئة والمشاريع المبتكرة لتحقيق النمو المستدام وخلق فرص عمل نوعية للمجتمع السعودي.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Goals */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card">
            <CardContent className="p-6 text-center">
              <Lightbulb className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h4 className="font-bold text-primary mb-2">الابتكار</h4>
              <p className="text-sm text-muted-foreground">دعم الأفكار المبتكرة وتطوير حلول تقنية متقدمة</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h4 className="font-bold text-primary mb-2">التميز</h4>
              <p className="text-sm text-muted-foreground">تقديم خدمات عالية الجودة تفوق توقعات العملاء</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h4 className="font-bold text-primary mb-2">النمو</h4>
              <p className="text-sm text-muted-foreground">تحقيق نمو مستدام للشركة وشركاتها الفرعية</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card">
            <CardContent className="p-6 text-center">
              <Eye className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h4 className="font-bold text-primary mb-2">الشراكة</h4>
              <p className="text-sm text-muted-foreground">بناء شراكات استراتيجية مع الرواد في الصناعة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;