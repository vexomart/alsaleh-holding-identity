import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Save, 
  Database, 
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  Server
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  updated_by?: string;
  updated_at: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Company Settings
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    
    // Email Settings
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    email_notifications: true,
    
    // Notification Settings
    push_notifications: true,
    sms_notifications: false,
    email_alerts: true,
    
    // Security Settings
    two_factor_auth: false,
    password_expiry_days: '90',
    max_login_attempts: '5',
    session_timeout: '30',
    
    // System Settings
    maintenance_mode: false,
    backup_frequency: 'daily',
    log_retention_days: '30',
    max_file_size: '10'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category');

      if (error) throw error;

      setSettings(data || []);
      
      // Populate form data with existing settings
      const settingsObj: any = {};
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      
      setFormData(prev => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "خطأ في جلب الإعدادات",
        description: "حدث خطأ أثناء جلب إعدادات النظام",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (category?: string) => {
    setSaving(true);
    try {
      const settingsToUpdate = Object.entries(formData).filter(([key, value]) => {
        const setting = settings.find(s => s.key === key);
        return !category || (setting && setting.category === category) || !setting;
      });

      for (const [key, value] of settingsToUpdate) {
        const existingSetting = settings.find(s => s.key === key);
        
        if (existingSetting) {
          // Update existing setting
          const { error } = await supabase
            .from('system_settings')
            .update({ 
              value: value,
              updated_at: new Date().toISOString()
            })
            .eq('key', key);
          
          if (error) throw error;
        } else {
          // Create new setting
          const { error } = await supabase
            .from('system_settings')
            .insert({
              key,
              value,
              category: category || 'general',
              description: `إعداد ${key}`
            });
          
          if (error) throw error;
        }
      }

      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات النظام بنجاح",
      });

      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">إعدادات النظام</h1>
        <p className="text-muted-foreground">إدارة وتخصيص إعدادات النظام العامة</p>
      </div>

      <ResponsiveGrid cols="1-2" gap="lg">
        {/* Company Settings */}
        <ResponsiveCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              إعدادات الشركة
            </CardTitle>
            <CardDescription>المعلومات الأساسية للشركة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">اسم الشركة</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="علي صالح الشهري القابضة"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_email">البريد الإلكتروني</Label>
              <Input
                id="company_email"
                type="email"
                value={formData.company_email}
                onChange={(e) => handleInputChange('company_email', e.target.value)}
                placeholder="info@company.com"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_phone">رقم الهاتف</Label>
              <Input
                id="company_phone"
                value={formData.company_phone}
                onChange={(e) => handleInputChange('company_phone', e.target.value)}
                placeholder="+966 xx xxx xxxx"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_address">العنوان</Label>
              <Textarea
                id="company_address"
                value={formData.company_address}
                onChange={(e) => handleInputChange('company_address', e.target.value)}
                placeholder="عنوان الشركة"
                dir="rtl"
              />
            </div>
            <Button onClick={() => handleSave('company')} disabled={saving} className="w-full">
              <Save className="w-4 h-4 ml-2" />
              حفظ إعدادات الشركة
            </Button>
          </CardContent>
        </ResponsiveCard>

        {/* Email Settings */}
        <ResponsiveCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              إعدادات البريد الإلكتروني
            </CardTitle>
            <CardDescription>تكوين خادم البريد الإلكتروني</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_host">خادم SMTP</Label>
              <Input
                id="smtp_host"
                value={formData.smtp_host}
                onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                placeholder="smtp.gmail.com"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_port">منفذ SMTP</Label>
              <Input
                id="smtp_port"
                value={formData.smtp_port}
                onChange={(e) => handleInputChange('smtp_port', e.target.value)}
                placeholder="587"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_username">اسم المستخدم</Label>
              <Input
                id="smtp_username"
                value={formData.smtp_username}
                onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                placeholder="username@gmail.com"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_password">كلمة المرور</Label>
              <Input
                id="smtp_password"
                type="password"
                value={formData.smtp_password}
                onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                placeholder="••••••••"
                dir="rtl"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email_notifications">تفعيل إشعارات البريد</Label>
              <Switch
                id="email_notifications"
                checked={formData.email_notifications}
                onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
              />
            </div>
            <Button onClick={() => handleSave('email')} disabled={saving} className="w-full">
              <Save className="w-4 h-4 ml-2" />
              حفظ إعدادات البريد
            </Button>
          </CardContent>
        </ResponsiveCard>

        {/* Notification Settings */}
        <ResponsiveCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              إعدادات الإشعارات
            </CardTitle>
            <CardDescription>تحكم في أنواع الإشعارات المختلفة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push_notifications">الإشعارات الفورية</Label>
              <Switch
                id="push_notifications"
                checked={formData.push_notifications}
                onCheckedChange={(checked) => handleInputChange('push_notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms_notifications">إشعارات SMS</Label>
              <Switch
                id="sms_notifications"
                checked={formData.sms_notifications}
                onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email_alerts">تنبيهات البريد الإلكتروني</Label>
              <Switch
                id="email_alerts"
                checked={formData.email_alerts}
                onCheckedChange={(checked) => handleInputChange('email_alerts', checked)}
              />
            </div>
            <Button onClick={() => handleSave('notifications')} disabled={saving} className="w-full">
              <Save className="w-4 h-4 ml-2" />
              حفظ إعدادات الإشعارات
            </Button>
          </CardContent>
        </ResponsiveCard>

        {/* Security Settings */}
        <ResponsiveCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              إعدادات الأمان
            </CardTitle>
            <CardDescription>تكوين إعدادات الأمان والحماية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two_factor_auth">المصادقة الثنائية</Label>
              <Switch
                id="two_factor_auth"
                checked={formData.two_factor_auth}
                onCheckedChange={(checked) => handleInputChange('two_factor_auth', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_expiry_days">انتهاء صلاحية كلمة المرور (بالأيام)</Label>
              <Input
                id="password_expiry_days"
                type="number"
                value={formData.password_expiry_days}
                onChange={(e) => handleInputChange('password_expiry_days', e.target.value)}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_login_attempts">عدد محاولات تسجيل الدخول القصوى</Label>
              <Input
                id="max_login_attempts"
                type="number"
                value={formData.max_login_attempts}
                onChange={(e) => handleInputChange('max_login_attempts', e.target.value)}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session_timeout">انتهاء صلاحية الجلسة (بالدقائق)</Label>
              <Input
                id="session_timeout"
                type="number"
                value={formData.session_timeout}
                onChange={(e) => handleInputChange('session_timeout', e.target.value)}
                dir="rtl"
              />
            </div>
            <Button onClick={() => handleSave('security')} disabled={saving} className="w-full">
              <Save className="w-4 h-4 ml-2" />
              حفظ إعدادات الأمان
            </Button>
          </CardContent>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* System Settings */}
      <ResponsiveCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            إعدادات النظام
          </CardTitle>
          <CardDescription>إعدادات النظام العامة والصيانة</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid cols="1-2-4" gap="md">
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance_mode">وضع الصيانة</Label>
              <Switch
                id="maintenance_mode"
                checked={formData.maintenance_mode}
                onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup_frequency">تكرار النسخ الاحتياطي</Label>
              <Input
                id="backup_frequency"
                value={formData.backup_frequency}
                onChange={(e) => handleInputChange('backup_frequency', e.target.value)}
                placeholder="يومي"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="log_retention_days">حفظ السجلات (بالأيام)</Label>
              <Input
                id="log_retention_days"
                type="number"
                value={formData.log_retention_days}
                onChange={(e) => handleInputChange('log_retention_days', e.target.value)}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_file_size">الحد الأقصى لحجم الملف (MB)</Label>
              <Input
                id="max_file_size"
                type="number"
                value={formData.max_file_size}
                onChange={(e) => handleInputChange('max_file_size', e.target.value)}
                dir="rtl"
              />
            </div>
          </ResponsiveGrid>
          <div className="mt-6">
            <Button onClick={() => handleSave('system')} disabled={saving} className="w-full">
              <Save className="w-4 h-4 ml-2" />
              حفظ إعدادات النظام
            </Button>
          </div>
        </CardContent>
      </ResponsiveCard>
    </div>
  );
};

export default AdminSettings;