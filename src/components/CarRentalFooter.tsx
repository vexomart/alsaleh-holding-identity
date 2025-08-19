import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Shield,
  CreditCard,
  Smartphone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  CheckCircle,
  Calendar,
  Users,
  Globe,
  Award
} from "lucide-react";

const CarRentalFooter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const quickLinks = [
    { name: 'الرئيسية', href: '/car-rental-landing' },
    { name: 'أسطول السيارات', href: '/car-fleet' },
    { name: 'احجز الآن', href: '/car-booking' },
    { name: 'العروض الحالية', href: '/car-rental/offers' },
    { name: 'من نحن', href: '/car-rental/about' },
    { name: 'تواصل معنا', href: '/car-rental/contact' }
  ];

  const services = [
    { name: 'تأجير يومي', href: '/car-rental/services#daily' },
    { name: 'تأجير شهري', href: '/car-rental/services#monthly' },
    { name: 'سيارات فاخرة', href: '/car-rental/sub-services#luxury' },
    { name: 'سيارات اقتصادية', href: '/car-rental/sub-services#economy' },
    { name: 'خدمة التوصيل', href: '/car-rental/services#delivery' },
    { name: 'سائق خاص', href: '/car-rental/services#driver' }
  ];

  const supportLinks = [
    { name: 'دليل العميل', href: '/car-rental/guide' },
    { name: 'الأسئلة الشائعة', href: '/car-rental/faq' },
    { name: 'سياسة التأمين', href: '/car-rental/insurance' },
    { name: 'الشروط والأحكام', href: '/car-rental/terms' },
    { name: 'سياسة الخصوصية', href: '/car-rental/privacy' },
    { name: 'أخبار الشركة', href: '/car-rental/news' }
  ];

  const contactInfo = [
    { icon: Phone, text: '0555812567', link: 'tel:0555812567' },
    { icon: Mail, text: 'rental@alialshehriholding.com', link: 'mailto:rental@alialshehriholding.com' },
    { icon: MapPin, text: 'الرياض، حي الملز، شارع الأمير محمد بن عبدالعزيز' }
  ];

  const workingHours = [
    { day: 'الأحد - الخميس', hours: '8:00 ص - 10:00 م' },
    { day: 'الجمعة', hours: '2:00 م - 10:00 م' },
    { day: 'السبت', hours: '8:00 ص - 10:00 م' },
    { day: 'خدمة الطوارئ', hours: '24/7 متاح' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Youtube, href: '#', color: 'hover:text-red-600' }
  ];

  const achievements = [
    { icon: Car, text: '500+ سيارة', desc: 'أسطول متنوع' },
    { icon: Users, text: '10,000+ عميل', desc: 'عميل راضٍ' },
    { icon: Star, text: '4.9/5', desc: 'تقييم العملاء' },
    { icon: Award, text: '15+ جائزة', desc: 'جوائز التميز' }
  ];

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">كن أول من يعلم بعروضنا الخاصة</h3>
              <p className="text-blue-100">اشترك في النشرة الإخبارية للحصول على أفضل العروض والخصومات</p>
            </div>
            
            <div className="max-w-md mx-auto">
              {isSubscribed ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-300" />
                  <p className="text-lg font-medium">شكراً لك! تم الاشتراك بنجاح</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  />
                  <Button type="submit" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Send className="w-4 h-4 mr-2" />
                    اشترك
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-12">
          {/* Achievements Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <achievement.icon className="w-10 h-10 mx-auto mb-3 text-blue-400" />
                <div className="text-2xl font-bold text-white mb-1">{achievement.text}</div>
                <div className="text-sm text-gray-400">{achievement.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">تأجير السيارات</h3>
                  <p className="text-sm text-gray-400">ASH HOLDING</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                نوفر خدمات تأجير السيارات بأعلى معايير الجودة والأمان، مع أسطول حديث ومتنوع يلبي جميع احتياجاتك.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <contact.icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    {contact.link ? (
                      <a href={contact.link} className="text-gray-300 hover:text-white transition-colors">
                        {contact.text}
                      </a>
                    ) : (
                      <span className="text-gray-300">{contact.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">روابط سريعة</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">خدماتنا</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a 
                      href={service.href}
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></span>
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Working Hours */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">الدعم والمساعدة</h4>
              <ul className="space-y-3 mb-6">
                {supportLinks.slice(0, 4).map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Working Hours */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <h5 className="font-bold mb-3 text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    ساعات العمل
                  </h5>
                  <div className="space-y-2">
                    {workingHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-400">{schedule.day}</span>
                        <span className="text-white font-medium">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-12 p-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-center">
            <Phone className="w-8 h-8 mx-auto mb-2 text-white" />
            <h4 className="text-lg font-bold mb-2">خط الطوارئ - متاح 24/7</h4>
            <p className="text-red-100 mb-4">للمساعدة الفورية في حالات الطوارئ</p>
            <a href="tel:0555812567" className="inline-block bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors">
              0555812567
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">
                  © 2024 ASH HOLDING - خدمات تأجير السيارات. جميع الحقوق محفوظة.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  مرخص من وزارة النقل والخدمات اللوجستية - المملكة العربية السعودية
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">تابعنا على:</span>
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              {/* Security Badges */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">SSL آمن</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs">دفع آمن</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CarRentalFooter;