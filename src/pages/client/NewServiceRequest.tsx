import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Star,
  Upload,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Zap,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequestFormData {
  serviceType: string;
  title: string;
  description: string;
  requirements: string;
  budget: string;
  priority: string;
  deadline: string;
  attachments: File[];
  additionalServices: string[];
}

export default function NewServiceRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ServiceRequestFormData>({
    serviceType: '',
    title: '',
    description: '',
    requirements: '',
    budget: '',
    priority: 'medium',
    deadline: '',
    attachments: [],
    additionalServices: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceTypes = [
    { id: 'web-development', label: 'تطوير المواقع الإلكترونية', description: 'مواقع ويب حديثة ومتجاوبة' },
    { id: 'mobile-app', label: 'تطبيقات الجوال', description: 'تطبيقات iOS و Android' },
    { id: 'design', label: 'التصميم والهوية البصرية', description: 'شعارات وتصاميم إبداعية' },
    { id: 'business', label: 'الخدمات التجارية', description: 'استشارات وحلول تجارية' },
    { id: 'marketing', label: 'التسويق الرقمي', description: 'حملات إعلانية ووسائل التواصل' },
    { id: 'other', label: 'خدمات أخرى', description: 'خدمات متنوعة حسب الطلب' }
  ];

  const additionalServiceOptions = [
    'استضافة الموقع',
    'نطاق مخصص',
    'شهادة SSL',
    'تحسين محركات البحث',
    'تدريب الفريق',
    'صيانة دورية',
    'نسخ احتياطية',
    'دعم فني مستمر'
  ];

  const handleInputChange = (field: keyof ServiceRequestFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdditionalServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: checked 
        ? [...prev.additionalServices, service]
        : prev.additionalServices.filter(s => s !== service)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // الحصول على معلومات المستخدم من Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // جمع معلومات العميل
      const customerInfo = {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم',
        email: user.email || '',
        phone: user.user_metadata?.phone || '+966123456789',
        company: user.user_metadata?.company || ''
      };

      const requestData = {
        serviceType: formData.serviceType,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        budget: formData.budget,
        priority: formData.priority,
        deadline: formData.deadline,
        additionalServices: formData.additionalServices,
        customerInfo,
        attachments: formData.attachments?.map(file => file.name) || [],
        userId: user.id
      };

      const { data, error } = await supabase.functions.invoke('service-request-notification', {
        body: requestData
      });

      if (error) {
        throw error;
      }

      console.log('تم إرسال وحفظ الطلب بنجاح:', data);

      // إذا كان المستخدم مُحال من مسوق، إرسال معلومات العمولة
      const referralCode = localStorage.getItem('affiliate_referral_code');
      if (referralCode && data.serviceRequestId) {
        try {
          // تقدير قيمة الطلب بناءً على الميزانية
          let estimatedValue = 0;
          switch (formData.budget) {
            case '5k-10k': estimatedValue = 7500; break;
            case '10k-25k': estimatedValue = 17500; break;
            case '25k-50k': estimatedValue = 37500; break;
            case '50k-100k': estimatedValue = 75000; break;
            case '100k+': estimatedValue = 150000; break;
            default: estimatedValue = 10000;
          }

          const { error: affiliateError } = await supabase.functions.invoke('affiliate-referral', {
            body: {
              affiliateCode: referralCode,
              newUserId: user.id,
              orderValue: estimatedValue,
              serviceRequestId: data.serviceRequestId
            }
          });

          if (affiliateError) {
            console.error('Error processing affiliate referral:', affiliateError);
          } else {
            console.log('Affiliate referral processed successfully');
            // إزالة الكود من localStorage بعد الاستخدام
            localStorage.removeItem('affiliate_referral_code');
          }
        } catch (affiliateErr) {
          console.error('Affiliate processing failed:', affiliateErr);
        }
      }
      
      toast({
        title: "تم إرسال الطلب بنجاح",
        description: `رقم الطلب: ${data.requestNumber} - سيتم التواصل معك خلال 24 ساعة`,
      });
      
      setIsSubmitted(true);
      
      // إعادة توجيه بعد 3 ثوانٍ
      setTimeout(() => {
        navigate('/client/service-requests');
      }, 3000);
    } catch (error) {
      console.error('خطأ في إرسال الطلب:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: error.message || "حدث خطأ أثناء إرسال طلب الخدمة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">تم إرسال طلبك بنجاح!</h2>
            <p className="text-muted-foreground mb-6">
              سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 24 ساعة
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>رقم الطلب: REQ-{Date.now()}</p>
              <p>سيتم إرسال تأكيد عبر البريد الإلكتروني</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/client/service-requests')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          رجوع
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">طلب خدمة جديدة</h1>
          <p className="text-muted-foreground">املأ النموذج للحصول على خدمة مخصصة</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Type Selection */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-l-4 border-l-primary">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">نوع الخدمة المطلوبة</CardTitle>
                <CardDescription>اختر نوع الخدمة التي تحتاجها من الخيارات المتاحة</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map(service => (
                <div
                  key={service.id}
                  className={`group relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.serviceType === service.id
                      ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-md'
                      : 'border-muted hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onClick={() => handleInputChange('serviceType', service.id)}
                >
                  {formData.serviceType === service.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.label}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-l-4 border-l-secondary">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg">تفاصيل المشروع</CardTitle>
                <CardDescription>وصف شامل ومفصل للخدمة المطلوبة وأهدافها</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-secondary" />
                <Label htmlFor="title" className="font-medium">عنوان المشروع *</Label>
              </div>
              <Input
                id="title"
                placeholder="أدخل عنواناً واضحاً ومميزاً للمشروع"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="h-12 border-2 hover:border-secondary/50 focus:border-secondary transition-colors"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary" />
                <Label htmlFor="description" className="font-medium">وصف المشروع التفصيلي *</Label>
              </div>
              <Textarea
                id="description"
                placeholder="اشرح بالتفصيل أهداف المشروع، الجمهور المستهدف، والنتائج المرجوة منه..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                required
                className="border-2 hover:border-secondary/50 focus:border-secondary transition-colors resize-none"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                كلما كان الوصف أكثر تفصيلاً، كان العرض أكثر دقة
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <Label htmlFor="requirements" className="font-medium">المتطلبات التقنية والميزات الخاصة</Label>
              </div>
              <Textarea
                id="requirements"
                placeholder="حدد المتطلبات التقنية، التقنيات المفضلة، التكاملات المطلوبة، أو أي ميزات خاصة تريدها في المشروع..."
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={4}
                className="border-2 hover:border-secondary/50 focus:border-secondary transition-colors resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Specifications */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-l-4 border-l-primary">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">مواصفات المشروع</CardTitle>
                  <CardDescription>الجدول الزمني والميزانية المتوقعة</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                <Zap className="w-3 h-3 ml-1" />
                تقدير أولي
              </Badge>
            </div>
            
            {/* Alert for Pricing */}
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>ملاحظة هامة:</strong> السعر النهائي الدقيق سيتم تحديده بناءً على دراسة شاملة لمتطلبات مشروعك 
                وتعقيده التقني بواسطة فريق الخبراء المختص.
              </AlertDescription>
            </Alert>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Budget and Priority Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <Label htmlFor="budget" className="font-medium">الميزانية المتوقعة</Label>
                </div>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger className="h-12 border-2 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="اختر النطاق المناسب لميزانيتك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5k-10k" className="p-3">
                      <div className="flex items-center justify-between w-full">
                        <span>5,000 - 10,000 ريال</span>
                        <Badge variant="secondary" className="text-xs">أساسي</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="10k-25k" className="p-3">
                      <div className="flex items-center justify-between w-full">
                        <span>10,000 - 25,000 ريال</span>
                        <Badge variant="secondary" className="text-xs">متوسط</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="25k-50k" className="p-3">
                      <div className="flex items-center justify-between w-full">
                        <span>25,000 - 50,000 ريال</span>
                        <Badge variant="secondary" className="text-xs">متقدم</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="50k-100k" className="p-3">
                      <div className="flex items-center justify-between w-full">
                        <span>50,000 - 100,000 ريال</span>
                        <Badge variant="secondary" className="text-xs">احترافي</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="100k+" className="p-3">
                      <div className="flex items-center justify-between w-full">
                        <span>أكثر من 100,000 ريال</span>
                        <Badge variant="secondary" className="text-xs">مؤسسي</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom" className="p-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3" />
                        <span>ميزانية مخصصة</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  هذه أسعار تقديرية قابلة للتعديل حسب المتطلبات
                </p>
              </div>

              {/* Priority Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <Label htmlFor="priority" className="font-medium">أولوية المشروع</Label>
                </div>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="h-12 border-2 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="حدد مستوى الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">منخفضة</div>
                          <div className="text-xs text-muted-foreground">4-6 أسابيع</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium" className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">متوسطة</div>
                          <div className="text-xs text-muted-foreground">2-4 أسابيع</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="high" className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">عالية</div>
                          <div className="text-xs text-muted-foreground">1-2 أسبوع</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent" className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-medium">عاجلة</div>
                          <div className="text-xs text-muted-foreground">أقل من أسبوع</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deadline Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <Label htmlFor="deadline" className="font-medium">الموعد النهائي المطلوب</Label>
              </div>
              <div className="relative">
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-12 border-2 hover:border-primary/50 transition-colors pl-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                اختر التاريخ المناسب لإنجاز المشروع مع مراعاة مدة التطوير المطلوبة
              </p>
            </div>

            {/* Project Timeline Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">معلومات إضافية</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    سيتم تقديم جدول زمني مفصل وعرض سعر دقيق بعد دراسة المتطلبات من قبل فريق المختصين.
                    جميع الأسعار المذكورة تقديرية وقابلة للتفاوض حسب نطاق العمل.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Services */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-l-4 border-l-accent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">خدمات إضافية</CardTitle>
                  <CardDescription>اختر الخدمات التكميلية لتعزيز مشروعك</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20">
                <Star className="w-3 h-3 ml-1" />
                اختيارية
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalServiceOptions.map(service => (
                <div 
                  key={service} 
                  className={`group p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                    formData.additionalServices.includes(service)
                      ? 'bg-accent/5 border-accent/30 shadow-sm'
                      : 'border-muted hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id={service}
                      checked={formData.additionalServices.includes(service)}
                      onCheckedChange={(checked) => 
                        handleAdditionalServiceChange(service, checked as boolean)
                      }
                      className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={service} 
                        className="text-sm font-medium cursor-pointer group-hover:text-accent transition-colors"
                      >
                        {service}
                      </Label>
                    </div>
                    {formData.additionalServices.includes(service) && (
                      <CheckCircle className="w-4 h-4 text-accent" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">معلومات هامة</p>
                  <p>الخدمات الإضافية اختيارية وسيتم تحديد تكلفتها في العرض النهائي حسب احتياجات مشروعك.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-l-4 border-l-destructive">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Upload className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-lg">المرفقات والملفات المرجعية</CardTitle>
                  <CardDescription>رفع ملفات مساعدة لفهم المشروع بشكل أفضل</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20">
                <Info className="w-3 h-3 ml-1" />
                اختياري
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  if (e.target.files) {
                    handleInputChange('attachments', Array.from(e.target.files));
                  }
                }}
              />
              <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center hover:border-destructive/50 hover:bg-destructive/5 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="p-3 bg-destructive/10 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground group-hover:text-destructive transition-colors">
                      اسحب الملفات هنا أو انقر للتحديد
                    </p>
                    <p className="text-sm text-muted-foreground">
                      يمكنك رفع ملفات التصاميم المرجعية، المواصفات، أو أي مستندات مساعدة
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="text-xs">PDF</Badge>
                    <Badge variant="secondary" className="text-xs">DOC</Badge>
                    <Badge variant="secondary" className="text-xs">DOCX</Badge>
                    <Badge variant="secondary" className="text-xs">صور</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    حد أقصى 10 ميجابايت لكل ملف
                  </p>
                </div>
              </div>
            </div>
            
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">الملفات المرفقة:</p>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-foreground flex-1">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} ميجا
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/client/service-requests')}
            className="flex-1"
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting || !formData.serviceType || !formData.title || !formData.description}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                جار الإرسال...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                إرسال الطلب
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}