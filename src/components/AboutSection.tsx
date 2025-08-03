import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900 dark:via-orange-900 dark:to-yellow-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-orange-100/40"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="container mx-auto container-responsive relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="responsive-title text-primary mb-4 md:mb-6">
            من نحن
          </h2>
          <p className="responsive-text text-muted-foreground max-w-3xl mx-auto">
            شركة علي صالح الشهري القابضة - كيان استثماري رائد يضم مجموعة من الشركات المتخصصة في التقنية والإعلام والتعليم
          </p>
        </div>
        
        {/* Stats Section */}
        <div className="responsive-stats-grid mb-12 md:mb-16">
          <Card className="shadow-elegant border-0 bg-gradient-primary text-center card-animated animate-slide-in-left">
            <CardContent className="p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-3 sm:mb-4 animate-bounce-gentle">14,883</div>
              <h3 className="text-lg sm:text-xl font-semibold text-primary-foreground">مشروع منجز</h3>
              <p className="text-primary-foreground/80 mt-2 text-sm sm:text-base">مشاريع متنوعة عبر جميع الشركات الفرعية</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0 bg-gradient-secondary text-center card-animated animate-slide-in-right">
            <CardContent className="p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-secondary-foreground mb-3 sm:mb-4 animate-bounce-gentle">9,512</div>
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-foreground">عميل راضٍ</h3>
              <p className="text-secondary-foreground/80 mt-2 text-sm sm:text-base">عملاء يثقون في خدماتنا المتميزة</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="animate-scale-in">
            <Card className="shadow-elegant border-0 bg-gradient-primary card-animated">
              <CardContent className="p-6 sm:p-8 text-primary-foreground">
                <h3 className="responsive-subtitle mb-3 sm:mb-4">نبذة عن الشركة</h3>
                <p className="responsive-text leading-relaxed mb-4 sm:mb-6">
                  بدأت شركة علي صالح الشهري العمل منذ عام 2016، وتم تحويلها رسمياً إلى شركة قابضة عام 2025. نحن متخصصون في الاستثمار بالمجالات التقنية والإعلامية والتعليمية، ونضم تحت مظلتنا مجموعة من الشركات الفرعية المتخصصة التي تقدم حلولاً شاملة لعملائنا.
                </p>
                <div className="w-12 sm:w-16 h-1 bg-secondary rounded-full animate-pulse-glow" />
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <Card className="shadow-elegant border-0 bg-card card-animated">
              <CardContent className="p-6 sm:p-8">
                <h3 className="responsive-subtitle text-primary mb-3 sm:mb-4">قيمنا الأساسية</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-reverse space-x-3 group">
                    <div className="w-2 h-2 bg-secondary rounded-full group-hover:scale-150 transition-transform duration-300" />
                    <span className="text-foreground text-sm sm:text-base">الابتكار والتميز في جميع أعمالنا</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-3 group">
                    <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform duration-300" />
                    <span className="text-foreground text-sm sm:text-base">الشراكة الاستراتيجية مع عملائنا</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-3 group">
                    <div className="w-2 h-2 bg-secondary rounded-full group-hover:scale-150 transition-transform duration-300" />
                    <span className="text-foreground text-sm sm:text-base">المساهمة في التنمية الاقتصادية</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-3 group">
                    <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform duration-300" />
                    <span className="text-foreground text-sm sm:text-base">دعم الشباب السعودي ومواهبهم</span>
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