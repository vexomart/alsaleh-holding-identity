import { 
  Palette, 
  FileText, 
  Play, 
  Camera, 
  Video,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Star,
  Award,
  Eye,
  Brush,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const DesignSolutionsSection = () => {
  const whatsappNumber = "966555812567";
  
  const getWhatsAppLink = (serviceName: string) => {
    const message = `السلام عليكم، أود الاستفسار عن خدمة ${serviceName} وطلب عرض سعر مخصص.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const designServices = [
    {
      title: "إنشاء الهوية التجارية",
      description: "تصميم هوية بصرية متكاملة تعكس قيم علامتك التجارية وتميزها في السوق",
      icon: Target,
      features: ["تصميم الشعار", "دليل الهوية البصرية", "الألوان والخطوط", "تطبيقات الهوية"],
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-50 to-purple-50",
      price: "5,000",
      deliveryTime: "2-3 أسابيع",
      whatsappMessage: "أود إنشاء هوية تجارية احترافية لعلامتي التجارية"
    },
    {
      title: "إنشاء الملف التعريفي",
      description: "ملفات تعريفية احترافية تحكي قصة شركتك وتعرض خدماتها بطريقة جذابة",
      icon: FileText,
      features: ["تصميم احترافي", "محتوى جذاب", "صور عالية الجودة", "نسخ رقمية ومطبوعة"],
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      price: "3,500",
      deliveryTime: "1-2 أسبوع",
      whatsappMessage: "أحتاج إلى تصميم ملف تعريفي احترافي لشركتي"
    },
    {
      title: "موشن جرافيك",
      description: "رسوم متحركة إبداعية تجذب الانتباه وتوصل رسالتك بطريقة مؤثرة ومميزة",
      icon: Play,
      features: ["رسوم متحركة 2D/3D", "انيميشن لوجو", "فيديوهات تعريفية", "مؤثرات بصرية"],
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50",
      price: "4,000",
      deliveryTime: "2-4 أسابيع",
      whatsappMessage: "أود إنشاء موشن جرافيك احترافي لمشروعي"
    },
    {
      title: "التصوير الفوتوغرافي",
      description: "جلسات تصوير احترافية للمنتجات والفعاليات والبروفايل الشخصي والتجاري",
      icon: Camera,
      features: ["تصوير المنتجات", "تصوير الفعاليات", "البورتريه المهني", "التصوير التجاري"],
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      price: "2,500",
      deliveryTime: "3-7 أيام",
      whatsappMessage: "أحتاج إلى جلسة تصوير فوتوغرافي احترافية"
    },
    {
      title: "تصوير الفيديوهات",
      description: "إنتاج فيديوهات عالية الجودة للدعاية والإعلان والمحتوى التسويقي",
      icon: Video,
      features: ["فيديوهات ترويجية", "مقاطع دعائية", "مقابلات", "تغطية الفعاليات"],
      color: "from-pink-500 to-rose-600",
      bgColor: "from-pink-50 to-rose-50",
      price: "6,000",
      deliveryTime: "1-3 أسابيع",
      whatsappMessage: "أود إنتاج فيديو احترافي لشركتي"
    }
  ];

  const stats = [
    { label: "مشروع تصميم", value: "800+", icon: Palette },
    { label: "عميل راضي", value: "350+", icon: Star },
    { label: "جائزة تصميم", value: "25+", icon: Award },
    { label: "سنة خبرة", value: "8+", icon: Eye }
  ];

  const portfolioHighlights = [
    "تصميم هوية أكثر من 200 علامة تجارية",
    "إنتاج أكثر من 500 فيديو ترويجي",
    "تصوير أكثر من 1000 منتج",
    "إنشاء أكثر من 300 ملف تعريفي"
  ];

  return (
    <section id="design-solutions" className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/20 mb-6">
            <Palette className="w-5 h-5 text-indigo-400" />
            <span className="text-white font-medium">حلول التصميم الإبداعية</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              حلول التصميم
            </span>
            <br />
            <span className="text-white">
              التي تلهم وتؤثر
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            نحول أفكارك إلى تصاميم بصرية مذهلة تحكي قصة علامتك التجارية وتترك أثراً لا يُنسى في أذهان جمهورك
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-300">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {designServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="group relative p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon & Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-white">من {service.price} ر.س</div>
                      <div className="text-sm text-slate-300">{service.deliveryTime}</div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(service.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-white/20 text-white hover:bg-white/10 hover:border-indigo-400 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:border-transparent"
                    >
                      <span>اطلب الخدمة</span>
                      <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Portfolio Highlights */}
        <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-3xl font-bold text-white mb-8">إنجازاتنا في عالم التصميم</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioHighlights.map((highlight, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-sm leading-relaxed">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <h3 className="text-3xl font-bold text-white mb-12">عملية التصميم الإبداعية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "فهم المشروع", desc: "دراسة متطلباتك وأهدافك", icon: Eye },
              { step: "02", title: "العصف الذهني", desc: "توليد الأفكار الإبداعية", icon: Brush },
              { step: "03", title: "التصميم والتطوير", desc: "تحويل الأفكار إلى واقع", icon: Palette },
              { step: "04", title: "التسليم والمتابعة", desc: "تسليم العمل وضمان الرضا", icon: Zap }
            ].map((process, index) => {
              const IconComponent = process.icon;
              return (
                <div key={index} className="relative group">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-indigo-500/50 to-transparent transform -translate-y-1/2 z-0" />
                  )}
                  
                  <div className="relative z-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {process.step}
                    </div>
                    
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-5 h-5 text-indigo-400" />
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">{process.title}</h4>
                    <p className="text-sm text-slate-300">{process.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "1s" }}>
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl p-12 border border-indigo-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-sm font-medium">
                استشارة تصميم مجانية
              </Badge>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">
              هل تريد تصميماً يميز علامتك التجارية؟
            </h3>
            
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              احصل على استشارة مجانية من فريق التصميم المتخصص واكتشف كيف يمكننا تحويل رؤيتك إلى تصاميم مذهلة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("السلام عليكم، أود حجز استشارة مجانية حول خدمات التصميم")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg font-medium"
                >
                  احجز استشارة مجانية
                  <ChevronRight className="w-5 h-5 mr-2" />
                </Button>
              </a>
              
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("أود الاطلاع على معرض أعمالكم في التصميم")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg"
                >
                  شاهد معرض الأعمال
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSolutionsSection;