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
  Target,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import DesignServiceRequestForm from "./DesignServiceRequestForm";

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
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      price: "5,000",
      deliveryTime: "2-3 أسابيع",
      whatsappMessage: `السلام عليكم ورحمة الله وبركاته 👋

🎨 أود طلب خدمة إنشاء الهوية التجارية

📋 تفاصيل الخدمة:
• تصميم شعار احترافي
• دليل الهوية البصرية الكامل
• اختيار الألوان والخطوط المناسبة
• تطبيقات الهوية على جميع المواد

💰 السعر: من 5,000 ريال
⏰ مدة التنفيذ: 2-3 أسابيع

يرجى إرسال تفاصيل المشروع وأهداف العلامة التجارية.

شكراً لكم 🙏`
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
      whatsappMessage: `السلام عليكم ورحمة الله وبركاته 👋

📄 أود طلب خدمة إنشاء الملف التعريفي

📋 تفاصيل الخدمة:
• تصميم ملف تعريفي احترافي
• كتابة محتوى جذاب ومؤثر
• تصوير أو توفير صور عالية الجودة
• تسليم نسخ رقمية وقابلة للطباعة

💰 السعر: من 3,500 ريال
⏰ مدة التنفيذ: 1-2 أسبوع

يرجى مشاركة معلومات الشركة والخدمات المطلوب عرضها.

شكراً لكم 🙏`
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
      whatsappMessage: `السلام عليكم ورحمة الله وبركاته 👋

🎬 أود طلب خدمة الموشن جرافيك

📋 تفاصيل الخدمة:
• رسوم متحركة ثنائية وثلاثية الأبعاد
• انيميشن الشعار الاحترافي
• فيديوهات تعريفية متحركة
• مؤثرات بصرية متقدمة

💰 السعر: من 4,000 ريال
⏰ مدة التنفيذ: 2-4 أسابيع

يرجى توضيح الفكرة المطلوبة ومدة الفيديو المرغوب.

شكراً لكم 🙏`
    },
    {
      title: "التصوير الفوتوغرافي",
      description: "جلسات تصوير احترافية للمنتجات والفعاليات والبروفايل الشخصي والتجاري",
      icon: Camera,
      features: ["تصوير المنتجات", "تصوير الفعاليات", "البورتريه المهني", "التصوير التجاري"],
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-50 to-violet-50",
      price: "2,500",
      deliveryTime: "3-7 أيام",
      whatsappMessage: `السلام عليكم ورحمة الله وبركاته 👋

📸 أود طلب خدمة التصوير الفوتوغرافي

📋 تفاصيل الخدمة:
• تصوير المنتجات بجودة عالية
• تغطية الفعاليات والمناسبات
• جلسات البورتريه المهني
• التصوير التجاري للشركات

💰 السعر: من 2,500 ريال
⏰ مدة التنفيذ: 3-7 أيام

يرجى تحديد نوع التصوير المطلوب والمكان المفضل.

شكراً لكم 🙏`
    },
    {
      title: "تصوير الفيديوهات",
      description: "إنتاج فيديوهات عالية الجودة للدعاية والإعلان والمحتوى التسويقي",
      icon: Video,
      features: ["فيديوهات ترويجية", "مقاطع دعائية", "مقابلات", "تغطية الفعاليات"],
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-50",
      price: "6,000",
      deliveryTime: "1-3 أسابيع",
      whatsappMessage: `السلام عليكم ورحمة الله وبركاته 👋

🎥 أود طلب خدمة تصوير الفيديوهات

📋 تفاصيل الخدمة:
• إنتاج فيديوهات ترويجية احترافية
• تصوير مقاطع دعائية مؤثرة
• تسجيل المقابلات والحوارات
• تغطية الفعاليات والمؤتمرات

💰 السعر: من 6,000 ريال
⏰ مدة التنفيذ: 1-3 أسابيع

يرجى توضيح نوع الفيديو المطلوب والمدة المرغوبة.

شكراً لكم 🙏`
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
    <section id="design-solutions" className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-800 to-teal-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-bl from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-500/20 mb-6">
            <Palette className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">حلول التصميم الإبداعية</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              حلول التصميم
            </span>
            <br />
            <span className="text-white">
              الإبداعية والمتميزة
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            نحول أفكارك إلى تصاميم بصرية مذهلة تحكي قصة علامتك التجارية وتترك أثراً لا يُنسى في أذهان جمهورك المستهدف
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-emerald-400" />
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
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
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
                  <DesignServiceRequestForm
                    trigger={
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-white/20 text-white hover:bg-white/10 hover:border-emerald-400 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:border-transparent"
                      >
                        <Send className="w-4 h-4 ml-2" />
                        <span>اطلب الخدمة</span>
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    }
                  />
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
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent transform -translate-y-1/2 z-0" />
                  )}
                  
                  <div className="relative z-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {process.step}
                    </div>
                    
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-5 h-5 text-emerald-400" />
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
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-sm font-medium">
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
              <DesignServiceRequestForm
                trigger={
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-xl border-0 hover:scale-105 transition-all duration-300"
                  >
                    <Send className="w-5 h-5 ml-2" />
                    احجز استشارة مجانية
                    <Sparkles className="w-5 h-5 mr-2" />
                  </Button>
                }
              />
              
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`السلام عليكم ورحمة الله وبركاته 👋

🎨 أود التواصل السريع حول خدمات التصميم

📋 أود معرفة المزيد عن:
• خدمات التصميم المتاحة
• الأسعار والعروض الحالية  
• أمثلة من أعمالكم السابقة
• الاستشارة المجانية

💡 يمكنكم التواصل معي عبر:
📞 الهاتف لمناقشة سريعة
📧 الإيميل لإرسال التفاصيل

شكراً لكم 🙏`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 hover:border-emerald-400 font-bold px-8 py-4 text-lg rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  تواصل واتساب سريع
                  <ChevronRight className="w-5 h-5 mr-2" />
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