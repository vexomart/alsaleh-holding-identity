import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  Clock, 
  Percent, 
  TrendingUp,
  Star,
  Zap,
  Heart,
  Gift
} from "lucide-react";

// Import company logos
import tamaraLogo from "@/assets/tamara-logo.png";
import tabbyLogo from "@/assets/tabby-logo.png";
import madfuLogo from "@/assets/madfu-logo.png";
import emkanLogo from "/lovable-uploads/11949ba3-ce73-4843-be21-760250e11b50.png";
import tasaheelLogo from "@/assets/tasaheel-logo.png";

const PaymentMethodsSection = () => {
  const traditionalMethods = [
    {
      name: "بطاقات الائتمان",
      icon: CreditCard,
      description: "فيزا، ماستركارد، أمريكان إكسبريس",
      features: ["حماية عالية", "دفع فوري", "استرداد آمن"],
      gradient: "from-blue-500 to-blue-600"
    },
    {
      name: "التحويل البنكي", 
      icon: Building2,
      description: "جميع البنوك السعودية المعتمدة",
      features: ["آمن ومضمون", "بدون رسوم", "تأكيد سريع"],
      gradient: "from-green-500 to-green-600"
    },
    {
      name: "المحافظ الرقمية",
      icon: Smartphone,
      description: "STC Pay، Apple Pay، Google Pay",
      features: ["سهولة الاستخدام", "أمان عالي", "دفع بلمسة"],
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const installmentOptions = [
    {
      name: "تمارا",
      logo: tamaraLogo,
      description: "اشتر الآن وادفع لاحقاً على 4 دفعات بدون فوائد",
      features: [
        "قسط مشترياتك على 4 دفعات متساوية",
        "بدون فوائد أو رسوم إضافية", 
        "موافقة فورية خلال ثوانٍ",
        "متاح للمشتريات من 100 إلى 10,000 ريال"
      ],
      benefits: ["دفع 25% فقط عند الشراء", "الباقي على 3 أقساط شهرية", "بدون تحقق ائتماني معقد"],
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      name: "تابي", 
      logo: tabbyLogo,
      description: "خيارات دفع مرنة مع تقسيط ميسر وبدون فوائد",
      features: [
        "تقسيط على 4 دفعات كل أسبوعين",
        "أو على 3 أقساط شهرية",
        "بدون رسوم خفية أو فوائد",
        "متاح للمشتريات من 50 إلى 5,000 ريال"
      ],
      benefits: ["مرونة في الدفع", "موافقة سريعة", "تتبع دقيق للأقساط"],
      color: "blue",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "مدفوع",
      logo: madfuLogo, 
      description: "حلول دفع متقدمة مع خيارات تقسيط مبتكرة",
      features: [
        "تقسيط مرن حسب إمكانياتك",
        "أقساط شهرية ميسرة",
        "بدون ضمانات أو كفلاء",
        "حدود ائتمانية عالية"
      ],
      benefits: ["عملية تقديم رقمية", "موافقة خلال دقائق", "إدارة ذكية للأقساط"],
      color: "orange",
      gradient: "from-orange-500 to-red-500"
    },
    {
      name: "امكان",
      logo: emkanLogo, 
      description: "منصة التقسيط الرائدة مع حلول دفع مبتكرة ومرنة",
      features: [
        "تقسيط حتى 60 شهر",
        "بدون دفعة أولى في بعض المنتجات",
        "موافقة سريعة خلال دقائق",
        "متاح لجميع المواطنين والمقيمين"
      ],
      benefits: ["أسعار فائدة تنافسية", "إجراءات ميسرة", "خدمة عملاء متميزة"],
      color: "violet",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      name: "تساهيل",
      logo: tasaheelLogo,
      description: "برنامج التقسيط من البنك الراجحي مع شروط ميسرة وأسعار تنافسية",
      features: [
        "تقسيط حتى 48 شهر",
        "بدون كفيل أو ضمانات",
        "موافقة سريعة خلال 24 ساعة",
        "متاح لعملاء البنك الراجحي"
      ],
      benefits: ["معدلات ربح تنافسية", "إجراءات بنكية مبسطة", "دعم فني متخصص"],
      color: "green",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  const securityFeatures = [
    { icon: Shield, text: "حماية SSL متقدمة" },
    { icon: CheckCircle, text: "معتمد من البنك المركزي السعودي" },
    { icon: Zap, text: "تشفير عالي المستوى" },
    { icon: Star, text: "ضمان استرداد الأموال" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-secondary/5 to-primary/5 relative overflow-hidden" id="payment-methods">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-float-delayed" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">طرق دفع متنوعة وآمنة</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            طرق <span className="text-gradient-primary">الدفع</span> المتاحة
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نوفر لك مجموعة شاملة من طرق الدفع الآمنة والمرنة، بما في ذلك خيارات التقسيط 
            المبتكرة لتناسب جميع احتياجاتك المالية
          </p>
        </div>

        {/* Traditional Payment Methods */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <CreditCard className="w-6 h-6 text-primary" />
            طرق الدفع التقليدية
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {traditionalMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h4 className="text-xl font-bold text-foreground mb-3">{method.name}</h4>
                    <p className="text-muted-foreground mb-4">{method.description}</p>
                    
                    <div className="space-y-2">
                      {method.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Installment Payment Options */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              خيارات التقسيط المتاحة
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اشتر الآن وادفع لاحقاً مع أفضل منصات التقسيط في المملكة العربية السعودية
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-5 gap-8">
            {installmentOptions.map((option, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`h-2 bg-gradient-to-r ${option.gradient}`} />
                
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border">
                      <img 
                        src={option.logo} 
                        alt={`${option.name} logo`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground">{option.name}</h4>
                      <Badge className={`bg-${option.color}-500/20 text-${option.color}-600 border-${option.color}-500/30 mt-1`}>
                        بدون فوائد
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">{option.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <h5 className="font-semibold text-foreground flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      الميزات الرئيسية:
                    </h5>
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`bg-${option.color}-500/10 rounded-lg p-4 mb-6`}>
                    <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      فوائد إضافية:
                    </h5>
                    {option.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <TrendingUp className={`w-3 h-3 text-${option.color}-600`} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    asChild
                    className={`w-full bg-gradient-to-r ${option.gradient} hover:opacity-90 transition-opacity duration-300 text-white border-0`}
                  >
                    <a 
                      href={`https://wa.me/966555812567?text=مرحباً، أريد الاستفسار عن خدمة التقسيط عبر ${option.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      اختر {option.name}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              الأمان والحماية
            </h3>
            <p className="text-muted-foreground">
              نضمن أعلى مستويات الأمان في جميع معاملاتك المالية
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 md:p-12 text-primary-foreground">
            <Heart className="w-12 h-12 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              ابدأ مشروعك اليوم
            </h3>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              اختر طريقة الدفع التي تناسبك واستمتع بحلول تقنية متطورة مع خيارات دفع مرنة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <a 
                  href="https://wa.me/966555812567?text=مرحباً، أريد التواصل مع فريق المبيعات لمناقشة مشروعي"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  تواصل مع فريق المبيعات
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                تعرف على الأسعار
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethodsSection;