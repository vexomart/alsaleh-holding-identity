import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import Footer from "@/components/Footer";
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Star,
  Users,
  Calendar,
  Globe,
  Headphones,
  Target,
  Heart,
  Zap,
  Award
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      title: 'الاتصال المباشر',
      description: 'تحدث مع فريق خدمة العملاء',
      icon: Phone,
      value: '0555812567',
      action: 'اتصل الآن',
      color: 'from-green-500 to-emerald-500',
      available: '24/7'
    },
    {
      title: 'البريد الإلكتروني',
      description: 'راسلنا واحصل على رد سريع',
      icon: Mail,
      value: 'info@alialshehriholding.com',
      action: 'أرسل إيميل',
      color: 'from-blue-500 to-cyan-500',
      available: 'رد خلال 2-4 ساعات'
    },
    {
      title: 'الدردشة المباشرة',
      description: 'تحدث معنا فورياً',
      icon: MessageCircle,
      value: 'دردشة مباشرة',
      action: 'ابدأ المحادثة',
      color: 'from-purple-500 to-indigo-500',
      available: 'متاح الآن'
    },
    {
      title: 'زيارة المكتب',
      description: 'تفضل بزيارتنا شخصياً',
      icon: MapPin,
      value: 'الرياض، حي الملز',
      action: 'عرض الخريطة',
      color: 'from-orange-500 to-red-500',
      available: 'الأحد - الخميس'
    }
  ];

  const serviceTypes = [
    'حجز سيارة جديد',
    'استفسار عن حجز موجود',
    'مشكلة تقنية',
    'شكوى أو اقتراح',
    'طلب عرض سعر للشركات',
    'استفسار عام'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        serviceType: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental-landing" />
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  تواصل معنا
                </h1>
                <p className="text-lg text-muted-foreground">
                  نحن هنا لمساعدتك في أي وقت وبكفاءة عالية
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'زمن الاستجابة', value: '< 30 ثانية', icon: Clock, color: 'text-blue-500' },
                { label: 'رضا العملاء', value: '98%', icon: Heart, color: 'text-green-500' },
                { label: 'متاح', value: '24/7', icon: Globe, color: 'text-orange-500' },
                { label: 'فريق الدعم', value: '50+ خبير', icon: Users, color: 'text-purple-500' }
              ].map((stat, index) => (
                <Card key={index} className="text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Contact Methods */}
          <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-8">طرق التواصل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${method.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <p className="font-medium text-blue-600 mb-2">{method.value}</p>
                    <Badge variant="outline" className="text-xs mb-4">
                      {method.available}
                    </Badge>
                    <Button variant="outline" size="sm" className="w-full">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  أرسل رسالة
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">تم إرسال رسالتك بنجاح!</h3>
                    <p className="text-muted-foreground">
                      سنتواصل معك خلال 24 ساعة
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          required
                          className="bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="05xxxxxxxx"
                          required
                          className="bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">نوع الخدمة</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر نوع الخدمة</option>
                        {serviceTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">الموضوع *</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="موضوع الرسالة"
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">الرسالة *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="اكتب رسالتك هنا..."
                        rows={5}
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري الإرسال...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          إرسال الرسالة
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Office Info */}
            <div className="space-y-6 animate-fade-in">
              {/* Location */}
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    موقعنا
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                      <h4 className="font-bold mb-2">المكتب الرئيسي</h4>
                      <p className="text-muted-foreground mb-2">
                        الرياض، حي الملز<br />
                        شارع الأمير محمد بن عبدالعزيز<br />
                        مجمع الأعمال التجاري، الطابق الثالث
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        عرض على الخريطة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                <CardContent className="p-6 text-center">
                  <Phone className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">خط الطوارئ</h3>
                  <p className="mb-4 opacity-90">
                    للحالات الطارئة على مدار الساعة
                  </p>
                  <Button variant="secondary" size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                    0555812567
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;