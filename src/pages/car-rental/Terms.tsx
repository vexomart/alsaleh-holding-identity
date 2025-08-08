import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CarRentalFooter from "@/components/CarRentalFooter";
import BackButton from "@/components/ui/back-button";
import { 
  FileText, 
  Shield, 
  CreditCard, 
  Car, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone
} from "lucide-react";

const Terms = () => {
  const termsCategories = [
    {
      icon: Car,
      title: "شروط الاستئجار",
      color: "bg-blue-500"
    },
    {
      icon: CreditCard,
      title: "الدفع والأسعار",
      color: "bg-green-500"
    },
    {
      icon: Shield,
      title: "التأمين والمسؤولية",
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "مدة الإيجار",
      color: "bg-orange-500"
    }
  ];

  const termsData = [
    {
      category: "شروط الاستئجار",
      items: [
        "يجب أن يكون عمر المستأجر 21 سنة على الأقل",
        "وجود رخصة قيادة سارية المفعول (سعودية أو دولية)",
        "تقديم بطاقة هوية سارية (هوية وطنية/إقامة/جواز سفر)",
        "وجود بطاقة ائتمانية باسم المستأجر للضمان",
        "تعبئة نموذج العقد وتوقيعه قبل استلام السيارة",
        "فحص السيارة قبل الاستلام والتأكد من حالتها"
      ]
    },
    {
      category: "الدفع والأسعار",
      items: [
        "يتم احتساب الأجرة على أساس يومي (24 ساعة)",
        "التأخير أكثر من 59 دقيقة يحتسب يوم إضافي",
        "دفع مقدم أو ضمان بقيمة لا تقل عن 1000 ريال",
        "الأسعار تشمل التأمين الإلزامي فقط",
        "الضريبة المضافة 15% مطبقة على جميع الخدمات",
        "رسوم إضافية للخدمات الاختيارية (GPS، مقعد أطفال، إلخ)"
      ]
    },
    {
      category: "التأمين والمسؤولية",
      items: [
        "جميع السيارات مؤمنة تأميناً إجبارياً ضد الغير",
        "مبلغ التحمل يتراوح بين 1000-3000 ريال حسب فئة السيارة",
        "التأمين الشامل متاح مقابل رسوم إضافية",
        "المستأجر مسؤول عن أي ضرر يحدث أثناء فترة الإيجار",
        "الإبلاغ عن أي حادث فوراً خلال 24 ساعة",
        "عدم تغطية الأضرار الناتجة عن الاستخدام الخاطئ"
      ]
    },
    {
      category: "مدة الإيجار",
      items: [
        "الحد الأدنى للإيجار 24 ساعة",
        "إمكانية التمديد بموافقة مسبقة وحسب التوفر",
        "الإرجاع المبكر لا يستحق رد مبالغ",
        "التأخير في الإرجاع يستوجب رسوماً إضافية",
        "إلغاء الحجز مجاناً حتى 24 ساعة قبل الاستلام",
        "رسوم إلغاء 50% للإلغاء خلال 24 ساعة"
      ]
    },
    {
      category: "استخدام السيارة",
      items: [
        "استخدام السيارة للأغراض القانونية فقط",
        "منع قيادة السيارة تحت تأثير الكحول أو المخدرات",
        "عدم السماح لغير المستأجر بقيادة السيارة إلا بموافقة",
        "منع نقل المواد الخطرة أو المحظورة",
        "الالتزام بقوانين المرور المحلية",
        "عدم تجاوز الحد الأقصى لعدد الركاب"
      ]
    },
    {
      category: "الوقود والصيانة",
      items: [
        "استلام السيارة بخزان وقود ممتلئ",
        "إرجاع السيارة بنفس مستوى الوقود",
        "رسوم إضافية للوقود الناقص (3 ريال/لتر + رسوم خدمة)",
        "صيانة السيارة على حساب الشركة للأعطال الطبيعية",
        "المستأجر مسؤول عن تكلفة الصيانة بسبب سوء الاستخدام",
        "فحص مستوى الزيت والماء دورياً"
      ]
    },
    {
      category: "مخالفات وغرامات",
      items: [
        "المستأجر مسؤول عن جميع المخالفات أثناء فترة الإيجار",
        "سداد المخالفات خلال 30 يوم من تاريخ الإشعار",
        "رسوم إدارية 50 ريال على كل مخالفة",
        "خصم مبالغ المخالفات من الضمان إذا لم تسدد",
        "إشعار المستأجر بالمخالفات عبر الهاتف أو البريد",
        "إمكانية الاعتراض على المخالفات حسب الأنظمة"
      ]
    },
    {
      category: "فسخ العقد",
      items: [
        "حق الشركة في فسخ العقد عند مخالفة الشروط",
        "استرداد السيارة فوراً في حالة الاستخدام المخالف",
        "عدم رد المبالغ المدفوعة في حالة الفسخ",
        "تحمل المستأجر لتكاليف استرداد السيارة",
        "الحق في اتخاذ الإجراءات القانونية عند الضرورة",
        "إنهاء العقد بموافقة الطرفين"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BackButton />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white border-0 mb-6 text-lg px-4 py-2 animate-fade-in">
              <FileText className="w-4 h-4 ml-1" />
              الشروط والأحكام
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              شروط وأحكام الإيجار
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in">
              اقرأ الشروط والأحكام بعناية قبل استئجار السيارة
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="border-orange-200 bg-orange-50 mb-12 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-2">تنبيه مهم</h3>
                  <p className="text-orange-700 leading-relaxed">
                    بتوقيعك على عقد الإيجار، فإنك توافق على جميع الشروط والأحكام المذكورة أدناه. 
                    يرجى قراءة جميع البنود بعناية. في حالة عدم فهم أي بند، يُرجى التواصل مع فريق خدمة العملاء قبل التوقيع.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 animate-fade-in">
              أقسام الشروط والأحكام
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-fade-in">
              تغطي شروطنا وأحكامنا جميع جوانب تأجير السيارات لضمان تجربة آمنة ومريحة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {termsCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {category.title}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {termsData.map((section, sectionIndex) => (
              <Card 
                key={sectionIndex} 
                className="group hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${sectionIndex * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{sectionIndex + 1}</span>
                    </div>
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {section.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                إشعار قانوني
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                <strong>تاريخ آخر تحديث:</strong> 1 يناير 2024
              </p>
              <p>
                هذه الشروط والأحكام خاضعة لقوانين المملكة العربية السعودية. أي نزاع ينشأ عن هذا العقد 
                يخضع لاختصاص المحاكم السعودية.
              </p>
              <p>
                تحتفظ شركة كار رنت برو بحق تعديل هذه الشروط والأحكام في أي وقت. سيتم إشعار العملاء 
                بأي تغييرات مهمة عبر الموقع الإلكتروني أو البريد الإلكتروني.
              </p>
              <p>
                للاستفسارات حول الشروط والأحكام، يرجى التواصل مع فريق خدمة العملاء على الرقم 
                <strong> 0555812567</strong> أو عبر البريد الإلكتروني 
                <strong> info@alialshehriholding.com</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            لديك استفسار حول الشروط؟
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            فريق خدمة العملاء جاهز لتوضيح أي بند في الشروط والأحكام
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all text-lg px-8 py-6 shadow-2xl"
              asChild
            >
              <a href="/car-rental/contact">
                <Phone className="w-6 h-6 ml-2" />
                تواصل معنا
              </a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all text-lg px-8 py-6 backdrop-blur-sm"
              asChild
            >
              <a href="/car-rental/faq">
                <FileText className="w-6 h-6 ml-2" />
                الأسئلة الشائعة
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <CarRentalFooter />
    </div>
  );
};

export default Terms;