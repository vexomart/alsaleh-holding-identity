import { 
  PenTool, 
  Video, 
  Megaphone, 
  FileText, 
  TrendingUp, 
  Users, 
  Newspaper,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Clock,
  Star,
  X,
  Phone,
  Mail,
  Building,
  Upload,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContentCreationSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    additionalServices: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const whatsappNumber = "966555812567";

  const handleServiceRequest = (service) => {
    setSelectedService(service);
    setFormData(prev => ({ ...prev, projectType: service.title }));
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('content-creation-request', {
        body: {
          ...formData,
          serviceName: selectedService?.title,
          serviceDescription: selectedService?.description
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح",
        description: "سنتواصل معك خلال 24 ساعة",
      });

      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
        additionalServices: []
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentServices = [
    {
      title: "كتابة السيناريو",
      description: "نصوص إبداعية للأفلام والبرامج والمحتوى المرئي",
      icon: Video,
      features: ["سيناريو أفلام", "نصوص برامج", "محتوى يوتيوب", "قصص تفاعلية"],
      color: "from-purple-500 to-indigo-600",
      bgColor: "from-purple-500/10 to-indigo-500/10",
      iconColor: "text-purple-400",
      whatsappMessage: "أود طلب خدمة كتابة السيناريو للمشروع الخاص بي"
    },
    {
      title: "كتابة الإعلانات الممولة",
      description: "محتوى إعلاني احترافي لحملات التسويق المدفوعة",
      icon: Megaphone,
      features: ["إعلانات فيسبوك", "إعلانات جوجل", "حملات مدفوعة", "إعلانات تلفزيونية"],
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-500/10 to-red-500/10",
      iconColor: "text-orange-400",
      whatsappMessage: "أحتاج إلى كتابة إعلانات ممولة احترافية لحملتي التسويقية"
    },
    {
      title: "كتابة المحتوى الرسمي",
      description: "نصوص رسمية للشركات والمؤسسات الحكومية",
      icon: FileText,
      features: ["تقارير رسمية", "مذكرات", "خطابات", "وثائق تنفيذية"],
      color: "from-slate-600 to-slate-800",
      bgColor: "from-slate-500/10 to-slate-700/10",
      iconColor: "text-slate-400",
      whatsappMessage: "أود طلب خدمة كتابة المحتوى الرسمي للمؤسسة"
    },
    {
      title: "كتابة المحتوى التسويقي",
      description: "محتوى تسويقي جذاب لزيادة المبيعات والوعي بالعلامة التجارية",
      icon: TrendingUp,
      features: ["محتوى مواقع", "بروشورات", "كتالوجات", "عروض تقديمية"],
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-400",
      whatsappMessage: "أحتاج إلى كتابة محتوى تسويقي مميز لعلامتي التجارية"
    },
    {
      title: "كتابة المحتوى التفاعلي",
      description: "محتوى تفاعلي يشرك الجمهور ويزيد التفاعل",
      icon: Users,
      features: ["منشورات تفاعلية", "استطلاعات", "مسابقات", "تحديات"],
      color: "from-pink-500 to-rose-600",
      bgColor: "from-pink-500/10 to-rose-500/10",
      iconColor: "text-pink-400",
      whatsappMessage: "أود طلب خدمة كتابة المحتوى التفاعلي لزيادة التفاعل مع جمهوري"
    },
    {
      title: "كتابة محتوى المقالات",
      description: "مقالات متخصصة وإعلامية عالية الجودة",
      icon: Newspaper,
      features: ["مقالات تقنية", "مقالات إعلامية", "محتوى SEO", "مدونات"],
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-400",
      whatsappMessage: "أحتاج إلى كتابة مقالات احترافية ومتخصصة"
    }
  ];

  const stats = [
    { label: "مشروع محتوى", value: "500+", icon: PenTool },
    { label: "كلمة مكتوبة", value: "2M+", icon: FileText },
    { label: "عميل راضي", value: "200+", icon: Star },
    { label: "لغة مدعومة", value: "3", icon: Sparkles }
  ];

  return (
    <section id="content-creation" className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full border border-violet-500/20 mb-6">
            <PenTool className="w-5 h-5 text-violet-400" />
            <span className="text-white font-medium">صناعة المحتوى</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              نصنع الكلمات
            </span>
            <br />
            <span className="text-white">
              التي تحرك العالم
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            فريقنا المتخصص في صناعة المحتوى يقدم نصوصاً احترافية تلهم وتؤثر وتحقق أهدافك التسويقية والإعلامية
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-300">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {contentServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="group relative p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-violet-300 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Dialog open={isModalOpen && selectedService?.title === service.title} onOpenChange={(open) => !open && setIsModalOpen(false)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-white/20 text-white hover:bg-white/10 hover:border-violet-400 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-purple-500 group-hover:border-transparent"
                        onClick={() => handleServiceRequest(service)}
                      >
                        <span>اطلب الخدمة</span>
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
                      <DialogHeader className="space-y-4 pb-6 border-b border-slate-700">
                        <div className="flex items-center justify-center">
                          <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center`}>
                            <service.icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                          طلب خدمة {service.title}
                        </DialogTitle>
                        <p className="text-slate-300 text-center">{service.description}</p>
                        
                        {/* Service Features */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-slate-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-300 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              الاسم الكامل *
                            </Label>
                            <Input
                              id="name"
                              required
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-violet-500"
                              placeholder="أدخل اسمك الكامل"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              البريد الإلكتروني *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-violet-500"
                              placeholder="example@email.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-300 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              رقم الهاتف *
                            </Label>
                            <Input
                              id="phone"
                              required
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-violet-500"
                              placeholder="+966 5XX XXX XXX"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company" className="text-slate-300 flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              اسم الشركة/المؤسسة
                            </Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-violet-500"
                              placeholder="اسم الشركة (اختياري)"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="budget" className="text-slate-300">الميزانية المتوقعة</Label>
                            <select
                              id="budget"
                              value={formData.budget}
                              onChange={(e) => handleInputChange('budget', e.target.value)}
                              className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:border-violet-500 focus:outline-none"
                            >
                              <option value="">اختر الميزانية</option>
                              <option value="أقل من 5,000 ريال">أقل من 5,000 ريال</option>
                              <option value="5,000 - 15,000 ريال">5,000 - 15,000 ريال</option>
                              <option value="15,000 - 30,000 ريال">15,000 - 30,000 ريال</option>
                              <option value="أكثر من 30,000 ريال">أكثر من 30,000 ريال</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="timeline" className="text-slate-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              الجدول الزمني المطلوب
                            </Label>
                            <select
                              id="timeline"
                              value={formData.timeline}
                              onChange={(e) => handleInputChange('timeline', e.target.value)}
                              className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:border-violet-500 focus:outline-none"
                            >
                              <option value="">اختر المدة</option>
                              <option value="أسبوع واحد">أسبوع واحد</option>
                              <option value="أسبوعين">أسبوعين</option>
                              <option value="شهر واحد">شهر واحد</option>
                              <option value="أكثر من شهر">أكثر من شهر</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-slate-300">تفاصيل المشروع *</Label>
                          <Textarea
                            id="description"
                            required
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-violet-500 min-h-[120px]"
                            placeholder="اكتب تفاصيل مشروعك، الأهداف المطلوبة، والجمهور المستهدف..."
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0"
                          >
                            {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Section */}
        <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-3xl font-bold text-white mb-12">عملية صناعة المحتوى</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "تحليل المتطلبات", desc: "فهم احتياجاتك وأهدافك", icon: Users },
              { step: "02", title: "وضع الاستراتيجية", desc: "تخطيط المحتوى والرسائل", icon: FileText },
              { step: "03", title: "الكتابة والإبداع", desc: "صياغة المحتوى بطريقة احترافية", icon: PenTool },
              { step: "04", title: "المراجعة والتسليم", desc: "ضمان الجودة والتسليم في الوقت", icon: CheckCircle }
            ].map((process, index) => {
              const IconComponent = process.icon;
              return (
                <div key={index} className="relative group">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-violet-500/50 to-transparent transform -translate-y-1/2 z-0" />
                  )}
                  
                  <div className="relative z-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {process.step}
                    </div>
                    
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-5 h-5 text-violet-400" />
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">{process.title}</h4>
                    <p className="text-sm text-slate-300">{process.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-3xl p-12 border border-violet-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-violet-400" />
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-sm font-medium">
                استشارة مجانية
              </Badge>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">
              هل تحتاج محتوى يميز علامتك التجارية؟
            </h3>
            
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              احصل على استشارة مجانية من خبرائنا واكتشف كيف يمكننا مساعدتك في صناعة محتوى يحقق أهدافك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("السلام عليكم، أود حجز استشارة مجانية حول خدمات صناعة المحتوى")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg font-medium"
                >
                  احجز استشارة مجانية
                  <ChevronRight className="w-5 h-5 mr-2" />
                </Button>
              </a>
              
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("أود الاطلاع على أعمالكم السابقة في مجال صناعة المحتوى")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg"
                >
                  اطلع على أعمالنا
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentCreationSection;