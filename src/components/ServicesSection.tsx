import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Megaphone, 
  Palette, 
  Link, 
  ShoppingCart, 
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Phone,
  TrendingUp,
  Award,
  Clock,
  PieChart,
  FileText,
  Globe,
  Shield,
  Printer,
  Briefcase,
  Mic,
  Camera,
  Wrench,
  Truck
} from "lucide-react";

const services = [
  {
    id: 1,
    title: "خدمات البرمجة",
    description: "تطوير تطبيقات ومواقع إلكترونية بأحدث التقنيات العالمية",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    services: [
      "تطوير مواقع الويب المتقدمة",
      "تطبيقات الجوال (iOS & Android)",
      "أنظمة إدارة المحتوى CMS",
      "واجهات برمجة التطبيقات API",
      "تطبيقات سطح المكتب"
    ],
    technologies: ["React", "Node.js", "Python", "Flutter", "Laravel", "TypeScript"],
    startingPrice: "5,000",
    rating: 4.9,
    projectsCount: 150,
    deliveryTime: "2-4 أسابيع",
    features: [
      "كود نظيف ومحسن",
      "تصميم متجاوب",
      "أمان عالي",
      "سرعة في التحميل"
    ]
  },
  {
    id: 2,
    title: "التسويق الإلكتروني",
    description: "استراتيجيات تسويقية شاملة لزيادة المبيعات والوصول",
    icon: Megaphone,
    color: "from-pink-500 to-red-500",
    bgGradient: "from-pink-50 to-red-50",
    services: [
      "إدارة وسائل التواصل الاجتماعي",
      "الإعلانات المدفوعة (Google & Facebook)",
      "تحسين محركات البحث SEO",
      "التسويق بالمحتوى الإبداعي",
      "التسويق عبر البريد الإلكتروني"
    ],
    technologies: ["Google Ads", "Facebook Ads", "Instagram", "LinkedIn", "Analytics", "SEMrush"],
    startingPrice: "3,000",
    rating: 4.8,
    projectsCount: 200,
    deliveryTime: "1-2 أسابيع",
    features: [
      "زيادة المبيعات",
      "بناء الهوية",
      "تقارير شاملة",
      "استهداف دقيق"
    ]
  },
  {
    id: 3,
    title: "التصميم الإبداعي",
    description: "تصاميم إبداعية احترافية تعكس هوية علامتك التجارية",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    services: [
      "تصميم الهوية البصرية الكاملة",
      "تصميم واجهات المستخدم UI/UX",
      "تصميم المطبوعات التسويقية",
      "تصميم الإعلانات الرقمية",
      "الرسوم المتحركة والموشن"
    ],
    technologies: ["Adobe Creative Suite", "Figma", "Sketch", "Blender", "After Effects", "Canva"],
    startingPrice: "2,500",
    rating: 4.9,
    projectsCount: 300,
    deliveryTime: "1-3 أسابيع",
    features: [
      "تصميم احترافي",
      "هوية مميزة",
      "ملفات عالية الجودة",
      "تعديلات مجانية"
    ]
  },
  {
    id: 4,
    title: "الربط والتطوير",
    description: "ربط الأنظمة وتطوير الحلول المتكاملة والأتمتة",
    icon: Link,
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    services: [
      "ربط أنظمة الدفع الآمنة",
      "تكامل واجهات برمجة التطبيقات",
      "أتمتة العمليات التجارية",
      "ربط قواعد البيانات المتقدمة",
      "الحلول السحابية المتطورة"
    ],
    technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Microservices"],
    startingPrice: "4,000",
    rating: 4.7,
    projectsCount: 100,
    deliveryTime: "2-6 أسابيع",
    features: [
      "تكامل سلس",
      "أمان عالي",
      "قابلية التوسع",
      "مراقبة مستمرة"
    ]
  },
  {
    id: 5,
    title: "المتاجر الإلكترونية",
    description: "متاجر إلكترونية احترافية متكاملة لزيادة مبيعاتك",
    icon: ShoppingCart,
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    services: [
      "متاجر إلكترونية متكاملة",
      "أنظمة الدفع الآمنة المتعددة",
      "إدارة المخزون الذكية",
      "تقارير المبيعات المتقدمة",
      "تطبيق جوال للمتجر"
    ],
    technologies: ["WooCommerce", "Shopify", "Magento", "Custom Solutions", "Payment Gateways"],
    startingPrice: "8,000",
    rating: 4.8,
    projectsCount: 120,
    deliveryTime: "3-6 أسابيع",
    features: [
      "تجربة مستخدم ممتازة",
      "دفع آمن",
      "إدارة سهلة",
      "تقارير تفصيلية"
    ]
  },
  {
    id: 6,
    title: "منصة الأعمال والتجار",
    description: "منصات ذكية لربط العمال بالعملاء وحلول تجارية متقدمة",
    icon: Users,
    color: "from-teal-500 to-blue-500",
    bgGradient: "from-teal-50 to-blue-50",
    services: [
      "منصات الخدمات التفاعلية",
      "تطبيقات العمال المتخصصة",
      "أنظمة الحجز والمواعيد",
      "إدارة العملاء CRM",
      "نظام التقييمات والمراجعات"
    ],
    technologies: ["Real-time Chat", "GPS Integration", "Payment Systems", "Rating Systems", "Notifications"],
    startingPrice: "6,000",
    rating: 4.6,
    projectsCount: 80,
    deliveryTime: "4-8 أسابيع",
    features: [
      "ربط فوري",
      "تتبع GPS",
      "دفع آمن",
      "نظام تقييم"
    ]
  },
  {
    id: 7,
    title: "الخدمات المالية",
    description: "حلول مالية متطورة وأنظمة محاسبية شاملة لإدارة أموالك بذكاء",
    icon: PieChart,
    color: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-50 to-orange-50",
    services: [
      "أنظمة المحاسبة المتقدمة",
      "إدارة الفواتير والمدفوعات",
      "تحليل الأرباح والخسائر",
      "التخطيط المالي الاستراتيجي",
      "تقارير مالية تفصيلية"
    ],
    technologies: ["QuickBooks", "SAP", "Oracle", "Custom ERP", "Financial Analytics", "Blockchain"],
    startingPrice: "4,500",
    rating: 4.8,
    projectsCount: 95,
    deliveryTime: "3-5 أسابيع",
    features: [
      "أمان مالي عالي",
      "تقارير دقيقة",
      "توافق ضريبي",
      "تحليلات ذكية"
    ]
  },
  {
    id: 8,
    title: "الاستشارات القانونية",
    description: "استشارات قانونية متخصصة وخدمات التوثيق والعقود الإلكترونية",
    icon: FileText,
    color: "from-gray-600 to-slate-600",
    bgGradient: "from-gray-50 to-slate-50",
    services: [
      "صياغة العقود الذكية",
      "الاستشارات القانونية العامة",
      "توثيق المعاملات الرقمية",
      "حماية الملكية الفكرية",
      "التحكيم والوساطة"
    ],
    technologies: ["Legal Management Systems", "Smart Contracts", "Digital Signatures", "Blockchain", "Legal Analytics"],
    startingPrice: "3,500",
    rating: 4.7,
    projectsCount: 110,
    deliveryTime: "1-3 أسابيع",
    features: [
      "توثيق رسمي",
      "حماية قانونية",
      "عقود ذكية",
      "استشارة فورية"
    ]
  },
  {
    id: 9,
    title: "خدمات الترجمة",
    description: "خدمات ترجمة احترافية متعددة اللغات بدقة عالية وسرعة في التسليم",
    icon: Globe,
    color: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
    services: [
      "الترجمة الفورية المتقدمة",
      "ترجمة المستندات الرسمية",
      "الترجمة الصوتية والمرئية",
      "التدقيق اللغوي المتخصص",
      "الترجمة التقنية والطبية"
    ],
    technologies: ["AI Translation", "CAT Tools", "Voice Recognition", "Natural Language Processing", "Quality Assurance"],
    startingPrice: "2,000",
    rating: 4.9,
    projectsCount: 250,
    deliveryTime: "1-2 أسابيع",
    features: [
      "دقة عالية",
      "سرعة التسليم",
      "متعدد اللغات",
      "تدقيق مهني"
    ]
  },
  {
    id: 10,
    title: "التدريب والتطوير",
    description: "برامج تدريبية متخصصة وورش عمل لتطوير مهارات فريقك وزيادة الإنتاجية",
    icon: Award,
    color: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50",
    services: [
      "التدريب التقني المتقدم",
      "تطوير المهارات القيادية",
      "ورش العمل التفاعلية",
      "برامج التأهيل المهني",
      "التدريب الرقمي عن بُعد"
    ],
    technologies: ["Learning Management Systems", "Virtual Reality", "Gamification", "Assessment Tools", "Video Conferencing"],
    startingPrice: "3,000",
    rating: 4.8,
    projectsCount: 160,
    deliveryTime: "2-4 أسابيع",
    features: [
      "برامج مخصصة",
      "تدريب تفاعلي",
      "شهادات معتمدة",
      "متابعة مستمرة"
    ]
  },
  {
    id: 11,
    title: "الأمن السيبراني",
    description: "حلول أمنية متطورة لحماية بياناتك ومعلوماتك من التهديدات الإلكترونية",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    bgGradient: "from-red-50 to-orange-50",
    services: [
      "تقييم الأمان الشامل",
      "حماية البيانات المتقدمة",
      "مراقبة التهديدات الفورية",
      "التدريب على الأمان",
      "خطط الطوارئ والاستجابة"
    ],
    technologies: ["Firewalls", "Encryption", "Vulnerability Assessment", "SIEM", "Threat Intelligence", "Penetration Testing"],
    startingPrice: "5,500",
    rating: 4.9,
    projectsCount: 75,
    deliveryTime: "3-6 أسابيع",
    features: [
      "حماية متقدمة",
      "مراقبة 24/7",
      "استجابة سريعة",
      "تقارير أمنية"
    ]
  }
]; 


const ServicesSection = () => {
  const whatsappNumber = "966555812567";
  
  const openWhatsApp = (serviceTitle: string, price: string, services: string[], technologies: string[], deliveryTime: string, rating: number, projectsCount: number) => {
    const message = `🚀 مرحبا بك في ASH HOLDING

💼 طلب خدمة احترافية
═══════════════════

📌 تفاصيل الخدمة:
🏷️ الخدمة: ${serviceTitle}
💰 يبدا من: ${price} ريال
⭐ التقييم: ${rating}/5
📊 المشاريع: ${projectsCount} مشروع
🕐 التسليم: ${deliveryTime}

🛠️ الخدمات المتضمنة:
${services.slice(0, 4).map((service, index) => `${index + 1}. ${service}`).join('\n')}

💻 التقنيات المستخدمة:
${technologies.slice(0, 3).map((tech, index) => `${index + 1}. ${tech}`).join('\n')}

🎊 مميزات اضافية:
• ادارة ومتابعة شاملة
• دعم فني مستمر
• استشارة مجانية
• ضمان الجودة

💡 اريد البدء في هذه الخدمة!

شكرا لكم 🙏`;
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-teal-100/40"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-300/5 to-teal-300/5 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <Badge variant="secondary" className="text-xl px-8 py-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-0 rounded-full shadow-lg">
              خدماتنا المتنوعة 🚀
            </Badge>
          </div>
          <h2 id="professional-services" className="scroll-mt-28 lg:scroll-mt-40 text-6xl md:text-7xl font-black bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-8 tracking-tight">
            خدماتنا الاحترافية
          </h2>
          <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed font-medium">
            نقدم مجموعة شاملة ومتكاملة من الخدمات التقنية والتسويقية المتطورة بمعايير عالمية لتحقيق أهدافك التجارية بأعلى مستويات الاحترافية
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl transition-all duration-700 border-0 bg-white/80 backdrop-blur-lg shadow-xl">
                {/* Modern Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-0`} />
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className={`p-4 rounded-2xl bg-gradient-to-br ${service.color} cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg relative z-20`}
                      onClick={() => openWhatsApp(service.title, service.startingPrice, service.services, service.technologies, service.deliveryTime, service.rating, service.projectsCount)}
                      title="تواصل عبر الواتساب"
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 relative z-10">
                      <CardTitle className="text-2xl mb-2 text-foreground group-hover:text-foreground">{service.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground group-hover:text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{service.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-blue-500" />
                          <span>{service.projectsCount} مشروع</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span>{service.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-muted-foreground relative z-10">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                  {/* Services List */}
                  <div className="space-y-3 relative z-10">
                    <h4 className="font-bold text-lg text-primary mb-3">📋 الخدمات المتوفرة</h4>
                    {service.services.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Features */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4">
                    <h4 className="font-bold text-sm text-muted-foreground mb-3">✨ المميزات الرئيسية</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-bold text-sm text-muted-foreground mb-3">🔧 التقنيات المستخدمة</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.slice(0, 4).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                          {tech}
                        </Badge>
                      ))}
                      {service.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{service.technologies.length - 4} أخرى
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">يبدأ من</span>
                      <span className="text-3xl font-black text-primary">
                        {service.startingPrice} ر.س
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>أسعار تنافسية</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-2">
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`🚀 مرحبا بك في شركة علي صالح الشهري القابضة

💼 طلب خدمة احترافية
═══════════════════

📌 تفاصيل الخدمة:
🏷️ الخدمة: ${service.title}
💰 يبدا من: ${service.startingPrice} ريال
⭐ التقييم: ${service.rating}/5
📊 المشاريع: ${service.projectsCount} مشروع
🕐 التسليم: ${service.deliveryTime}

🛠️ الخدمات المتضمنة:
${service.services.slice(0, 4).map((serv: string, index: number) => `${index + 1}. ${serv}`).join('\n')}

💻 التقنيات المستخدمة:
${service.technologies.slice(0, 3).map((tech: string, index: number) => `${index + 1}. ${tech}`).join('\n')}

🎊 مميزات اضافية:
• ادارة ومتابعة شاملة
• دعم فني مستمر
• استشارة مجانية
• ضمان الجودة

💡 اريد البدء في هذه الخدمة!

شكرا لكم 🙏`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block"
                    >
                      <Button 
                        className={`w-full group/btn bg-gradient-to-r ${service.color} hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6`}
                        size="lg"
                      >
                        <Phone className="w-5 h-5 ml-2" />
                        اطلب الخدمة الآن
                        <ArrowRight className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                    
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`💭 استشارة مجانية

📌 تفاصيل الاستشارة:
🏷️ الخدمة: ${service.title}
💰 السعر: يبدا من ${service.startingPrice} ريال
🤔 اريد استشارة مجانية

❓ اسئلتي:
• ما افضل حلول لمشروعي؟
• كم المدة المتوقعة؟
• ما التقنيات الانسب؟
• هل يمكن التخصيص؟

💡 اريد جلسة استشارة مجانية!

شكرا لكم 🙏`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-gray-50 transition-all duration-300"
                        size="lg"
                      >
                        استشارة مجانية
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        

        {/* Premium CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 text-white shadow-2xl border border-slate-700">
          <h3 className="text-4xl font-black mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">🎯 هل تحتاج خدمة مخصصة؟</h3>
          <p className="text-2xl mb-8 text-slate-300 font-medium">
            تواصل معنا الآن واحصل على استشارة مجانية وعرض سعر مخصص لمشروعك من خبراء معتمدين
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`🎯 مرحبا بك في شركة علي صالح الشهري القابضة

💼 طلب استشارة شاملة
═══════════════════

📌 تفاصيل الطلب:
🚀 اريد استشارة مجانية شاملة
💡 اريد تحديد افضل الخدمات
💰 اريد عرض سعر مخصص

🤔 معلومات احتاجها:
• تحليل احتياجات مشروعي
• الجدول الزمني للتنفيذ
• افضل التقنيات المناسبة
• استراتيجية النجاح

🎊 الخدمات المطلوبة:
• البرمجة والتطوير
• التسويق الالكتروني
• التصميم الابداعي
• الربط والتطوير
• المتاجر الالكترونية

💡 اريد خطة متكاملة لمشروعي!

شكرا لكم 🙏`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-12 py-6 text-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl border-0 rounded-2xl"
              >
                <Phone className="w-6 h-6 ml-3" />
                احصل على استشارة مجانية
                <ArrowRight className="w-6 h-6 mr-3" />
              </Button>
            </a>
            <div className="text-slate-400 text-lg font-medium">
              خدمة عملاء 24/7 - اتصل الآن: {whatsappNumber.replace('966', '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;