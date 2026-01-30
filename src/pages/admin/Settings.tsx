import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Globe, Bell, Shield, Palette, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';

const AdminSettings = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">{isRTL ? 'الإعدادات' : 'Settings'}</h2>
        <p className="text-muted-foreground">
          {isRTL ? 'إعدادات النظام والتفضيلات' : 'System settings and preferences'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              {isRTL ? 'الإعدادات العامة' : 'General Settings'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'إعدادات الموقع الأساسية' : 'Basic site settings'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الموقع' : 'Site Name'}</Label>
              <Input defaultValue="ASH Holding" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input defaultValue="info@alialshehriholding.com" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الهاتف' : 'Phone'}</Label>
              <Input defaultValue="+966 55 581 2567" dir="ltr" />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {isRTL ? 'إعدادات اللغة' : 'Language Settings'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'إعدادات اللغة والترجمة' : 'Language and localization'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isRTL ? 'العربية' : 'Arabic'}</p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'اللغة الافتراضية' : 'Default language'}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isRTL ? 'الإنجليزية' : 'English'}</p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'لغة ثانوية' : 'Secondary language'}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {isRTL ? 'إعدادات الإشعارات' : 'Notification Settings'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'إدارة الإشعارات والتنبيهات' : 'Manage notifications'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isRTL ? 'إشعارات البريد' : 'Email Notifications'}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isRTL ? 'إشعارات الطلبات' : 'Order Notifications'}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isRTL ? 'إشعارات النظام' : 'System Notifications'}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {isRTL ? 'إعدادات الأمان' : 'Security Settings'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'إعدادات الأمان والخصوصية' : 'Security and privacy'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isRTL ? 'المصادقة الثنائية' : 'Two-Factor Auth'}</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isRTL ? 'تسجيل النشاط' : 'Activity Logging'}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-4 h-4 me-2" />
          {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
