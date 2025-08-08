import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CarRentalFooter from "@/components/CarRentalFooter";
import BackButton from "@/components/ui/back-button";
import { 
  HelpCircle, 
  Search, 
  Car, 
  CreditCard, 
  Shield, 
  Clock,
  Users,
  MapPin,
  Phone,
  FileText
} from "lucide-react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "جميع الأسئلة", icon: HelpCircle, color: "bg-blue-500" },
    { id: "booking", name: "الحجز", icon: Car, color: "bg-green-500" },
    { id: "payment", name: "الدفع", icon: CreditCard, color: "bg-purple-500" },
    { id: "insurance", name: "التأمين", icon: Shield, color: "bg-orange-500" },
    { id: "policies", name: "السياسات", icon: FileText, color: "bg-red-500" }
  ];

  const faqs = [
    {
      id: 1,
      category: "booking",
      question: "كيف يمكنني حجز سيارة؟",
      answer: "يمكنك حجز السيارة بطرق متعددة: عبر الموقع الإلكتروني، التطبيق الذكي، أو بالاتصال على الرقم +966 11 123 4567. كل ما تحتاجه هو رخصة قيادة سارية وبطاقة ائتمانية.",
      popular: true
    },
    {
      id: 2,
      category: "booking",
      question: "ما هي المتطلبات اللازمة لاستئجار سيارة؟",
      answer: "المتطلبات الأساسية هي: عمر 21 سنة فأكثر، رخصة قيادة سارية المفعول، بطاقة هوية (سعودي/مقيم/زائر)، وبطاقة ائتمانية للضمان. للزوار الأجانب، رخصة قيادة دولية مطلوبة.",
      popular: true
    },
    {
      id: 3,
      category: "booking",
      question: "هل يمكنني تعديل أو إلغاء الحجز؟",
      answer: "نعم، يمكنك تعديل أو إلغاء حجزك مجاناً حتى 24 ساعة قبل موعد الاستلام. بعد ذلك قد تطبق رسوم إلغاء حسب نوع التعريفة المختارة.",
      popular: false
    },
    {
      id: 4,
      category: "payment",
      question: "ما هي طرق الدفع المقبولة؟",
      answer: "نقبل جميع البطاقات الائتمانية الرئيسية (فيزا، ماستركارد، أمريكان إكسبرس)، مدى، والدفع النقدي في بعض الفروع. كما نوفر خيارات الدفع الآجل مع تابي وتمارا.",
      popular: true
    },
    {
      id: 5,
      category: "payment",
      question: "متى يتم خصم المبلغ من بطاقتي؟",
      answer: "يتم حجز مبلغ الضمان عند الحجز، ويتم خصم تكلفة الإيجار عند استلام السيارة. المبلغ المحجوز كضمان يتم إرجاعه خلال 3-7 أيام عمل بعد إرجاع السيارة بحالة جيدة.",
      popular: false
    },
    {
      id: 6,
      category: "insurance",
      question: "هل السيارات مؤمنة؟",
      answer: "نعم، جميع سياراتنا مؤمنة بشكل شامل ضد الحوادث والأضرار. التأمين يشمل المسؤولية المدنية والأضرار الخارجية. يمكنك أيضاً إضافة تأمين إضافي لتغطية أشمل.",
      popular: true
    },
    {
      id: 7,
      category: "insurance",
      question: "ما هو مبلغ التحمل في حالة الحادث؟",
      answer: "مبلغ التحمل يختلف حسب فئة السيارة وعادة يتراوح بين 1000-3000 ريال. يمكنك تقليل أو إلغاء مبلغ التحمل بإضافة التأمين الشامل عند الحجز.",
      popular: false
    },
    {
      id: 8,
      category: "policies",
      question: "ما هي سياسة الوقود؟",
      answer: "نتبع سياسة 'ممتلئ إلى ممتلئ' - تستلم السيارة بخزان وقود ممتلئ وتعيدها بنفس المستوى. إذا أعدت السيارة بوقود أقل، سيتم خصم تكلفة الوقود مع رسوم خدمة.",
      popular: true
    },
    {
      id: 9,
      category: "policies",
      question: "هل يمكنني قيادة السيارة خارج المملكة؟",
      answer: "قيادة السيارة خارج المملكة تتطلب موافقة مسبقة وتأمين إضافي. يُسمح بالسفر لدول الخليج فقط بعد الحصول على الأوراق اللازمة والموافقة الخطية.",
      popular: false
    },
    {
      id: 10,
      category: "booking",
      question: "هل يمكنني إضافة سائق إضافي؟",
      answer: "نعم، يمكنك إضافة سائقين إضافيين مقابل رسوم يومية. السائق الإضافي يجب أن يكون عمره 21 سنة فأكثر ولديه رخصة قيادة سارية، ويجب أن يكون حاضراً عند استلام السيارة.",
      popular: false
    },
    {
      id: 11,
      category: "policies",
      question: "ماذا يحدث إذا تأخرت في إرجاع السيارة؟",
      answer: "في حالة التأخير، نطبق فترة سماح 59 دقيقة مجاناً. بعد ذلك يتم احتساب رسوم إضافية بناءً على السعر اليومي. التأخير أكثر من 24 ساعة يعتبر يوم إضافي كامل.",
      popular: false
    },
    {
      id: 12,
      category: "booking",
      question: "هل تتوفر سيارات مجهزة للأشخاص ذوي الاحتياجات الخاصة؟",
      answer: "نعم، لدينا سيارات مجهزة خصيصاً لذوي الاحتياجات الخاصة في فروعنا الرئيسية. يرجى التواصل معنا مسبقاً لضمان التوفر وإعداد السيارة المناسبة لاحتياجاتك.",
      popular: false
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const categoryMatch = selectedCategory === "all" || faq.category === selectedCategory;
    const searchMatch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const popularFAQs = faqs.filter(faq => faq.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BackButton />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white border-0 mb-6 text-lg px-4 py-2 animate-fade-in">
              <HelpCircle className="w-4 h-4 ml-1" />
              الأسئلة الشائعة
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              كيف يمكننا مساعدتك؟
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in">
              ابحث عن إجابات لأسئلتك الشائعة حول خدمات تأجير السيارات
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="relative">
                <Search className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="ابحث في الأسئلة الشائعة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/90 border-0 h-14 pr-12 text-slate-900 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center group hover:shadow-lg transition-all animate-fade-in">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{faqs.length}</div>
                <div className="text-sm text-slate-600">سؤال وجواب</div>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all animate-fade-in">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">24/7</div>
                <div className="text-sm text-slate-600">خدمة العملاء</div>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all animate-fade-in">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">&lt; 5 دقائق</div>
                <div className="text-sm text-slate-600">وقت الاستجابة</div>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all animate-fade-in">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">98%</div>
                <div className="text-sm text-slate-600">نسبة الرضا</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 animate-fade-in">
              الأسئلة الأكثر شيوعاً
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-fade-in">
              الأسئلة التي يسألها عملاؤنا بشكل متكرر مع إجابات شاملة
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {popularFAQs.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`popular-${faq.id}`}
                  className="animate-fade-in border border-slate-200 rounded-lg px-6 data-[state=open]:shadow-lg transition-all"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AccordionTrigger className="text-right hover:no-underline py-6">
                    <div className="flex items-center gap-4 w-full">
                      <Badge className="bg-orange-100 text-orange-800 px-2 py-1">
                        شائع
                      </Badge>
                      <span className="text-lg font-semibold flex-1 text-right">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-lg">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 animate-fade-in">
              تصفح حسب الفئة
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all animate-fade-in ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center ${
                    selectedCategory === category.id ? 'bg-white/20' : ''
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      selectedCategory === category.id ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id.toString()}
                  className="animate-fade-in border border-slate-200 rounded-lg px-6 data-[state=open]:shadow-lg transition-all"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <AccordionTrigger className="text-right hover:no-underline py-6">
                    <span className="text-lg font-semibold text-slate-900">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-lg">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                لم نجد أسئلة مطابقة
              </h3>
              <p className="text-slate-600">
                جرب تعديل كلمات البحث أو اختيار فئة مختلفة
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            لم تجد إجابة لسؤالك؟
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            فريق خدمة العملاء جاهز لمساعدتك على مدار الساعة
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
            >
              <MapPin className="w-6 h-6 ml-2" />
              زيارة الفرع
            </Button>
          </div>
        </div>
      </section>
      
      <CarRentalFooter />
    </div>
  );
};

export default FAQ;