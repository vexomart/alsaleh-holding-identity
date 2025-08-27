import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Star,
  Upload,
  Send,
  CheckCircle
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
        <Card>
          <CardHeader>
            <CardTitle>مواصفات المشروع</CardTitle>
            <CardDescription>الجدول الزمني والميزانية</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">الميزانية المتوقعة</Label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الميزانية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5k-10k">5,000 - 10,000 ريال</SelectItem>
                  <SelectItem value="10k-25k">10,000 - 25,000 ريال</SelectItem>
                  <SelectItem value="25k-50k">25,000 - 50,000 ريال</SelectItem>
                  <SelectItem value="50k-100k">50,000 - 100,000 ريال</SelectItem>
                  <SelectItem value="100k+">أكثر من 100,000 ريال</SelectItem>
                  <SelectItem value="custom">ميزانية مخصصة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">أولوية المشروع</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="urgent">عاجلة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deadline">الموعد النهائي المطلوب</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
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