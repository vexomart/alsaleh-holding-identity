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
            شركة علي صالح الشهري القابضة - كيان استثماري رائد يضم مجموعة من الشركات المتخصصة في التقنية والإعلام والتعليم
          </p>
        </div>
        
        {/* Stats Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-elegant border-0 bg-gradient-primary text-center">
            <CardContent className="p-8">
              <div className="text-5xl font-bold text-primary-foreground mb-4">1,392</div>
              <h3 className="text-xl font-semibold text-primary-foreground">مشروع منجز</h3>
              <p className="text-primary-foreground/80 mt-2">مشاريع متنوعة عبر جميع الشركات الفرعية</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0 bg-gradient-secondary text-center">
            <CardContent className="p-8">
              <div className="text-5xl font-bold text-secondary-foreground mb-4">857</div>
              <h3 className="text-xl font-semibold text-secondary-foreground">عميل راضٍ</h3>
              <p className="text-secondary-foreground/80 mt-2">عملاء يثقون في خدماتنا المتميزة</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="shadow-elegant border-0 bg-gradient-primary">
              <CardContent className="p-8 text-primary-foreground">
                <h3 className="text-2xl font-bold mb-4">نبذة عن الشركة</h3>
                <p className="text-lg leading-relaxed mb-6">
                  بدأت شركة علي صالح الشهري العمل منذ عام 2016، وتم تحويلها رسمياً إلى شركة قابضة عام 2024. نحن متخصصون في الاستثمار بالمجالات التقنية والإعلامية والتعليمية، ونضم تحت مظلتنا مجموعة من الشركات الفرعية المتخصصة التي تقدم حلولاً شاملة لعملائنا.
                </p>
                <div className="w-16 h-1 bg-secondary rounded-full" />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-elegant border-0 bg-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">قيمنا الأساسية</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span className="text-foreground">الابتكار والتميز في جميع أعمالنا</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">الشراكة الاستراتيجية مع عملائنا</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span className="text-foreground">المساهمة في التنمية الاقتصادية</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">دعم الشباب السعودي ومواهبهم</span>
                  </div>
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