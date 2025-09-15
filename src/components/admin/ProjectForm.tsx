import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, User, FileText, Target, Clock, Zap, Star } from 'lucide-react';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

interface Project {
  id?: string;
  name: string;
  description?: string;
  project_number?: string;
  project_type?: string;
  status?: string;
  progress_percentage?: number;
  budget?: number;
  currency?: string;
  start_date?: string;
  due_date?: string;
  created_at?: string;
  user_id?: string;
}

interface UserProfile {
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  company?: string;
  role: string;
  site_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  initialData?: Project | null;
  clients: UserProfile[];
  mode: 'create' | 'edit';
}

const projectTypes = [
  { value: 'web_development', label: 'تطوير مواقع ويب', icon: '🌐' },
  { value: 'mobile_app', label: 'تطبيقات الجوال', icon: '📱' },
  { value: 'desktop_app', label: 'تطبيقات سطح المكتب', icon: '💻' },
  { value: 'ecommerce', label: 'متاجر إلكترونية', icon: '🛒' },
  { value: 'branding', label: 'هوية تجارية', icon: '🎨' },
  { value: 'marketing', label: 'تسويق رقمي', icon: '📈' },
  { value: 'consulting', label: 'استشارات تقنية', icon: '💡' },
  { value: 'other', label: 'أخرى', icon: '📋' }
];

const statusOptions = [
  { value: 'planning', label: 'تخطيط', color: 'bg-slate-100 text-slate-800', icon: '📋' },
  { value: 'in_progress', label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800', icon: '⚡' },
  { value: 'review', label: 'مراجعة', color: 'bg-purple-100 text-purple-800', icon: '👁️' },
  { value: 'completed', label: 'مكتمل', color: 'bg-green-100 text-green-800', icon: '✅' },
  { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800', icon: '❌' }
];

const priorityOptions = [
  { value: 'low', label: 'منخفضة', color: 'bg-gray-100 text-gray-800', icon: '📉' },
  { value: 'medium', label: 'متوسطة', color: 'bg-yellow-100 text-yellow-800', icon: '📊' },
  { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-800', icon: '📈' },
  { value: 'urgent', label: 'عاجلة', color: 'bg-red-100 text-red-800', icon: '🚨' }
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  clients,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: '',
    status: 'planning' as string,
    progress_percentage: 0,
    budget: 0,
    currency: 'SAR',
    start_date: '',
    due_date: '',
    user_id: '',
    priority: 'medium',
    estimated_hours: '',
    tags: '',
    requirements: '',
    deliverables: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        project_type: initialData.project_type || '',
        status: initialData.status || 'planning',
        progress_percentage: initialData.progress_percentage || 0,
        budget: initialData.budget || 0,
        currency: initialData.currency || 'SAR',
        start_date: initialData.start_date || '',
        due_date: initialData.due_date || '',
        user_id: initialData.user_id || '',
        priority: 'medium',
        estimated_hours: '',
        tags: '',
        requirements: '',
        deliverables: ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        project_type: '',
        status: 'planning',
        progress_percentage: 0,
        budget: 0,
        currency: 'SAR',
        start_date: '',
        due_date: '',
        user_id: '',
        priority: 'medium',
        estimated_hours: '',
        tags: '',
        requirements: '',
        deliverables: ''
      });
    }
    setCurrentStep(1);
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedStatus = () => {
    return statusOptions.find(option => option.value === formData.status);
  };

  const getSelectedProjectType = () => {
    return projectTypes.find(type => type.value === formData.project_type);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.project_type && formData.user_id;
      case 2:
        return formData.status && formData.currency;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">المعلومات الأساسية</h3>
              <p className="text-sm text-muted-foreground">ابدأ بإدخال المعلومات الأساسية للمشروع</p>
            </div>

            <ResponsiveGrid cols="1-2" gap="md">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  اسم المشروع <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="مثال: تطوير موقع إلكتروني للشركة"
                  dir="rtl"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_type" className="text-right flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  نوع المشروع <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.project_type} onValueChange={(value) => handleInputChange('project_type', value)}>
                  <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                    <SelectValue placeholder="اختر نوع المشروع">
                      {getSelectedProjectType() && (
                        <div className="flex items-center gap-2">
                          <span>{getSelectedProjectType()?.icon}</span>
                          <span>{getSelectedProjectType()?.label}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client" className="text-right flex items-center gap-2">
                  <User className="w-4 h-4" />
                  العميل <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.user_id} onValueChange={(value) => handleInputChange('user_id', value)}>
                  <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.user_id} value={client.user_id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{client.full_name || client.user_id}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-right">وصف المشروع</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="اكتب وصفاً مفصلاً عن المشروع والأهداف المطلوبة..."
                  dir="rtl"
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </ResponsiveGrid>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">التفاصيل المالية والزمنية</h3>
              <p className="text-sm text-muted-foreground">حدد الميزانية والجدول الزمني للمشروع</p>
            </div>

            <ResponsiveGrid cols="1-2" gap="md">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-right flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  حالة المشروع <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                    <SelectValue>
                      {getSelectedStatus() && (
                        <div className="flex items-center gap-2">
                          <span>{getSelectedStatus()?.icon}</span>
                          <Badge variant="secondary" className={getSelectedStatus()?.color}>
                            {getSelectedStatus()?.label}
                          </Badge>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          <Badge variant="secondary" className={option.color}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-right">الأولوية</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          <Badge variant="secondary" className={option.color}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-right flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  الميزانية
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                    placeholder="0"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">ريال</SelectItem>
                      <SelectItem value="USD">دولار</SelectItem>
                      <SelectItem value="EUR">يورو</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_hours" className="text-right flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  الساعات المقدرة
                </Label>
                <Input
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) => handleInputChange('estimated_hours', e.target.value)}
                  placeholder="مثال: 120"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-right flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  تاريخ البداية
                </Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date" className="text-right flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  تاريخ التسليم
                </Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </ResponsiveGrid>

            {mode === 'edit' && (
              <div className="space-y-2">
                <Label htmlFor="progress" className="text-right">نسبة الإنجاز (%)</Label>
                <div className="space-y-3">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress_percentage}
                    onChange={(e) => handleInputChange('progress_percentage', Number(e.target.value))}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <Progress value={formData.progress_percentage} className="h-3" />
                  <div className="text-center text-sm text-muted-foreground">
                    {formData.progress_percentage}% مكتمل
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/10 to-green-500/20 rounded-full mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">التفاصيل الإضافية</h3>
              <p className="text-sm text-muted-foreground">أضف المتطلبات والمخرجات المطلوبة</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-right">المتطلبات الفنية</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="اكتب المتطلبات الفنية المطلوبة للمشروع..."
                  dir="rtl"
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables" className="text-right">المخرجات المطلوبة</Label>
                <Textarea
                  id="deliverables"
                  value={formData.deliverables}
                  onChange={(e) => handleInputChange('deliverables', e.target.value)}
                  placeholder="حدد المخرجات والمسلمات المطلوبة..."
                  dir="rtl"
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-right">العلامات (مفصولة بفاصلة)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="مثال: ويب, موبايل, تصميم"
                  dir="rtl"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* ملخص المشروع */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">ملخص المشروع</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">اسم المشروع:</span>
                  <span className="font-medium">{formData.name || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">النوع:</span>
                  <span className="font-medium">
                    {getSelectedProjectType()?.label || 'غير محدد'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الحالة:</span>
                  <span className="font-medium">
                    {getSelectedStatus()?.label || 'غير محدد'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الميزانية:</span>
                  <span className="font-medium">
                    {formData.budget > 0 ? `${formData.budget} ${formData.currency}` : 'غير محدد'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold">
            {mode === 'create' ? '🚀 إنشاء مشروع جديد' : '✏️ تحديث المشروع'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'أدخل تفاصيل المشروع الجديد بعناية لضمان التنفيذ الناجح'
              : 'قم بتحديث تفاصيل المشروع حسب الحاجة'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                  ${currentStep >= step 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-12 h-1 mx-2 rounded-full transition-all duration-200
                    ${currentStep > step ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] px-1">
          {renderStepContent()}
        </div>

        <Separator />

        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="hover-scale"
              >
                السابق
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="hover-scale"
              >
                التالي
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid(currentStep)}
                className="hover-scale"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جارٍ الحفظ...
                  </div>
                ) : (
                  mode === 'create' ? '🎯 إنشاء المشروع' : '💾 حفظ التغييرات'
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};