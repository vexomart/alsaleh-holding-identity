import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Globe,
  Users,
  Car,
  Headphones
} from "lucide-react";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const contactMethods = [
    {
      icon: Phone,
      title: "اتصل بنا",
      info: "+966 11 123 4567",
      description: "متاح 24/7 لخدمتك",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: "راسلنا",
      info: "info@carrentpro.sa",
      description: "نرد خلال ساعة واحدة",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MessageCircle,
      title: "الدردشة المباشرة",
      info: "متاح الآن",
      description: "تحدث مع فريق الدعم فوراً",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MapPin,
      title: "زيارة الفرع",
      info: "الرياض، حي العليا",
      description: "طريق الملك فهد",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const offices = [
    {
      city: "الرياض",
      address: "طريق الملك فهد، حي العليا، مبنى 123",
      phone: "+966 11 123 4567",
      email: "riyadh@carrentpro.sa",
      hours: "السبت - الخميس: 8:00 ص - 10:00 م | الجمعة: 2:00 م - 10:00 م",
      isMain: true
    },
    {
      city: "جدة",
      address: "كورنيش جدة، حي الشاطئ، مجمع 456",
      phone: "+966 12 234 5678",
      email: "jeddah@carrentpro.sa",
      hours: "السبت - الخميس: 8:00 ص - 10:00 م | الجمعة: 2:00 م - 10:00 م",
      isMain: false
    },
    {
      city: "الدمام",
      address: "الواجهة البحرية، الدمام، برج 789",
      phone: "+966 13 345 6789",
      email: "dammam@carrentpro.sa",
      hours: "السبت - الخميس: 8:00 ص - 10:00 م | الجمعة: 2:00 م - 10:00 م",
      isMain: false
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إرسال الرسالة",
      description: "شكراً لك! سنتواصل معك قريباً.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BackButton />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white border-0 mb-6 text-lg px-4 py-2 animate-fade-in">
              <MessageCircle className="w-4 h-4 ml-1" />
              تواصل معنا
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              نحن هنا لمساعدتك
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in">
              فريق الدعم جاهز لخدمتك على مدار الساعة
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 animate-fade-in">
              طرق التواصل
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-fade-in">
              اختر الطريقة الأنسب لك للتواصل مع فريق خدمة العملاء
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {method.title}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-1">
                      {method.info}
                    </p>
                    <p className="text-sm text-slate-600">
                      {method.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">أرسل لنا رسالة</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">الاسم الكامل *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">رقم الجوال</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">الموضوع</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="موضوع الرسالة"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">الرسالة *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all"
                      size="lg"
                    >
                      <Send className="w-4 h-4 ml-2" />
                      إرسال الرسالة
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Office Locations */}
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-3xl font-bold text-slate-900 mb-8">مواقع فروعنا</h3>
              
              {offices.map((office, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg transition-all hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-xl font-bold text-slate-900">{office.city}</h4>
                          {office.isMain && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              الفرع الرئيسي
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-600 mb-3">{office.address}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span className="text-slate-700">{office.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="text-slate-700">{office.email}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-purple-500 mt-0.5" />
                            <span className="text-slate-700">{office.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
              نحن في خدمتك دائماً
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80 text-sm">خدمة العملاء</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">&lt; 5 دقائق</div>
              <div className="text-white/80 text-sm">متوسط الاستجابة</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80 text-sm">نسبة الرضا</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80 text-sm">مدينة نخدمها</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;