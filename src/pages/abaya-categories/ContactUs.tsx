import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, Send, 
  Instagram, Facebook, Twitter, Heart, Crown, Flower,
  CheckCircle
} from 'lucide-react';
import AbayaHeader from '@/components/abaya-store/AbayaHeader';
import AbayaFooter from '@/components/abaya-store/AbayaFooter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleWhatsAppContact = () => {
    const message = "👗 أرغب في التواصل مع فريق متجر عبايتي";
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          source: 'abaya-store-contact'
        }
      });

      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success('تم إرسال رسالتك بنجاح!');
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-50" dir="rtl">
      <AbayaHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MessageCircle className="w-12 h-12 text-yellow-300 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-100 bg-clip-text text-transparent">
                تواصلي معنا
              </h1>
              <MessageCircle className="w-12 h-12 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl leading-relaxed">
              نحن هنا لنساعدك في اختيار عباءة أحلامك وللإجابة على جميع استفساراتك
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Phone className="w-8 h-8 text-purple-500 animate-pulse" />
              <h2 className="text-4xl font-bold text-gray-800">طرق التواصل</h2>
              <Phone className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in">
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">الواتساب</h3>
                <p className="text-gray-600 mb-6">تواصلي معنا مباشرة عبر الواتساب للحصول على استشارة فورية</p>
                <Button 
                  onClick={handleWhatsAppContact}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصلي عبر الواتساب
                </Button>
                <p className="text-lg font-semibold mt-4 text-green-600">966500000000+</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">البريد الإلكتروني</h3>
                <p className="text-gray-600 mb-6">راسلينا عبر البريد الإلكتروني وسنجيبك في أقرب وقت</p>
                <p className="text-lg font-semibold text-blue-600">info@abayati.com</p>
                <p className="text-sm text-gray-500 mt-2">نجيب خلال 24 ساعة</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">عنواننا</h3>
                <p className="text-gray-600 mb-4">زورينا في متجرنا الرئيسي</p>
                <p className="text-lg font-semibold text-purple-600">الرياض</p>
                <p className="text-gray-600">المملكة العربية السعودية</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-white/70 border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Crown className="w-8 h-8 text-purple-500 animate-pulse" />
                    <h3 className="text-3xl font-bold text-gray-800">اتركي رسالة</h3>
                    <Crown className="w-8 h-8 text-rose-500 animate-pulse" />
                  </div>
                  <p className="text-gray-600">سنتواصل معك في أقرب وقت ممكن</p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">تم إرسال رسالتك بنجاح!</h3>
                    <p className="text-gray-600">سنتواصل معك قريباً</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">الاسم الكريم</label>
                        <Input 
                          name="name"
                          type="text" 
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="اكتبي اسمك هنا"
                          className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-colors"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">رقم الهاتف</label>
                        <Input 
                          name="phone"
                          type="tel" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="رقم هاتفك"
                          className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-colors"
                          required 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
                      <Input 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="بريدك الإلكتروني"
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-colors"
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">الموضوع</label>
                      <Input 
                        name="subject"
                        type="text" 
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="موضوع رسالتك"
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-colors"
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">الرسالة</label>
                      <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="اكتبي رسالتك أو استفسارك هنا..."
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-colors min-h-32"
                        required 
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          جاري الإرسال...
                        </div>
                      ) : (
                        <>
                          <Send className="w-5 h-5 ml-2" />
                          إرسال الرسالة
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Working Hours & Social Media */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-8 h-8 text-yellow-300 animate-pulse" />
                <h3 className="text-3xl font-bold">أوقات العمل</h3>
              </div>
              
              <div className="space-y-4 text-lg">
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span>الأحد - الخميس</span>
                  <span className="font-semibold">9:00 ص - 10:00 م</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span>الجمعة - السبت</span>
                  <span className="font-semibold">2:00 ظ - 11:00 م</span>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-6 h-6 text-rose-300 animate-pulse" />
                  <p className="text-lg font-semibold">نحن في خدمتك دائماً</p>
                </div>
                <p className="text-white/90">
                  فريقنا النسائي المتخصص جاهز لمساعدتك في اختيار العباءة المثالية التي تناسب ذوقك وشخصيتك المميزة
                </p>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-8">
                <Flower className="w-8 h-8 text-yellow-300 animate-pulse" />
                <h3 className="text-3xl font-bold">تابعينا على وسائل التواصل</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">إنستقرام</h4>
                    <p className="text-white/80">شاهدي أحدث تصاميمنا وإطلالات عملائنا</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">فيسبوك</h4>
                    <p className="text-white/80">انضمي لمجتمعنا وشاركي تجربتك</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <Twitter className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">تويتر</h4>
                    <p className="text-white/80">آخر الأخبار والعروض الحصرية</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Badge className="bg-white/20 text-white px-6 py-3 text-lg border-0">
                  <Heart className="w-5 h-5 ml-2 animate-pulse" />
                  نتطلع لتواصلك معنا
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AbayaFooter />
    </div>
  );
};

export default ContactUs;