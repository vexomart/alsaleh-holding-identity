import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  MessageCircle, 
  HelpCircle, 
  Search, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  Globe,
  Shield,
  Code,
  Settings,
  Zap,
  FileText,
  CreditCard,
  Calendar,
  HeadphonesIcon
} from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      category: "الأسئلة العامة",
      icon: HelpCircle,
      questions: [
        {
          question: "ما هي خدمات شركة علي صالح الشهري القابضة؟",
          answer: "نحن شركة قابضة متخصصة في تقديم خدمات شاملة تشمل: تطوير البرمجيات المخصصة، تصميم وتطوير المواقع الإلكترونية، الاستشارات الاستراتيجية، الحلول التقنية المتكاملة، التصميم الإبداعي والهوية البصرية، وحلول التحول الرقمي للشركات."
        },
        {
          question: "أين تقع الشركة وما هي ساعات العمل؟",
          answer: "نحن نقدم خدماتنا في جميع أنحاء المملكة العربية السعودية. ساعات العمل من الأحد إلى الخميس من 8:00 صباحاً حتى 6:00 مساءً. كما نقدم دعماً فنياً على مدار الساعة للمشاريع الحرجة."
        },
        {
          question: "كيف يمكنني التواصل مع الشركة؟",
          answer: "يمكنك التواصل معنا عبر الواتساب على 0555812567، أو عبر البريد الإلكتروني info@ash.holdings، أو من خلال نموذج التواصل في الموقع. نلتزم بالرد على جميع الاستفسارات خلال 24 ساعة."
        },
        {
          question: "هل تقدمون خدمات للشركات الصغيرة والمتوسطة؟",
          answer: "نعم، نقدم خدماتنا لجميع أحجام الشركات من الشركات الناشئة والصغيرة إلى المؤسسات الكبيرة. لدينا باقات مخصصة تناسب مختلف الميزانيات والاحتياجات."
        }
      ]
    },
    {
      category: "التطوير والبرمجة",
      icon: Code,
      questions: [
        {
          question: "ما هي التقنيات التي تستخدمونها في التطوير؟",
          answer: "نستخدم أحدث التقنيات مثل React, Next.js, Node.js, Python, Java, .NET للتطوير. كما نعمل مع قواعد البيانات المختلفة وتقنيات الحوسبة السحابية من AWS, Azure, وGoogle Cloud."
        },
        {
          question: "كم يستغرق تطوير موقع إلكتروني؟",
          answer: "يعتمد على تعقيد المشروع. المواقع البسيطة تحتاج 2-4 أسابيع، والمواقع المتوسطة 6-8 أسابيع، والمواقع المعقدة قد تحتاج 3-6 أشهر. نقدم تقديراً مفصلاً بعد دراسة المتطلبات."
        },
        {
          question: "هل تقدمون صيانة ودعم بعد التسليم؟",
          answer: "نعم، نقدم خدمات صيانة ودعم شاملة تشمل: التحديثات الأمنية، إصلاح الأخطاء، التحديثات الوظيفية، النسخ الاحتياطي، ومراقبة الأداء. كما نقدم تدريباً للفرق الداخلية."
        },
        {
          question: "هل يمكنكم تطوير تطبيقات الهاتف المحمول؟",
          answer: "نعم، نطور تطبيقات الهاتف المحمول لأنظمة iOS وAndroid باستخدام تقنيات متقدمة مثل React Native وFlutter لضمان الأداء الأمثل والتوافق مع جميع الأجهزة."
        }
      ]
    },
    {
      category: "التصميم والهوية البصرية",
      icon: Building2,
      questions: [
        {
          question: "ما الذي يشمله تصميم الهوية البصرية؟",
          answer: "تصميم الهوية البصرية يشمل: تصميم الشعار، اختيار الألوان والخطوط، تصميم الكروت الشخصية، اللوحات الإعلانية، النشرات التسويقية، وكامل دليل الهوية البصرية للاستخدام المستقبلي."
        },
        {
          question: "كم يستغرق تصميم هوية بصرية كاملة؟",
          answer: "عادة ما يستغرق تصميم الهوية البصرية الكاملة من 3-6 أسابيع، تشمل مرحلة البحث والدراسة، التصميم الأولي، المراجعات، والتسليم النهائي مع جميع الملفات بصيغ مختلفة."
        },
        {
          question: "هل تقدمون مراجعات مجانية على التصاميم؟",
          answer: "نعم، نقدم حتى 3 مراجعات مجانية لكل مشروع تصميم لضمان رضاكم التام. المراجعات الإضافية تخضع لرسوم إضافية وفقاً لحجم التعديلات المطلوبة."
        }
      ]
    },
    {
      category: "الاستشارات والحلول",
      icon: Users,
      questions: [
        {
          question: "ما هي الاستشارات التي تقدمونها؟",
          answer: "نقدم استشارات في: التخطيط الاستراتيجي، التحول الرقمي، تحسين العمليات، إدارة المخاطر، الامتثال، استراتيجيات التقنية، وتطوير الأعمال. كل استشارة مخصصة حسب احتياجات العميل."
        },
        {
          question: "هل تقدمون استشارة مجانية؟",
          answer: "نعم، نقدم جلسة استشارية مجانية لمدة ساعة واحدة لفهم احتياجاتكم وتقديم توصيات أولية. هذا يساعدنا على تقديم اقتراح مفصل ومناسب لمتطلباتكم."
        },
        {
          question: "ما هي مدة مشاريع الاستشارات؟",
          answer: "تختلف حسب نوع الاستشارة: التقييمات السريعة 2-4 أسابيع، المشاريع المتوسطة 2-4 أشهر، والمشاريع الكبيرة قد تستمر 6-12 شهر مع متابعة ودعم مستمر."
        }
      ]
    },
    {
      category: "الأسعار والدفع",
      icon: CreditCard,
      questions: [
        {
          question: "كيف يتم تحديد أسعار المشاريع؟",
          answer: "نحدد الأسعار بناءً على: حجم وتعقيد المشروع، التقنيات المطلوبة، المدة الزمنية، والموارد المطلوبة. نقدم عروض أسعار مفصلة وشفافة بدون تكاليف خفية."
        },
        {
          question: "ما هي طرق الدفع المتاحة؟",
          answer: "نقبل الدفع عبر: التحويل البنكي، الشيكات، والدفع الإلكتروني. نتبع نظام دفعات مرحلية: 50% عند بداية المشروع، 30% عند منتصف المشروع، و20% عند التسليم النهائي."
        },
        {
          question: "هل تقدمون خصومات للمشاريع الكبيرة؟",
          answer: "نعم، نقدم خصومات تنافسية للمشاريع الكبيرة والعقود طويلة المدى. كما نقدم أسعاراً خاصة للشركات الناشئة والمؤسسات التعليمية والخيرية."
        }
      ]
    },
    {
      category: "الدعم والصيانة",
      icon: HeadphonesIcon,
      questions: [
        {
          question: "ما أنواع الدعم التي تقدمونها؟",
          answer: "نقدم: دعم فني على مدار الساعة للأنظمة الحرجة، صيانة دورية، تحديثات أمنية، نسخ احتياطية، مراقبة الأداء، وتدريب المستخدمين. كل هذا مع ضمان أوقات استجابة سريعة."
        },
        {
          question: "كم تبلغ تكلفة الصيانة السنوية؟",
          answer: "تتراوح تكلفة الصيانة السنوية بين 15-25% من قيمة المشروع الأساسية، حسب نوع النظام ومستوى الدعم المطلوب. نقدم باقات صيانة مختلفة تناسب جميع الاحتياجات."
        },
        {
          question: "ما هو وقت الاستجابة لطلبات الدعم؟",
          answer: "للمشاكل الحرجة: خلال ساعة واحدة، للمشاكل العادية: خلال 4 ساعات، للطلبات العامة: خلال 24 ساعة. نلتزم بهذه الأوقات ونقدم تحديثات دورية عن حالة الطلب."
        }
      ]
    }
  ];

  const quickContacts = [
    {
      method: "الواتساب",
      value: "0555812567",
      icon: MessageCircle,
      link: "https://wa.me/966555812567",
      description: "تواصل سريع ومباشر"
    },
    {
      method: "البريد الإلكتروني",
      value: "info@ash.holdings",
      icon: Mail,
      link: "mailto:info@ash.holdings",
      description: "للاستفسارات التفصيلية"
    },
    {
      method: "الهاتف",
      value: "0555812567",
      icon: Phone,
      link: "tel:+966555812567",
      description: "للحالات العاجلة"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl animate-float-delayed" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-4 py-2">
              الأسئلة الشائعة
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              إجابات لجميع 
              <span className="text-secondary block mt-2">استفساراتك</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              نجيب على أكثر الأسئلة شيوعاً حول خدماتنا وعملياتنا لمساعدتك في اتخاذ القرار المناسب
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Search className="w-5 h-5 mr-2" />
                ابحث عن إجابة
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <MessageCircle className="w-5 h-5 mr-2" />
                تواصل معنا مباشرة
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">استفسار تم الإجابة عليه</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">دعم على مدار الساعة</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1ساعة</div>
              <div className="text-muted-foreground">متوسط وقت الاستجابة</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">رضا العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              الأسئلة المصنفة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              تصفح الأسئلة حسب الفئة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              قمنا بتصنيف الأسئلة لتسهيل العثور على الإجابة التي تبحث عنها
            </p>
          </div>

          <div className="grid gap-8">
            {faqCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <Card key={categoryIndex} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{category.category}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {category.questions.length} سؤال في هذه الفئة
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, questionIndex) => (
                        <AccordionItem key={questionIndex} value={`item-${categoryIndex}-${questionIndex}`}>
                          <AccordionTrigger className="text-right hover:text-primary transition-colors">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              طرق التواصل السريع
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              لم تجد إجابة لسؤالك؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              تواصل معنا مباشرة وسنجيب على استفسارك في أسرع وقت ممكن
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {quickContacts.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{contact.method}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {contact.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-foreground mb-4">{contact.value}</p>
                    <Button asChild className="w-full">
                      <a href={contact.link} target="_blank" rel="noopener noreferrer">
                        تواصل الآن
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help Center */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl">مركز المساعدة</CardTitle>
                <CardDescription className="text-lg">
                  فريق الدعم الفني متاح لمساعدتك على مدار الساعة
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">دعم 24/7</h4>
                  <p className="text-sm text-muted-foreground">فريق دعم متاح على مدار الساعة</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">استجابة سريعة</h4>
                  <p className="text-sm text-muted-foreground">نجيب خلال ساعة واحدة كحد أقصى</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">فريق متخصص</h4>
                  <p className="text-sm text-muted-foreground">خبراء في جميع المجالات التقنية</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              هل أنت مستعد لبدء مشروعك؟
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              تواصل معنا اليوم ودعنا نساعدك في تحويل أفكارك إلى واقع رقمي مبهر
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <a href="https://wa.me/966555812567?text=مرحباً، لدي سؤال لم أجد إجابته في الأسئلة الشائعة" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  اسأل سؤالك الآن
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="/contact">
                  <Calendar className="w-5 h-5 mr-2" />
                  احجز استشارة مجانية
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;