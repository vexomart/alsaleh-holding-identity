import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Mail,
  MessageSquare,
  Smartphone,
  Volume2,
  Eye,
  Lock,
  Database,
  Download,
  Trash2,
  Key
} from 'lucide-react';

export default function ClientSettings() {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    projectUpdates: true,
    paymentAlerts: true,
    marketingEmails: false,
    
    // Privacy Settings
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true,
    
    // Appearance Settings
    theme: 'system',
    language: 'ar',
    dateFormat: 'dd/mm/yyyy',
    timezone: 'Asia/Riyadh',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true
  });

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const notificationSettings = [
    {
      id: 'emailNotifications',
      label: 'إشعارات البريد الإلكتروني',
      description: 'تلقي إشعارات مهمة عبر البريد الإلكتروني',
      icon: Mail
    },
    {
      id: 'smsNotifications',
      label: 'إشعارات الرسائل النصية',
      description: 'تلقي إشعارات عاجلة عبر الرسائل النصية',
      icon: MessageSquare
    },
    {
      id: 'pushNotifications',
      label: 'الإشعارات الفورية',
      description: 'إشعارات فورية على الهاتف أو المتصفح',
      icon: Smartphone
    },
    {
      id: 'projectUpdates',
      label: 'تحديثات المشاريع',
      description: 'إشعارات حول تقدم مشاريعك',
      icon: Bell
    },
    {
      id: 'paymentAlerts',
      label: 'تنبيهات الدفع',
      description: 'إشعارات المدفوعات والفواتير',
      icon: Bell
    },
    {
      id: 'marketingEmails',
      label: 'رسائل تسويقية',
      description: 'تلقي عروض وأخبار الشركة',
      icon: Mail
    }
  ];

  const privacySettings = [
    {
      id: 'dataSharing',
      label: 'مشاركة البيانات',
      description: 'السماح بمشاركة البيانات لتحسين الخدمة',
      icon: Database
    },
    {
      id: 'analyticsTracking',
      label: 'تتبع التحليلات',
      description: 'تتبع استخدام الموقع لتحسين التجربة',
      icon: Eye
    }
  ];

  const securitySettings = [
    {
      id: 'twoFactorAuth',
      label: 'المصادقة الثنائية',
      description: 'طبقة حماية إضافية لحسابك',
      icon: Shield
    },
    {
      id: 'loginAlerts',
      label: 'تنبيهات تسجيل الدخول',
      description: 'إشعار عند تسجيل الدخول من جهاز جديد',
      icon: Lock
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>
          <p className="text-muted-foreground">تخصيص تفضيلاتك وإعدادات الحساب</p>
        </div>
      </div>

      <ResponsiveGrid cols="1-2" gap="lg">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              إعدادات الإشعارات
            </CardTitle>
            <CardDescription>
              تحكم في كيفية ومتى تتلقى الإشعارات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {notificationSettings.map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">{setting.label}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings[setting.id as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              إعدادات المظهر
            </CardTitle>
            <CardDescription>
              تخصيص مظهر الواجهة وطريقة العرض
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">المظهر</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleSettingChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      فاتح
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      داكن
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      تلقائي
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">اللغة</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">تنسيق التاريخ</Label>
              <Select
                value={settings.dateFormat}
                onValueChange={(value) => handleSettingChange('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/mm/yyyy">يوم/شهر/سنة</SelectItem>
                  <SelectItem value="mm/dd/yyyy">شهر/يوم/سنة</SelectItem>
                  <SelectItem value="yyyy-mm-dd">سنة-شهر-يوم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">المنطقة الزمنية</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                  <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                  <SelectItem value="Asia/Cairo">القاهرة (GMT+2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              إعدادات الخصوصية
            </CardTitle>
            <CardDescription>
              تحكم في خصوصية بياناتك ومعلوماتك
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profileVisibility">ظهور الملف الشخصي</Label>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) => handleSettingChange('profileVisibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">عام</SelectItem>
                  <SelectItem value="private">خاص</SelectItem>
                  <SelectItem value="contacts">جهات الاتصال فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {privacySettings.map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">{setting.label}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings[setting.id as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              إعدادات الأمان
            </CardTitle>
            <CardDescription>
              تعزيز أمان حسابك وحماية بياناتك
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {securitySettings.map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">{setting.label}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings[setting.id as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
                  />
                </div>
              );
            })}

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">انتهاء صلاحية الجلسة (دقائق)</Label>
              <Select
                value={settings.sessionTimeout.toString()}
                onValueChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 دقيقة</SelectItem>
                  <SelectItem value="30">30 دقيقة</SelectItem>
                  <SelectItem value="60">ساعة واحدة</SelectItem>
                  <SelectItem value="120">ساعتان</SelectItem>
                  <SelectItem value="0">بلا انتهاء</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full">
                <Key className="w-4 h-4 mr-2" />
                تغيير كلمة المرور
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                تنزيل بياناتي
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            منطقة الخطر
          </CardTitle>
          <CardDescription>
            إجراءات لا يمكن التراجع عنها
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              إلغاء تفعيل الحساب
            </Button>
            <Button variant="destructive" className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              حذف الحساب نهائياً
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            تحذير: حذف الحساب سيؤدي إلى فقدان جميع البيانات والمشاريع بشكل نهائي
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  );
}