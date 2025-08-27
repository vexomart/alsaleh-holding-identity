import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Activity } from 'lucide-react';

const ProjectTrackingDemo = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: 'website',
    budget: '',
    start_date: '',
    due_date: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createSampleProject = async () => {
    try {
      setIsCreating(true);
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: formData.name || 'مشروع تجريبي',
          description: formData.description || 'وصف المشروع التجريبي',
          project_type: formData.project_type,
          budget: formData.budget ? parseFloat(formData.budget) : 15000,
          currency: 'SAR',
          start_date: formData.start_date || new Date().toISOString().split('T')[0],
          due_date: formData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .select();

      if (error) throw error;

      toast.success('تم إنشاء المشروع بنجاح!');
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        description: '',
        project_type: 'website',
        budget: '',
        start_date: '',
        due_date: ''
      });

    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('حدث خطأ في إنشاء المشروع');
    } finally {
      setIsCreating(false);
    }
  };

  const createSampleProjects = async () => {
    const sampleProjects = [
      {
        name: 'تطوير موقع شركة النور التقنية',
        description: 'تطوير موقع إلكتروني متجاوب لشركة النور التقنية مع نظام إدارة المحتوى',
        project_type: 'website',
        budget: 12000,
        currency: 'SAR',
        start_date: '2025-01-15',
        due_date: '2025-02-15'
      },
      {
        name: 'تطبيق توصيل الطعام السريع',
        description: 'تطبيق جوال لتوصيل الطعام مع خاصية التتبع المباشر ونظام الدفع',
        project_type: 'mobile_app',
        budget: 28000,
        currency: 'SAR',
        start_date: '2025-01-20',
        due_date: '2025-03-20'
      },
      {
        name: 'نظام إدارة الموارد البشرية',
        description: 'نظام شامل لإدارة الموظفين والرواتب والحضور والانصراف',
        project_type: 'system',
        budget: 35000,
        currency: 'SAR',
        start_date: '2025-01-10',
        due_date: '2025-04-10'
      }
    ];

    try {
      setIsCreating(true);
      
      for (const project of sampleProjects) {
        const { error } = await supabase
          .from('projects')
          .insert(project);
          
        if (error) throw error;
      }

      toast.success('تم إنشاء المشاريع التجريبية بنجاح!');
      
    } catch (error) {
      console.error('Error creating sample projects:', error);
      toast.error('حدث خطأ في إنشاء المشاريع التجريبية');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* إنشاء مشروع مخصص */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إنشاء مشروع جديد
          </CardTitle>
          <CardDescription>
            أضف مشروعاً جديداً لتجربة نظام التتبع
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم المشروع</label>
              <Input
                placeholder="مثال: تطوير موقع شركة..."
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">نوع المشروع</label>
              <Select value={formData.project_type} onValueChange={(value) => handleInputChange('project_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">موقع إلكتروني</SelectItem>
                  <SelectItem value="mobile_app">تطبيق جوال</SelectItem>
                  <SelectItem value="system">نظام إداري</SelectItem>
                  <SelectItem value="design">تصميم</SelectItem>
                  <SelectItem value="marketing">تسويق</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">وصف المشروع</label>
            <Textarea
              placeholder="وصف تفصيلي للمشروع..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">الميزانية (ريال)</label>
              <Input
                type="number"
                placeholder="15000"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">تاريخ البداية</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">تاريخ الانتهاء</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={createSampleProject} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? 'جارٍ الإنشاء...' : 'إنشاء المشروع'}
          </Button>
        </CardContent>
      </Card>

      {/* إنشاء مشاريع تجريبية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            مشاريع تجريبية
          </CardTitle>
          <CardDescription>
            أنشئ مشاريع تجريبية لتجربة النظام بسرعة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold">موقع شركة النور التقنية</h4>
                <p className="text-muted-foreground">موقع متجاوب مع إدارة محتوى</p>
                <p className="text-primary font-medium">12,000 ريال</p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold">تطبيق توصيل طعام</h4>
                <p className="text-muted-foreground">تطبيق مع تتبع ودفع إلكتروني</p>
                <p className="text-primary font-medium">28,000 ريال</p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold">نظام موارد بشرية</h4>
                <p className="text-muted-foreground">إدارة شاملة للموظفين</p>
                <p className="text-primary font-medium">35,000 ريال</p>
              </div>
            </div>
            
            <Button 
              onClick={createSampleProjects} 
              disabled={isCreating}
              variant="outline"
              className="w-full"
            >
              {isCreating ? 'جارٍ الإنشاء...' : 'إنشاء المشاريع التجريبية'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTrackingDemo;