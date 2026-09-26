import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";
import { 
  MessageSquare, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Tag, 
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Star,
  Sparkles,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const Complaints = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    priority: "",
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.email) {
          toast({
            title: "بيانات مطلوبة",
            description: "يرجى ملء الاسم والبريد الإلكتروني",
            variant: "destructive"
          });
          return false;
        }
        if (!formData.email.includes('@')) {
          toast({
            title: "بريد إلكتروني غير صحيح",
            description: "يرجى إدخال بريد إلكتروني صحيح",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.category) {
          toast({
            title: "فئة مطلوبة",
            description: "يرجى اختيار فئة الشكوى",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        if (!formData.title) {
          toast({
            title: "عنوان مطلوب",
            description: "يرجى إدخال عنوان للشكوى",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 4:
        if (!formData.description) {
          toast({
            title: "وصف مطلوب",
            description: "يرجى إدخال تفاصيل الشكوى",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!validateCurrentStep()) {
      return;
    }

    console.log('Starting submission with data:', formData);
    setIsSubmitting(true);

    try {
      console.log('Invoking complaint-handler function...');
      const { data, error } = await supabase.functions.invoke('complaint-handler', {
        body: {
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          category: formData.category,
          priority: formData.priority || 'medium',
          title: formData.title,
          description: formData.description,
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Function returned error:', error);
        throw error;
      }

      console.log('Success! Ticket number:', data?.ticketNumber);
      toast({
        title: "تم إرسال الشكوى بنجاح! ✅",
        description: `رقم الشكوى: ${data?.ticketNumber}. سنتواصل معك قريباً.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        priority: "",
        title: "",
        description: "",
      });
      setCurrentStep(1);
      setCompletedSteps([]);

    } catch (error) {
      console.error("Complaint submission error:", error);
      toast({
        title: "خطأ في إرسال الشكوى",
        description: `حدث خطأ أثناء إرسال الشكوى: ${error.message || 'خطأ غير معروف'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "technical", label: "مشكلة تقنية", icon: "🔧", color: "bg-blue-500" },
    { value: "billing", label: "مسائل مالية", icon: "💰", color: "bg-green-500" },
    { value: "project", label: "مشاريع", icon: "📊", color: "bg-purple-500" },
    { value: "general", label: "عام", icon: "📝", color: "bg-gray-500" }
  ];

  const priorities = [
    { value: "low", label: "منخفضة", color: "bg-green-100 text-green-800 border-green-200" },
    { value: "medium", label: "متوسطة", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { value: "high", label: "عالية", color: "bg-red-100 text-red-800 border-red-200" }
  ];

  const stepTitles = [
    "البيانات الشخصية",
    "نوع الشكوى",
    "عنوان الشكوى",
    "تفاصيل الشكوى"
  ];

  const stepIcons = [User, Tag, FileText, MessageSquare];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  الاسم الكامل *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="h-12 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@domain.com"
                  className="h-12 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="05xxxxxxxx"
                className="h-12 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                اختر فئة الشكوى *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <motion.div
                    key={cat.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.category === cat.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                    onClick={() => handleInputChange('category', cat.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${cat.color} flex items-center justify-center text-white text-lg`}>
                        {cat.icon}
                      </div>
                      <span className="font-medium">{cat.label}</span>
                      {formData.category === cat.value && (
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-auto" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                الأولوية
              </Label>
              <div className="flex gap-3">
                {priorities.map((priority) => (
                  <Badge
                    key={priority.value}
                    variant={formData.priority === priority.value ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-300 px-4 py-2 ${
                      formData.priority === priority.value 
                        ? 'bg-blue-600 text-white' 
                        : priority.color
                    }`}
                    onClick={() => handleInputChange('priority', priority.value)}
                  >
                    {priority.label}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                عنوان الشكوى *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="اكتب عنوان مختصر وواضح للشكوى"
                className="h-12 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg"
                required
              />
              <p className="text-sm text-gray-500">
                مثال: "مشكلة في تحديث البيانات الشخصية" أو "استفسار حول الفاتورة"
              </p>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                تفاصيل الشكوى *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="اشرح شكواك بالتفصيل... كلما كانت التفاصيل أكثر، كلما استطعنا مساعدتك بشكل أفضل"
                rows={8}
                className="border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg resize-none"
                required
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>أضف جميع التفاصيل المهمة</span>
                <span>{formData.description.length} حرف</span>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>رفع طلب أو شكوى - ASH HOLDING</title>
        <meta name="description" content="قدم شكوى أو طلب للحصول على الدعم الفني من فريق ASH HOLDING المتخصص" />
        <meta name="keywords" content="شكوى, طلب دعم, خدمة العملاء, ASH HOLDING" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Advanced Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                    <MessageSquare className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border-2 border-dashed border-blue-300 rounded-full"
                  />
                </motion.div>
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6"
              >
                مركز الدعم المتطور
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                نحن هنا لمساعدتك على مدار الساعة. قدم شكواك أو طلبك وسنتواصل معك في أقرب وقت ممكن
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex justify-center items-center gap-4 mt-8"
              >
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  دعم 24/7
                </Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  آمن ومحمي
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 px-4 py-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  استجابة سريعة
                </Badge>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Advanced Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Main Form */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-3xl flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        نموذج الشكاوي المتطور
                      </CardTitle>
                      
                      {/* Progress Bar */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            الخطوة {currentStep} من {totalSteps}
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {Math.round(progress)}% مكتملة
                          </span>
                        </div>
                        <Progress value={progress} className="h-3 bg-gray-100">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </Progress>
                        
                        {/* Step Indicators */}
                        <div className="flex justify-between">
                          {stepTitles.map((title, index) => {
                            const stepNumber = index + 1;
                            const IconComponent = stepIcons[index];
                            const isCompleted = completedSteps.includes(stepNumber);
                            const isCurrent = currentStep === stepNumber;
                            
                            return (
                              <div key={stepNumber} className="flex flex-col items-center">
                                <motion.div
                                  animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                    backgroundColor: isCompleted 
                                      ? '#10b981' 
                                      : isCurrent 
                                        ? '#3b82f6' 
                                        : '#e5e7eb'
                                  }}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isCompleted 
                                      ? 'bg-green-500 text-white' 
                                      : isCurrent 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-200 text-gray-500'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <IconComponent className="w-5 h-5" />
                                  )}
                                </motion.div>
                                <span className={`text-xs mt-2 text-center max-w-20 ${
                                  isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                                }`}>
                                  {title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                          {renderStepContent()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            السابق
                          </Button>

                          {currentStep < totalSteps ? (
                            <Button
                              type="button"
                              onClick={handleNextStep}
                              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              التالي
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3 text-lg font-semibold"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  جاري الإرسال...
                                </>
                              ) : (
                                <>
                                  <Send className="w-5 h-5" />
                                  إرسال الشكوى
                                  <Sparkles className="w-4 h-4" />
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Enhanced Info Sidebar */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-6"
                >
                  
                  {/* Process Info */}
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        مراحل المعالجة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { step: "1", title: "تأكيد فوري", desc: "رقم تذكرة فوراً", time: "فوري", color: "blue" },
                        { step: "2", title: "إشعار تلقائي", desc: "رسالة تأكيد بالبريد", time: "خلال دقائق", color: "green" },
                        { step: "3", title: "مراجعة الفريق", desc: "تحليل الشكوى", time: "خلال ساعة", color: "orange" },
                        { step: "4", title: "الاستجابة", desc: "حل أو متابعة", time: "خلال 24 ساعة", color: "purple" }
                      ].map((item, index) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-white/60 rounded-lg"
                        >
                          <div className={`w-8 h-8 bg-${item.color}-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm`}>
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                            <Badge className={`mt-1 bg-${item.color}-100 text-${item.color}-800 text-xs`}>
                              {item.time}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>


                  {/* Emergency Contact */}
                  <Card className="bg-gradient-to-br from-red-50 to-pink-100 border-red-200 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        حالات الطوارئ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-red-600 mb-4">
                        للحالات العاجلة التي تتطلب تدخل فوري:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                          <Phone className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">خط الطوارئ</p>
                            <p className="text-sm text-gray-600">0555812567</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                          <Mail className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">البريد العاجل</p>
                            <p className="text-sm text-gray-600">urgent@alialshehriholding.com</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Satisfaction Guarantee */}
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        ضمان الرضا
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl mb-2">🏆</div>
                        <p className="text-sm text-green-600 font-medium mb-2">
                          نضمن لك الحل المناسب
                        </p>
                        <p className="text-xs text-gray-600">
                          إذا لم تكن راضياً عن الحل المقدم، سنعيد النظر في طلبك مجاناً
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Complaints;