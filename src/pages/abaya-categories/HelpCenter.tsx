import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AbayaHeader from "@/components/abaya-store/AbayaHeader";
import AbayaFooter from "@/components/abaya-store/AbayaFooter";
import { 
  Headphones, 
  MessageCircle, 
  Phone, 
  Mail,
  Clock,
  Search,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  Crown,
  Heart,
  Sparkles
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "جميع الأسئلة", icon: HelpCircle },
    { id: "orders", label: "الطلبات", icon: Package },
    { id: "payment", label: "الدفع", icon: CreditCard },
    { id: "shipping", label: "الشحن", icon: Truck },
    { id: "returns", label: "الإرجاع", icon: RotateCcw },
    { id: "account", label: "الحساب", icon: Shield }
  ];

  const faqs = [
    {
      category: "orders",
      question: "كيف يمكنني تتبع طلبي؟",
      answer: "يمكنك تتبع طلبك من خلال رقم التتبع الذي سيرسل إليك عبر الواتساب والإيميل بعد شحن الطلب. كما يمكنك التواصل معنا مباشرة للاستفسار عن حالة طلبك."
    },
    {
      category: "orders",
      question: "كم يستغرق تجهيز الطلب؟",
      answer: "نحتاج إلى 1-2 يوم عمل لتجهيز طلبك قبل الشحن. العبايات المخصصة قد تحتاج إلى 3-5 أيام عمل إضافية."
    },
    {
      category: "payment",
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل الدفع عبر فيزا، مايسترو، مدى، آبل باي، والدفع عند الاستلام في مناطق مختارة. كما نوفر خيارات التقسيط مع تابي وتمارا."
    },
    {
      category: "payment",
      question: "هل الدفع آمن؟",
      answer: "نعم، جميع المعاملات محمية بأعلى معايير الأمان والتشفير. نستخدم بوابات دفع معتمدة ولا نحتفظ بمعلومات بطاقتك الائتمانية."
    },
    {
      category: "shipping",
      question: "ما هي مناطق التوصيل؟",
      answer: "نوصل لجميع مناطق المملكة العربية السعودية. التوصيل مجاني للطلبات أكثر من 200 ريال، ونوفر خدمة التوصيل السريع والتوصيل في نفس اليوم لمناطق مختارة."
    },
    {
      category: "shipping",
      question: "كم تكلفة الشحن؟",
      answer: "التوصيل العادي: 25 ريال (مجاني للطلبات +200 ريال) - التوصيل السريع: 50 ريال - التوصيل الملكي: 100 ريال"
    },
    {
      category: "returns",
      question: "ما هي شروط الإرجاع؟",
      answer: "يمكنك إرجاع أي منتج خلال 7 أيام من الاستلام، بشرط أن يكون في حالته الأصلية مع العلامات. نتحمل تكلفة الاستلام من منزلك مجاناً."
    },
    {
      category: "returns",
      question: "كم يستغرق الاسترداد؟",
      answer: "بعد استلام المنتج وفحصه (1-2 يوم عمل)، يتم الاسترداد خلال 3-7 أيام عمل حسب طريقة الدفع الأصلية."
    },
    {
      category: "account",
      question: "كيف أنشئ حساب جديد؟",
      answer: "يمكنك التسوق بدون إنشاء حساب، أو إنشاء حساب جديد بكل سهولة باستخدام رقم هاتفك أو بريدك الإلكتروني لمتابعة طلباتك والحصول على عروض حصرية."
    },
    {
      category: "account",
      question: "كيف أغير معلومات حسابي؟",
      answer: "يمكنك تحديث معلوماتك الشخصية وعنوان التوصيل من خلال التواصل معنا عبر الواتساب وسنقوم بتحديث المعلومات فوراً."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "واتساب",
      description: "تواصل فوري مع فريق الدعم",
      contact: "966500000000+",
      link: "https://wa.me/966500000000",
      color: "from-green-500 to-emerald-600",
      available: "24/7"
    },
    {
      icon: Phone,
      title: "اتصال مباشر",
      description: "تحدث مع أحد ممثلي خدمة العملاء",
      contact: "966500000000+",
      link: "tel:+966500000000",
      color: "from-blue-500 to-cyan-600",
      available: "9 ص - 10 م"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      description: "راسلنا وسنرد خلال 24 ساعة",
      contact: "support@abayati.com",
      link: "mailto:support@abayati.com",
      color: "from-purple-500 to-pink-600",
      available: "استجابة سريعة"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-purple-200/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-pink-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-300/40 rounded-full animate-ping"></div>
      </div>

      <AbayaHeader />
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              مركز المساعدة
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            نحن هنا لمساعدتك! ابحث عن إجابات سريعة أو تواصل معنا مباشرة
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-12 border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="ابحث عن إجابة لسؤالك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportChannels.map((channel, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${channel.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <channel.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{channel.title}</h3>
                <p className="text-gray-600 mb-3">{channel.description}</p>
                <Badge className="mb-4 bg-gray-100 text-gray-700">
                  <Clock className="w-4 h-4 ml-1" />
                  {channel.available}
                </Badge>
                <p className="text-sm font-medium text-gray-700 mb-4">{channel.contact}</p>
                <Button asChild className="w-full">
                  <a href={channel.link} target="_blank" rel="noopener noreferrer">
                    تواصل الآن
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Categories */}
        <Card className="mb-8 border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center gap-3">
              <HelpCircle className="w-6 h-6" />
              الأسئلة الشائعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Accordion */}
        <Card className="mb-16 border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline">
                    <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">لم نجد أي نتائج تطابق بحثك. جرب كلمات مفتاحية أخرى أو تواصل معنا مباشرة.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="mb-16 border-0 bg-gradient-to-br from-white to-purple-50/50">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-purple-600 flex items-center justify-center gap-3">
              <MessageCircle className="w-6 h-6" />
              لم تجد إجابة لسؤالك؟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                  <Input placeholder="اسمك الكريم" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <Input type="email" placeholder="example@email.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموضوع</label>
                <Input placeholder="موضوع استفسارك" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
                <Textarea 
                  placeholder="اكتب رسالتك هنا..."
                  rows={5}
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <MessageCircle className="w-5 h-5 ml-2" />
                إرسال الرسالة
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-0 bg-gradient-to-br from-rose-600 to-pink-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
              <Crown className="w-6 h-6" />
              روابط مفيدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a 
                href="/abayati-store/shipping-delivery"
                className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <Truck className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">الشحن والتوصيل</p>
              </a>
              
              <a 
                href="/abayati-store/return-procedures"
                className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <RotateCcw className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">إجراءات الإرجاع</p>
              </a>
              
              <a 
                href="/abayati-store/return-policy"
                className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">سياسة الإرجاع</p>
              </a>
              
              <a 
                href="https://wa.me/966500000000"
                className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">تواصل سريع</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AbayaFooter />
    </div>
  );
};

export default HelpCenter;