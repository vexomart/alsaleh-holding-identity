import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            من نحن
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            شركة علي صالح الشهري القابضة هي كيان استثماري رائد يهدف إلى بناء مستقبل أفضل من خلال الاستثمار في الشركات المبتكرة
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="shadow-elegant border-0 bg-gradient-primary">
              <CardContent className="p-8 text-primary-foreground">
                <h3 className="text-2xl font-bold mb-4">رؤيتنا</h3>
                <p className="text-lg leading-relaxed mb-6">
                  أن نكون الشركة القابضة الرائدة في المنطقة في مجال الاستثمار التقني والإعلامي، 
                  نساهم في بناء اقتصاد المعرفة ونمكن الشركات الناشئة من تحقيق إمكاناتها الكاملة.
                </p>
                <div className="w-16 h-1 bg-secondary rounded-full" />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-elegant border-0 bg-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">مهمتنا</h3>
                <p className="text-lg text-foreground leading-relaxed mb-6">
                  نستثمر في الشركات التقنية والإعلامية المبتكرة، نوفر لها الدعم المالي والاستراتيجي 
                  لتحقيق النمو المستدام والتأثير الإيجابي في المجتمع.
                </p>
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="w-3 h-3 bg-secondary rounded-full" />
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div className="w-3 h-3 bg-secondary rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;