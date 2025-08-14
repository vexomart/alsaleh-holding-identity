import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  HelpCircle, 
  Shield, 
  CreditCard, 
  Zap, 
  Star,
  Building,
  Search,
  Phone,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Smartphone,
  Gamepad2,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      title: "الأسئلة العامة",
      icon: HelpCircle,
      color: "from-blue-500 to-indigo-600",
      faqs: [
        {
          question: "ما هو متجر البطاقات الإلكترونية؟",
          answer: "متجر البطاقات الإلكترونية هو المتجر الأول والأكثر ثقة في المملكة العربية السعودية لبيع البطاقات الرقمية والإلكترونية. نوفر بطاقات أصلية للألعاب والتطبيقات والخدمات المختلفة بأفضل الأسعار.",
          tags: ["متجر", "بطاقات", "السعودية"]
        },
        {
          question: "هل البطاقات التي تبيعونها أصلية؟",
          answer: "نعم، جميع البطاقات التي نبيعها أصلية 100% ومضمونة من المصادر الرسمية. نحن نتعامل مع الموزعين المعتمدين فقط لضمان أصالة وجودة البطاقات.",
          tags: ["أصلية", "ضمان", "جودة"]
        },
        {
          question: "في أي المناطق تقدمون خدماتكم؟",
          answer: "نقدم خدماتنا في جميع أنحاء المملكة العربية السعودية. البطاقات الإلكترونية تُرسل فوراً عبر الواتساب أو البريد الإلكتروني، لذا لا توجد قيود جغرافية.",
          tags: ["السعودية", "جميع المناطق", "توصيل"]
        },
        {
          question: "ما هي أوقات عمل المتجر؟",
          answer: "المتجر الإلكتروني متاح 24/7. خدمة العملاء متاحة من السبت إلى الخميس من 9 صباحاً حتى 11 مساءً، ويوم الجمعة من 2 ظهراً حتى 11 مساءً. الدعم الفني متاح على مدار الساعة.",
          tags: ["أوقات العمل", "24/7", "دعم"]
        }
      ]
    },
    {
      title: "الشراء والدفع",
      icon: CreditCard,
      color: "from-green-500 to-emerald-600",
      faqs: [
        {
          question: "كيف يمكنني شراء بطاقة؟",
          answer: "يمكنك شراء البطاقات بسهولة: 1) اختر البطاقة المطلوبة من الموقع 2) اضغط على 'اشتري الآن' 3) سيتم تحويلك للواتساب لإكمال عملية الشراء 4) ادفع عبر الطرق المتاحة 5) احصل على البطاقة فوراً.",
          tags: ["شراء", "خطوات", "واتساب"]
        },
        {
          question: "ما هي طرق الدفع المتاحة؟",
          answer: "نوفر عدة طرق دفع آمنة: التحويل البنكي، البطاقات الائتمانية (فيزا/ماستركارد)، STC Pay، تطبيق تمارا للدفع المؤجل، وتطبيق تابي. جميع المعاملات محمية بأعلى معايير الأمان.",
          tags: ["دفع", "تحويل", "بطاقات ائتمانية"]
        },
        {
          question: "هل يمكنني الدفع بالتقسيط؟",
          answer: "نعم، نوفر خيارات دفع مرنة عبر تطبيق تمارا (قسّط على 3 دفعات بدون فوائد) وتطبيق تابي (قسّط على 4 دفعات). هذه الخدمات متاحة للمشتريات التي تزيد عن 100 ريال.",
          tags: ["تقسيط", "تمارا", "تابي"]
        },
        {
          question: "متى سأحصل على البطاقة بعد الدفع؟",
          answer: "ستحصل على البطاقة خلال دقائق معدودة بعد تأكيد الدفع. نرسل البطاقة عبر الواتساب أو البريد الإلكتروني حسب تفضيلك. في حالات نادرة قد يستغرق الأمر حتى ساعة واحدة.",
          tags: ["توقيت", "فوري", "تسليم"]
        }
      ]
    },
    {
      title: "البطاقات والمنتجات",
      icon: Gift,
      color: "from-purple-500 to-violet-600",
      faqs: [
        {
          question: "ما أنواع البطاقات المتوفرة؟",
          answer: "نوفر مجموعة واسعة من البطاقات: بطاقات الألعاب (PlayStation, Xbox, Steam, Nintendo)، بطاقات التطبيقات (Apple Store, Google Play)، بطاقات الترفيه (Netflix, Spotify, Shahid)، بطاقات التسوق (Amazon, Noon)، والبطاقات المصرفية المدفوعة مسبقاً.",
          tags: ["أنواع", "ألعاب", "تطبيقات", "ترفيه"]
        },
        {
          question: "هل تتوفر بطاقات بفئات مختلفة؟",
          answer: "نعم، نوفر البطاقات بفئات متعددة لتناسب احتياجاتك: 25، 50، 100، 200، 500 ريال وأكثر. بعض البطاقات متوفرة بفئات دولارية أيضاً. يمكنك اختيار الفئة المناسبة لميزانيتك.",
          tags: ["فئات", "أسعار", "خيارات"]
        },
        {
          question: "هل يمكنني طلب بطاقة غير متوفرة في الموقع؟",
          answer: "بالتأكيد! إذا كنت تبحث عن بطاقة معينة غير متوفرة في الموقع، تواصل معنا عبر الواتساب وسنبذل قصارى جهدنا لتوفيرها لك. نحن دائماً نسعى لتلبية احتياجات عملائنا.",
          tags: ["طلب خاص", "تواصل", "توفير"]
        },
        {
          question: "هل البطاقات لها تاريخ انتهاء؟",
          answer: "معظم البطاقات لا تنتهي صلاحيتها، لكن بعض البطاقات قد تحتوي على تاريخ انتهاء. سنوضح لك جميع التفاصيل قبل الشراء. ننصح باستخدام البطاقة خلال سنة من تاريخ الشراء للأمان.",
          tags: ["انتهاء", "صلاحية", "استخدام"]
        }
      ]
    },
    {
      title: "الأمان والضمان",
      icon: Shield,
      color: "from-red-500 to-rose-600",
      faqs: [
        {
          question: "كيف تضمنون أمان المعاملات؟",
          answer: "نستخدم أحدث تقنيات التشفير (SSL 256-bit) لحماية بياناتك. جميع المعاملات تتم عبر بوابات دفع آمنة ومعتمدة. لا نحتفظ ببيانات البطاقات الائتمانية على خوادمنا. فريق الأمان يراقب جميع العمليات على مدار الساعة.",
          tags: ["أمان", "تشفير", "حماية"]
        },
        {
          question: "ماذا لو واجهت مشكلة في البطاقة؟",
          answer: "نوفر ضمان 100% على جميع البطاقات. إذا واجهت أي مشكلة، تواصل معنا خلال 7 أيام من تاريخ الشراء وسنحل المشكلة فوراً أو نستبدل البطاقة أو نسترد المبلغ كاملاً.",
          tags: ["ضمان", "مشكلة", "استرداد"]
        },
        {
          question: "هل يمكنني استرداد المبلغ؟",
          answer: "نعم، يمكنك استرداد المبلغ خلال 7 أيام من تاريخ الشراء في الحالات التالية: عدم عمل البطاقة، خطأ في نوع البطاقة، أو عدم الحاجة للبطاقة (شرط عدم الاستخدام). عملية الاسترداد تتم خلال 3-5 أيام عمل.",
          tags: ["استرداد", "مبلغ", "شروط"]
        },
        {
          question: "كيف أتأكد من أن البطاقة تعمل؟",
          answer: "نختبر جميع البطاقات قبل الإرسال للتأكد من عملها. بعد استلام البطاقة، ستجد تعليمات واضحة لكيفية الاستخدام. إذا واجهت أي مشكلة، تواصل معنا فوراً لنساعدك في الحل أو الاستبدال.",
          tags: ["اختبار", "تعليمات", "دعم"]
        }
      ]
    },
    {
      title: "الدعم الفني",
      icon: Zap,
      color: "from-orange-500 to-amber-600",
      faqs: [
        {
          question: "كيف يمكنني التواصل مع الدعم الفني؟",
          answer: "يمكنك التواصل معنا بعدة طرق: واتساب (+966 50 000 0000) متاح 24/7، المكالمات الهاتفية خلال ساعات العمل، البريد الإلكتروني (info@cards-store.com)، أو عبر نموذج التواصل في الموقع.",
          tags: ["دعم", "واتساب", "تواصل"]
        },
        {
          question: "كم يستغرق الرد على الاستفسارات؟",
          answer: "نسعى للرد على جميع الاستفسارات خلال ساعة واحدة كحد أقصى. الاستفسارات العاجلة عبر الواتساب يتم الرد عليها خلال دقائق. للمشاكل التقنية المعقدة قد نحتاج حتى 24 ساعة.",
          tags: ["وقت الرد", "سرعة", "استجابة"]
        },
        {
          question: "هل تقدمون مساعدة في تفعيل البطاقات؟",
          answer: "بالطبع! نقدم مساعدة شاملة في تفعيل واستخدام البطاقات. سنرسل لك تعليمات مفصلة مع كل بطاقة، وإذا احتجت مساعدة إضافية، فريقنا جاهز لمساعدتك خطوة بخطوة.",
          tags: ["تفعيل", "مساعدة", "تعليمات"]
        },
        {
          question: "هل يمكنني الحصول على فاتورة؟",
          answer: "نعم، نوفر فواتير رسمية لجميع المشتريات. ستحصل على فاتورة إلكترونية تحتوي على جميع تفاصيل الشراء. للشركات، يمكننا توفير فواتير ضريبية معتمدة حسب أنظمة المملكة.",
          tags: ["فاتورة", "رسمية", "ضريبية"]
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => category.faqs.length > 0);

  const quickActions = [
    {
      title: "تواصل مع الدعم",
      description: "مساعدة فورية عبر واتساب",
      icon: MessageCircle,
      action: () => window.open("https://wa.me/966500000000?text=مرحباً! أحتاج مساعدة", '_blank'),
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "مشكلة في البطاقة",
      description: "إبلاغ عن مشكلة فنية",
      icon: AlertCircle,
      action: () => window.open("https://wa.me/966500000000?text=لدي مشكلة في البطاقة", '_blank'),
      color: "from-red-500 to-rose-600"
    },
    {
      title: "طلب بطاقة خاصة",
      description: "بطاقة غير متوفرة في الموقع",
      icon: Search,
      action: () => window.open("https://wa.me/966500000000?text=أريد طلب بطاقة خاصة", '_blank'),
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "اتصل بنا",
      description: "مكالمة هاتفية مباشرة",
      icon: Phone,
      action: () => window.open('tel:+966500000000', '_blank'),
      color: "from-purple-500 to-violet-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-3 px-4">
        <div className="container mx-auto text-center">
          <p className="text-xs md:text-sm font-medium flex items-center justify-center gap-2">
            <Building className="w-3 md:w-4 h-3 md:h-4 animate-pulse text-blue-400" />
            🏢 تم تطوير هذا المتجر بواسطة <span className="text-blue-400 font-bold">شركة علي صالح الشهري القابضة</span>
          </p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/cards-store" className="flex items-center gap-3 group">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  🛍️ متجر البطاقات الإلكترونية
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">المتجر الأول والأكثر ثقة</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => {
                  const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                💬 واتساب
              </Button>
              
              <Link to="/cards-store">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative">
          <Badge className="bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary mb-6 text-lg px-6 py-3 border border-primary/20">
            <HelpCircle className="w-5 h-5 ml-2" />
            الأسئلة الشائعة
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            كل ما تريد معرفته عن 
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent block">
              متجر البطاقات الإلكترونية
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            ابحث في مجموعتنا الشاملة من الأسئلة والأجوبة للحصول على إجابات سريعة لجميع استفساراتك
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في الأسئلة الشائعة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm focus:border-primary focus:outline-none transition-all text-center text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              🚀 مساعدة سريعة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              هل تحتاج مساعدة فورية؟ اختر الخيار المناسب
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer"
                  onClick={action.action}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          {searchTerm && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800 dark:text-blue-200">
                  نتائج البحث عن: <span className="font-bold">"{searchTerm}"</span>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {filteredFAQs.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  لم يتم العثور على نتائج
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  جرب البحث بكلمات مختلفة أو تصفح الأقسام أدناه
                </p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  مسح البحث
                </Button>
              </Card>
            ) : (
              filteredFAQs.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <Card key={categoryIndex} className="overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${category.color} text-white`}>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <IconComponent className="w-8 h-8" />
                        {category.title}
                        <Badge className="bg-white/20 text-white border-0 ml-auto">
                          {category.faqs.length} سؤال
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem 
                            key={faqIndex} 
                            value={`${categoryIndex}-${faqIndex}`}
                            className="border-b border-slate-200 dark:border-slate-700"
                          >
                            <AccordionTrigger className="px-6 py-4 text-right hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                              <div className="flex items-center gap-3 flex-1">
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="text-lg font-medium text-slate-900 dark:text-white">
                                  {faq.question}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mt-2">
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                                  {faq.answer}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {faq.tags.map((tag, tagIndex) => (
                                    <Badge 
                                      key={tagIndex}
                                      variant="secondary" 
                                      className="text-xs bg-primary/10 text-primary"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لم تجد الإجابة على سؤالك؟
            </h2>
            <p className="text-xl mb-8 opacity-90">
              فريق الدعم مستعد لمساعدتك في أي وقت
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Button 
                size="lg"
                onClick={() => window.open("https://wa.me/966500000000?text=مرحباً! لدي سؤال غير موجود في الأسئلة الشائعة", '_blank')}
                className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm h-auto p-6 flex-col space-y-2"
              >
                <MessageCircle className="w-8 h-8" />
                <span className="text-lg font-bold">تواصل عبر واتساب</span>
                <span className="text-sm opacity-80">رد فوري على استفسارك</span>
              </Button>

              <Link to="/cards-store/contact">
                <Button 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm h-auto p-6 flex-col space-y-2 w-full"
                >
                  <Phone className="w-8 h-8" />
                  <span className="text-lg font-bold">صفحة التواصل</span>
                  <span className="text-sm opacity-80">جميع طرق التواصل</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;