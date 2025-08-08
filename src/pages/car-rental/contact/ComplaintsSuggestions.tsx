import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  MessageSquare,
  Send,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Heart,
  Star,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Phone,
  Mail,
  Clock,
  Award,
  TrendingUp,
  Users
} from "lucide-react";

const ComplaintsSuggestions = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    subject: '',
    message: '',
    rating: 0,
    anonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const complaintTypes = [
    { value: 'service-quality', label: 'جودة الخدمة', icon: Star, color: 'text-yellow-500' },
    { value: 'car-condition', label: 'حالة السيارة', icon: AlertTriangle, color: 'text-orange-500' },
    { value: 'staff-behavior', label: 'سلوك الموظفين', icon: Users, color: 'text-blue-500' },
    { value: 'billing', label: 'الفواتير والأسعار', icon: FileText, color: 'text-green-500' },
    { value: 'booking-process', label: 'عملية الحجز', icon: Phone, color: 'text-purple-500' },
    { value: 'suggestion', label: 'اقتراح للتحسين', icon: Lightbulb, color: 'text-cyan-500' },
    { value: 'compliment', label: 'إشادة وتقدير', icon: Heart, color: 'text-red-500' },
    { value: 'other', label: 'أخرى', icon: MessageSquare, color: 'text-gray-500' }
  ];

  const satisfactionLevels = [
    { value: 5, label: 'ممتاز جداً', color: 'bg-green-500' },
    { value: 4, label: 'ممتاز', color: 'bg-green-400' },
    { value: 3, label: 'جيد', color: 'bg-yellow-500' },
    { value: 2, label: 'مقبول', color: 'bg-orange-500' },
    { value: 1, label: 'ضعيف', color: 'bg-red-500' }
  ];

  const recentFeedback = [
    {
      id: 1,
      type: 'compliment',
      subject: 'خدمة ممتازة في فرع الملز',
      status: 'تم الرد',
      date: '2024-01-15',
      rating: 5,
      response: 'شكراً لك على هذه الكلمات الطيبة، نسعد بخدمتك دائماً'
    },
    {
      id: 2,
      type: 'suggestion',
      subject: 'إضافة المزيد من السيارات الكهربائية',
      status: 'قيد المراجعة',
      date: '2024-01-12',
      rating: 4,
      response: 'اقتراح ممتاز! نحن بالفعل نعمل على توسيع أسطول السيارات الكهربائية'
    },
    {
      id: 3,
      type: 'service-quality',
      subject: 'تأخير في تسليم السيارة',
      status: 'تم الحل',
      date: '2024-01-10',
      rating: 2,
      response: 'نعتذر عن التأخير، تم اتخاذ الإجراءات اللازمة لتجنب تكرار هذا الأمر'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
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
        type: '',
        subject: '',
        message: '',
        rating: 0,
        anonymous: false
      });
    }, 3000);
  };

  const getTypeDetails = (type: string) => {
    return complaintTypes.find(t => t.value === type);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'تم الرد': return 'bg-green-500';
      case 'تم الحل': return 'bg-blue-500';
      case 'قيد المراجعة': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental/contact" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <MessageSquare className="w-4 h-4 mr-1" />
                الشكاوى والاقتراحات
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              صوتك يهمنا
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed animate-fade-in">
              نستمع لآرائكم ونعمل على تطوير خدماتنا باستمرار
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'متوسط وقت الرد', value: '< 24 ساعة', icon: Clock },
                { label: 'معدل حل المشاكل', value: '98%', icon: CheckCircle },
                { label: 'رضا العملاء', value: '4.8/5', icon: Star },
                { label: 'تحسينات مطبقة', value: '150+', icon: TrendingUp }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 animate-fade-in">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-200" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Feedback Form */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  شاركنا رأيك
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">شكراً لك!</h3>
                    <p className="text-muted-foreground">
                      تم استلام رسالتك وسنتواصل معك قريباً
                    </p>
                    <Badge className="mt-4 bg-green-500 text-white">
                      رقم المرجع: #FB{Date.now().toString().slice(-6)}
                    </Badge>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          required={!formData.anonymous}
                          disabled={formData.anonymous}
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
                          required={!formData.anonymous}
                          disabled={formData.anonymous}
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
                        required={!formData.anonymous}
                        disabled={formData.anonymous}
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>

                    {/* Anonymous Option */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label className="text-sm">إرسال مجهول (بدون معلومات شخصية)</label>
                    </div>

                    {/* Type Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">نوع الرسالة *</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {complaintTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              formData.type === type.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <type.icon className={`w-5 h-5 mx-auto mb-1 ${type.color}`} />
                            <span className="text-xs">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Satisfaction Rating */}
                    <div>
                      <label className="block text-sm font-medium mb-3">مستوى الرضا العام</label>
                      <div className="flex justify-between gap-2">
                        {satisfactionLevels.map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => handleRatingChange(level.value)}
                            className={`flex-1 p-2 rounded-lg text-center transition-all text-white text-xs ${
                              formData.rating === level.value
                                ? `${level.color} scale-110 shadow-lg`
                                : `${level.color} opacity-50 hover:opacity-75`
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium mb-2">الموضوع *</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="عنوان مختصر لرسالتك"
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium mb-2">التفاصيل *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="اكتب تفاصيل رسالتك هنا..."
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

            {/* Recent Feedback */}
            <div className="space-y-6">
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    ردود حديثة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentFeedback.map((feedback) => {
                    const typeDetails = getTypeDetails(feedback.type);
                    return (
                      <div key={feedback.id} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {typeDetails && <typeDetails.icon className={`w-4 h-4 ${typeDetails.color}`} />}
                            <span className="font-medium text-sm">{feedback.subject}</span>
                          </div>
                          <Badge className={`${getStatusColor(feedback.status)} text-white text-xs`}>
                            {feedback.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{feedback.date}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{feedback.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.response}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-lg font-bold text-center mb-2">تحتاج مساعدة فورية؟</h3>
                  <p className="text-center text-indigo-100 mb-4 text-sm">
                    تواصل معنا مباشرة للحصول على دعم سريع
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-gray-100">
                      <Phone className="w-4 h-4 mr-2" />
                      0555812567
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Mail className="w-4 h-4 mr-2" />
                      feedback@alialshehriholding.com
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Process Steps */}
          <Card className="bg-gradient-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-slate-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8">كيف نتعامل مع رسالتك؟</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: 1, title: 'الاستلام', description: 'نستلم رسالتك خلال دقائق', icon: MessageSquare },
                  { step: 2, title: 'المراجعة', description: 'فريق متخصص يراجع المحتوى', icon: FileText },
                  { step: 3, title: 'الإجراء', description: 'نتخذ الإجراءات المناسبة', icon: CheckCircle },
                  { step: 4, title: 'المتابعة', description: 'نتابع معك حتى الحل النهائي', icon: ThumbsUp }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                      {step.step}
                    </div>
                    <step.icon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-bold mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <CarRentalFooter />
      </div>
    </div>
  );
};

export default ComplaintsSuggestions;