import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Settings,
  Headphones,
  CheckCircle,
  Star,
  Calendar,
  Award,
  Globe,
  Target,
  Heart,
  Zap,
  ArrowRight,
  Download,
  Briefcase,
  GraduationCap,
  Building
} from "lucide-react";

const CareersPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    education: '',
    skills: '',
    motivation: '',
    cv: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(prev => ({
      ...prev,
      cv: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
    setIsSubmitting(false);
    
    // إعادة تعيين النموذج
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      education: '',
      skills: '',
      motivation: '',
      cv: null
    });
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "راتب تنافسي",
      description: "رواتب ومكافآت تنافسية في السوق"
    },
    {
      icon: TrendingUp,
      title: "نمو مهني",
      description: "فرص تطوير وتدريب مستمرة"
    },
    {
      icon: Shield,
      title: "تأمين صحي",
      description: "تأمين صحي شامل لك ولعائلتك"
    },
    {
      icon: Clock,
      title: "مرونة في العمل",
      description: "ساعات عمل مرنة وبيئة إيجابية"
    },
    {
      icon: Award,
      title: "مكافآت الأداء",
      description: "نظام مكافآت قائم على الأداء"
    },
    {
      icon: Users,
      title: "فريق متميز",
      description: "العمل مع فريق محترف ومتعاون"
    }
  ];

  const cultureValues = [
    {
      icon: Target,
      title: "التميز",
      description: "نسعى للتميز في كل ما نقوم به"
    },
    {
      icon: Heart,
      title: "الاهتمام بالعملاء",
      description: "العميل في المقدمة دائماً"
    },
    {
      icon: Zap,
      title: "الابتكار",
      description: "نبتكر حلولاً جديدة ومبدعة"
    },
    {
      icon: Users,
      title: "العمل الجماعي",
      description: "قوة الفريق تحقق النجاح"
    }
  ];

  const upcomingPositions = [
    {
      title: "مطور تطبيقات الجوال",
      department: "تقنية المعلومات",
      type: "دوام كامل",
      location: "الرياض"
    },
    {
      title: "مدير التسويق الرقمي",
      department: "التسويق",
      type: "دوام كامل",
      location: "جدة"
    },
    {
      title: "محاسب قانوني",
      department: "المالية",
      type: "دوام كامل",
      location: "الدمام"
    },
    {
      title: "مصمم جرافيك",
      department: "التصميم",
      type: "دوام جزئي",
      location: "عن بُعد"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* شريط التحذير */}
      <div className="bg-yellow-400 text-black py-2 text-center text-sm font-medium relative z-50">
        <div className="container mx-auto px-4">
          ⚠️ هذا موقع تجريبي فقط - جميع المعلومات والأسعار غير صحيحة ولأغراض العرض فقط
        </div>
      </div>

      {/* الهيدر */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              انضم إلى فريقنا المتميز
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              كن جزءاً من شركة رائدة في مجال تأجير السيارات وساهم في تشكيل مستقبل النقل
            </p>
          </div>
        </div>
      </div>

      {/* فورم التقديم */}
      <section id="application" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              تقدم للوظيفة الآن
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
                  <Briefcase className="w-8 h-8" />
                  نموذج التقديم للوظيفة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* المعلومات الشخصية */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        الاسم الكامل *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        required
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الهاتف *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+966 50 123 4567"
                        required
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        الوظيفة المرغوبة *
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="h-12 w-full border-2 rounded-md px-3 focus:border-blue-500 transition-colors bg-white"
                      >
                        <option value="">اختر الوظيفة</option>
                        <option value="sales">مندوب مبيعات</option>
                        <option value="maintenance">فني صيانة</option>
                        <option value="customer-service">خدمة عملاء</option>
                        <option value="driver">سائق</option>
                        <option value="manager">مدير فرع</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                  </div>

                  {/* التعليم والخبرة */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        المؤهل التعليمي
                      </label>
                      <Input
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="بكالوريوس، دبلوم، ثانوية عامة..."
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        سنوات الخبرة
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="h-12 w-full border-2 rounded-md px-3 focus:border-blue-500 transition-colors bg-white"
                      >
                        <option value="">اختر سنوات الخبرة</option>
                        <option value="0-1">أقل من سنة</option>
                        <option value="1-3">1-3 سنوات</option>
                        <option value="3-5">3-5 سنوات</option>
                        <option value="5-10">5-10 سنوات</option>
                        <option value="10+">أكثر من 10 سنوات</option>
                      </select>
                    </div>
                  </div>

                  {/* المهارات */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      المهارات الرئيسية
                    </label>
                    <Textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="اذكر أهم مهاراتك المتعلقة بالوظيفة..."
                      rows={4}
                      className="border-2 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  {/* الدافع */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      لماذا تريد العمل معنا؟
                    </label>
                    <Textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      placeholder="أخبرنا عن دافعك للانضمام إلى فريقنا..."
                      rows={4}
                      className="border-2 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  {/* رفع السيرة الذاتية */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      السيرة الذاتية (PDF)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 mb-2">اضغط لرفع السيرة الذاتية</p>
                        <p className="text-sm text-slate-400">PDF, DOC, DOCX (حد أقصى 5 ميجابايت)</p>
                      </label>
                      {formData.cv && (
                        <p className="mt-2 text-sm text-green-600 flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          تم رفع الملف: {formData.cv.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* زر الإرسال */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-5 h-5" />
                        إرسال الطلب
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* مزايا العمل معنا */}
      <section id="benefits" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              مزايا العمل معنا
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نوفر بيئة عمل متميزة ومزايا استثنائية لفريقنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ثقافة الشركة */}
      <section id="culture" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              ثقافة شركتنا
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              قيمنا ومبادئنا التي توجه عملنا اليومي
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <value.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الوظائف القادمة */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              وظائف قادمة قريباً
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              ترقب المزيد من الفرص الوظيفية المثيرة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingPositions.map((position, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-bl-lg">
                  قريباً
                </div>
                <CardContent className="p-6 pt-12">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{position.title}</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {position.department}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {position.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-4 border-blue-500 text-blue-600">
                    إشعرني عند التوفر
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ابدأ مسيرتك المهنية معنا
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              انضم إلى فريق متميز في شركة رائدة واصنع مستقبلك المهني
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all text-lg px-12 py-6 shadow-2xl font-semibold"
                onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Briefcase className="w-6 h-6 ml-2" />
                تقدم الآن
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all text-lg px-12 py-6 backdrop-blur-sm"
              >
                <Download className="w-6 h-6 ml-2" />
                تحميل دليل الموظف
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">كار رنت برو</h3>
              <p className="text-sm text-slate-400">فرص التوظيف</p>
            </div>
          </div>
          <p className="text-slate-300 mb-6">
            نحن دائماً نبحث عن المواهب المتميزة للانضمام إلى فريقنا
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/">العودة للموقع الرئيسي</a>
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 ml-2" />
              careers@carrentpro.sa
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareersPage;