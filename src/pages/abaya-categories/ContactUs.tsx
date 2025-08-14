import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, MapPin, Clock, Mail, ArrowLeft, Heart, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const handleWhatsAppContact = () => {
    const message = `🌟 السلام عليكم ورحمة الله وبركاته

👗 أرغب في التواصل مع فريق متجر عبايتي
💬 لدي استفسار عن المنتجات والخدمات

شكراً لكم 🌸`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'الهاتف والواتساب',
      description: 'تواصلي معنا مباشرة عبر الهاتف أو الواتساب',
      value: '+966 50 000 0000',
      action: 'اتصلي الآن',
      color: 'from-green-600 to-green-700'
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      description: 'راسلينا عبر البريد الإلكتروني للاستفسارات المفصلة',
      value: 'info@kashkha.com',
      action: 'أرسلي رسالة',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: MapPin,
      title: 'موقعنا',
      description: 'زوري معرضنا في الرياض لمشاهدة المجموعات عن قرب',
      value: 'الرياض، المملكة العربية السعودية',
      action: 'اطلبي الموقع',
      color: 'from-purple-600 to-purple-700'
    }
  ];

  const workingHours = [
    { day: 'الأحد - الخميس', hours: '9:00 صباحاً - 10:00 مساءً' },
    { day: 'الجمعة - السبت', hours: '2:00 ظهراً - 11:00 مساءً' }
  ];

  const services = [
    {
      icon: Crown,
      title: 'استشارة شخصية',
      description: 'احصلي على استشارة مخصصة لاختيار العباءة المناسبة لك'
    },
    {
      icon: Heart,
      title: 'تصميم حسب الطلب',
      description: 'اطلبي تصميماً خاصاً يناسب ذوقك وشخصيتك'
    },
    {
      icon: Star,
      title: 'خدمة ما بعد البيع',
      description: 'نوفر خدمة متابعة وضمان جودة لجميع منتجاتنا'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-50" dir="rtl">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-rose-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <Link to="/abayati-store" className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-rose-200 to-purple-200 bg-clip-text text-transparent">
              تواصلي معنا
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              نحن هنا لمساعدتك وخدمتك في أي وقت. تواصلي معنا بالطريقة التي تناسبك
            </p>
          </div>
        </div>
      </header>

      {/* Quick Contact */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">تواصل سريع عبر الواتساب</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            للحصول على رد فوري ومساعدة مباشرة، تواصلي معنا عبر الواتساب
          </p>
          <Button 
            onClick={handleWhatsAppContact}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <MessageSquare className="w-6 h-6 ml-2" />
            ابدئي المحادثة الآن
          </Button>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">طرق التواصل</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اختاري الطريقة الأنسب لك للتواصل معنا. فريقنا جاهز لخدمتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="group relative overflow-hidden bg-white rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${method.color} rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{method.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{method.description}</p>
                  <p className="text-lg font-semibold text-purple-600 mb-6">{method.value}</p>
                  <Button 
                    onClick={handleWhatsAppContact}
                    className={`w-full bg-gradient-to-r ${method.color} hover:scale-105 text-white py-3 rounded-xl transition-all duration-300`}
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Working Hours */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-gray-800">أوقات العمل</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                نحن متاحون لخدمتك خلال ساعات العمل التالية. يمكنك التواصل معنا في أي وقت عبر الواتساب للحصول على رد سريع.
              </p>
              
              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <Card key={index} className="border border-purple-200 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Clock className="w-6 h-6 text-purple-600" />
                        <span className="text-lg font-semibold text-gray-800">{schedule.day}</span>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2">
                        {schedule.hours}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">الواتساب متاح 24/7</h3>
                </div>
                <p className="text-green-700">
                  يمكنك إرسال رسالة عبر الواتساب في أي وقت وسنرد عليك في أقرب وقت ممكن
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-rose-100 rounded-3xl p-8 h-96">
                <div className="text-center h-full flex flex-col justify-center">
                  <Clock className="w-24 h-24 text-purple-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">نحن هنا من أجلك</h3>
                  <p className="text-gray-600 text-lg">
                    فريق خدمة العملاء جاهز لمساعدتك وتقديم أفضل الخدمات
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-rose-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">خدماتنا المميزة</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              نقدم مجموعة من الخدمات المتخصصة لضمان حصولك على أفضل تجربة تسوق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <service.icon className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-purple-100 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">الأسئلة الشائعة</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              إجابات على أكثر الأسئلة التي تردنا من عملائنا الكرام
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border border-purple-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">كم يستغرق تنفيذ الطلب؟</h3>
                <p className="text-gray-600">
                  عادة ما يستغرق تنفيذ الطلب من 3-7 أيام عمل حسب نوع العباءة والتخصيصات المطلوبة. سنوافيك بتفاصيل دقيقة عند التأكيد.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-purple-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">هل يمكن تعديل المقاسات؟</h3>
                <p className="text-gray-600">
                  نعم، نوفر خدمة تعديل المقاسات مجاناً. كما يمكننا تفصيل عباءة حسب مقاساتك الخاصة.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-purple-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">ما هي طرق الدفع المتاحة؟</h3>
                <p className="text-gray-600">
                  نقبل الدفع نقداً عند التسليم، التحويل البنكي، بطاقات الائتمان، والدفع عبر تطبيقات المحافظ الرقمية.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-purple-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">هل تتوفر خدمة التوصيل؟</h3>
                <p className="text-gray-600">
                  نعم، نوفر خدمة التوصيل المجاني داخل الرياض وبرسوم رمزية لباقي مناطق المملكة.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">ما زلت تحتاجين مساعدة؟</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            فريق خدمة العملاء جاهز للإجابة على جميع استفساراتك ومساعدتك في اختيار العباءة المثالية
          </p>
          <Button 
            onClick={handleWhatsAppContact}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <Phone className="w-6 h-6 ml-2" />
            تواصلي معنا الآن
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;