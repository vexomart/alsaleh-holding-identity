import { Check, FileText, Users, Calendar, Shield, Award, Building2, Mail, Phone, MessageSquare, User, Users2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContractForms } from "@/components/ContractForms";

const Contracts = () => {
  const contractSteps = [
    {
      id: 1,
      title: "التقييم الأولي",
      description: "نقوم بدراسة احتياجاتكم ومتطلباتكم بشكل مفصل",
      icon: FileText,
      duration: "1-2 أيام"
    },
    {
      id: 2,
      title: "وضع الخطة",
      description: "إعداد خطة شاملة للمشروع مع الجداول الزمنية",
      icon: Calendar,
      duration: "3-5 أيام"
    },
    {
      id: 3,
      title: "العرض الفني",
      description: "تقديم عرض تقني مفصل بالحلول والأسعار",
      icon: Award,
      duration: "5-7 أيام"
    },
    {
      id: 4,
      title: "التوقيع",
      description: "توقيع العقد وبدء التنفيذ",
      icon: Shield,
      duration: "1-2 أيام"
    }
  ];

  const contractTypes = [
    {
      title: "التطوير التقني",
      description: "عقود تطوير المواقع والتطبيقات والأنظمة",
      features: ["تطوير مخصص", "دعم فني", "تحديثات مستمرة", "ضمان الجودة"],
      duration: "1-12 شهر",
      category: "تقني"
    },
    {
      title: "الاستشارات الإستراتيجية",
      description: "عقود الاستشارات في التحول الرقمي والإدارة",
      features: ["تحليل الوضع الحالي", "وضع الإستراتيجيات", "متابعة التنفيذ", "قياس النتائج"],
      duration: "3-6 أشهر",
      category: "استشاري"
    },
    {
      title: "الحلول المتكاملة",
      description: "عقود شاملة للحلول التقنية والإدارية",
      features: ["حلول شاملة", "فريق متخصص", "دعم شامل", "تدريب الفريق"],
      duration: "6-18 شهر",
      category: "شامل"
    }
  ];

  const requirements = [
    "هوية تجارية سارية المفعول",
    "ترخيص مزاولة النشاط",
    "تحديد نطاق العمل بوضوح",
    "الموافقة على الشروط والأحكام",
    "توفير المعلومات المطلوبة"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              شركة علي صالح الشهري القابضة
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              طريقة التعاقد معنا
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              تعرف على خطوات التعاقد مع شركة علي صالح الشهري القابضة وأنواع العقود المختلفة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <MessageSquare className="w-5 h-5 mr-2" />
                ابدأ المحادثة
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="w-5 h-5 mr-2" />
                اتصل بنا الآن
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Process */}
      <section id="process" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خطوات التعاقد
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              عملية بسيطة وواضحة للتعاقد معنا في 4 خطوات أساسية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contractSteps.map((step, index) => (
              <Card key={step.id} className="relative group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">{step.duration}</Badge>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                
                {index < contractSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600" />
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Detailed Contract Process */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <CardHeader className="text-center mb-8">
                <CardTitle className="text-2xl mb-4">تفاصيل عملية التعاقد</CardTitle>
                <CardDescription className="text-lg">
                  إليك التفاصيل الكاملة لكل خطوة في عملية التعاقد معنا
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">1. التقييم الأولي والاستشارة</h3>
                    <p className="text-gray-700 mb-4">
                      نبدأ بجلسة استشارية مجانية لفهم احتياجاتكم ومتطلباتكم بشكل كامل. خلال هذه المرحلة:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>تحليل الوضع الحالي لشركتكم</li>
                      <li>تحديد الأهداف المطلوب تحقيقها</li>
                      <li>دراسة الميزانية المتاحة</li>
                      <li>تقييم الجدول الزمني المقترح</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">2. وضع الخطة الإستراتيجية</h3>
                    <p className="text-gray-700 mb-4">
                      بناءً على التقييم الأولي، نضع خطة شاملة ومفصلة تشمل:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>تحديد نطاق العمل بدقة</li>
                      <li>وضع الجدول الزمني التفصيلي</li>
                      <li>تحديد الموارد المطلوبة</li>
                      <li>تحديد معايير النجاح والقياس</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">3. العرض الفني والمالي</h3>
                    <p className="text-gray-700 mb-4">
                      نقدم عرضاً تقنياً ومالياً شاملاً يتضمن:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>الحلول التقنية المقترحة</li>
                      <li>التكلفة التفصيلية للمشروع</li>
                      <li>مراحل التسليم والدفع</li>
                      <li>الضمانات وخدمات ما بعد البيع</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">4. التوقيع وبدء التنفيذ</h3>
                    <p className="text-gray-700 mb-4">
                      بعد الموافقة على العرض، نقوم بـ:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>توقيع العقد النهائي</li>
                      <li>تشكيل فريق العمل المختص</li>
                      <li>بدء تنفيذ المشروع حسب الخطة</li>
                      <li>تقديم تقارير دورية عن التقدم</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contract Types */}
      <section id="types" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              أنواع العقود
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نوفر مجموعة شاملة من أنواع العقود لتلبية جميع احتياجاتكم
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {contractTypes.map((contract, index) => (
              <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{contract.category}</Badge>
                    <Badge variant="outline">{contract.duration}</Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{contract.title}</CardTitle>
                  <CardDescription>{contract.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {contract.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full mt-6" variant="outline">
                    طلب عرض سعر
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Contract Types */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
              تفاصيل أنواع العقود
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contract Methods */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">طرق التعاقد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-bold text-gray-900">العقود الثابتة</h4>
                      <p className="text-gray-600 text-sm">سعر محدد مسبقاً لكامل المشروع</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-bold text-gray-900">العقود بالساعة</h4>
                      <p className="text-gray-600 text-sm">تسعير بناءً على ساعات العمل الفعلية</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-bold text-gray-900">العقود المختلطة</h4>
                      <p className="text-gray-600 text-sm">مزيج من التسعير الثابت والمتغير</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-bold text-gray-900">عقود الشراكة</h4>
                      <p className="text-gray-600 text-sm">شراكة طويلة المدى في المشاريع</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Durations */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">مدد العقود</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-bold text-gray-900">عقود قصيرة المدى</h4>
                      <p className="text-gray-600 text-sm">من أسبوع إلى 3 أشهر</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-bold text-gray-900">عقود متوسطة المدى</h4>
                      <p className="text-gray-600 text-sm">من 3 أشهر إلى سنة</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-bold text-gray-900">عقود طويلة المدى</h4>
                      <p className="text-gray-600 text-sm">أكثر من سنة</p>
                    </div>
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h4 className="font-bold text-gray-900">عقود الصيانة</h4>
                      <p className="text-gray-600 text-sm">دعم مستمر وصيانة دورية</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements & Terms */}
      <section id="requirements" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                شروط ومتطلبات التعاقد
              </h2>
              <p className="text-xl text-gray-600">
                كل ما تحتاج معرفته حول شروط ومتطلبات التعاقد معنا
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Requirements */}
              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-center mb-6">
                    <Building2 className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                    المستندات المطلوبة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contract Terms */}
              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-center mb-6">
                    <Shield className="w-8 h-8 mx-auto mb-4 text-green-600" />
                    شروط التعاقد الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">الالتزام بالجودة</h4>
                      <p className="text-gray-600 text-sm">ضمان تسليم المشروع وفقاً لأعلى معايير الجودة</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">الالتزام بالوقت</h4>
                      <p className="text-gray-600 text-sm">تسليم المشروع في المواعيد المحددة</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">السرية التامة</h4>
                      <p className="text-gray-600 text-sm">حماية بيانات العميل وعدم إفشائها</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">الدعم الفني</h4>
                      <p className="text-gray-600 text-sm">تقديم دعم فني شامل لفترة محددة</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">ضمان المشروع</h4>
                      <p className="text-gray-600 text-sm">ضمان ضد العيوب الفنية لمدة عام</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Terms */}
            <Card className="p-8 mb-12">
              <CardHeader>
                <CardTitle className="text-2xl text-center mb-6">
                  <Award className="w-8 h-8 mx-auto mb-4 text-purple-600" />
                  شروط الدفع والتسليم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">30%</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">دفعة البداية</h4>
                    <p className="text-gray-600 text-sm">عند توقيع العقد وبدء المشروع</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">40%</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">دفعة المتابعة</h4>
                    <p className="text-gray-600 text-sm">عند اكتمال 50% من المشروع</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">30%</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">دفعة الإنجاز</h4>
                    <p className="text-gray-600 text-sm">عند التسليم النهائي للمشروع</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Contract Forms Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
              نماذج طلب التعاقد
            </h3>
            
            <ContractForms />
          </div>

          {/* Legal Terms */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-6">
                <FileText className="w-8 h-8 mx-auto mb-4 text-orange-600" />
                الشروط القانونية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg">حقوق الملكية الفكرية</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>العميل يحصل على كامل حقوق الملكية للمشروع</li>
                    <li>الكود المصدري يُسلم للعميل عند الانتهاء</li>
                    <li>حماية براءات الاختراع إن وجدت</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg">المسؤولية والضمان</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>ضمان ضد العيوب الفنية لمدة 12 شهر</li>
                    <li>دعم فني مجاني لمدة 6 أشهر</li>
                    <li>تحديثات أمنية ضرورية مجانية</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              جاهز للبدء؟
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              تواصل معنا اليوم لبدء رحلة التعاقد وتحويل أفكارك إلى واقع
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Mail className="w-5 h-5 mr-2" />
                أرسل استفسارك
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Users className="w-5 h-5 mr-2" />
                احجز اجتماع
              </Button>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-blue-300 mb-2" />
                <p className="text-blue-100">هاتف</p>
                <p className="text-white font-semibold">0555812567</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-blue-300 mb-2" />
                <p className="text-blue-100">بريد إلكتروني</p>
                <p className="text-white font-semibold">info@ash.holdings</p>
              </div>
              <div className="flex flex-col items-center">
                <MessageSquare className="w-8 h-8 text-blue-300 mb-2" />
                <p className="text-blue-100">واتساب</p>
                <p className="text-white font-semibold">0555812567</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contracts;