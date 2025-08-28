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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/client/service-requests');
      }, 3000);
    } catch (error) {
      console.error('Error submitting service request:', error);
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              نوع الخدمة المطلوبة
            </CardTitle>
            <CardDescription>اختر نوع الخدمة التي تحتاجها</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceTypes.map(service => (
              <div
                key={service.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.serviceType === service.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('serviceType', service.id)}
              >
                <h4 className="font-medium text-foreground mb-1">{service.label}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المشروع</CardTitle>
            <CardDescription>وصف مفصل للخدمة المطلوبة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان المشروع *</Label>
              <Input
                id="title"
                placeholder="أدخل عنواناً واضحاً للمشروع"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف المشروع *</Label>
              <Textarea
                id="description"
                placeholder="اشرح تفاصيل المشروع والأهداف المرجوة منه"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">المتطلبات التقنية</Label>
              <Textarea
                id="requirements"
                placeholder="اذكر أي متطلبات تقنية خاصة أو ميزات محددة تريدها"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={3}
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
        <Card>
          <CardHeader>
            <CardTitle>خدمات إضافية</CardTitle>
            <CardDescription>اختر الخدمات الإضافية التي تحتاجها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalServiceOptions.map(service => (
                <div key={service} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={service}
                    checked={formData.additionalServices.includes(service)}
                    onCheckedChange={(checked) => 
                      handleAdditionalServiceChange(service, checked as boolean)
                    }
                  />
                  <Label htmlFor={service} className="text-sm cursor-pointer">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>مرفقات</CardTitle>
            <CardDescription>رفع ملفات مرجعية أو مواصفات إضافية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                اسحب الملفات هنا أو انقر للتحديد
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX, Images (حتى 10 ميجابايت لكل ملف)
              </p>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleInputChange('attachments', Array.from(e.target.files));
                  }
                }}
              />
            </div>
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