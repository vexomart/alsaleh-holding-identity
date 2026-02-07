/**
 * Customer Settings Page
 * User preferences and account settings
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Settings,
  Bell,
  Globe,
  Moon,
  Sun,
  Shield,
  User,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Mail,
  Lock,
  Eye,
  Palette,
  Languages,
  BellRing,
} from 'lucide-react';

interface SettingItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: React.ElementType;
  type: 'toggle' | 'link';
  href?: string;
  defaultValue?: boolean;
}

export function CustomerSettings() {
  const { language, setLanguage } = useLanguage();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    marketingEmails: false,
    darkMode: false,
    twoFactorAuth: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newValue = !prev[key];
      toast.success(
        isRTL 
          ? `تم ${newValue ? 'تفعيل' : 'تعطيل'} الإعداد بنجاح`
          : `Setting ${newValue ? 'enabled' : 'disabled'} successfully`
      );
      return { ...prev, [key]: newValue };
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const notificationSettings: SettingItem[] = [
    {
      id: 'emailNotifications',
      titleAr: 'إشعارات البريد الإلكتروني',
      titleEn: 'Email Notifications',
      descAr: 'استلام التحديثات عبر البريد الإلكتروني',
      descEn: 'Receive updates via email',
      icon: Mail,
      type: 'toggle',
      defaultValue: true,
    },
    {
      id: 'pushNotifications',
      titleAr: 'الإشعارات الفورية',
      titleEn: 'Push Notifications',
      descAr: 'إشعارات فورية على المتصفح',
      descEn: 'Instant browser notifications',
      icon: BellRing,
      type: 'toggle',
      defaultValue: true,
    },
    {
      id: 'smsNotifications',
      titleAr: 'إشعارات SMS',
      titleEn: 'SMS Notifications',
      descAr: 'استلام رسائل نصية على الجوال',
      descEn: 'Receive text messages on mobile',
      icon: Smartphone,
      type: 'toggle',
      defaultValue: false,
    },
    {
      id: 'orderUpdates',
      titleAr: 'تحديثات الطلبات',
      titleEn: 'Order Updates',
      descAr: 'إشعارات عند تغيير حالة الطلب',
      descEn: 'Notifications when order status changes',
      icon: Bell,
      type: 'toggle',
      defaultValue: true,
    },
  ];

  const accountSettings = [
    {
      titleAr: 'الملف الشخصي',
      titleEn: 'Profile',
      descAr: 'تعديل بيانات الحساب الشخصية',
      descEn: 'Edit personal account information',
      icon: User,
      href: '/portal/profile',
    },
    {
      titleAr: 'الأمان',
      titleEn: 'Security',
      descAr: 'كلمة المرور والمصادقة الثنائية',
      descEn: 'Password and two-factor authentication',
      icon: Shield,
      href: '/portal/security',
    },
    {
      titleAr: 'المحفظة',
      titleEn: 'Wallet',
      descAr: 'إدارة الرصيد وطرق الدفع',
      descEn: 'Manage balance and payment methods',
      icon: CreditCard,
      href: '/portal/wallet',
    },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 rounded-2xl bg-primary/10">
          <Settings className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? 'الإعدادات' : 'Settings'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة تفضيلات حسابك' : 'Manage your account preferences'}
          </p>
        </div>
      </motion.div>

      {/* Language & Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              {isRTL ? 'المظهر واللغة' : 'Appearance & Language'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'تخصيص واجهة المستخدم' : 'Customize the user interface'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-background">
                  <Languages className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {isRTL ? 'اللغة' : 'Language'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'اختر لغة الواجهة' : 'Choose interface language'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={language === 'ar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('ar')}
                >
                  العربية
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
              </div>
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-background">
                  {settings.darkMode ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {isRTL ? 'الوضع الليلي' : 'Dark Mode'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تبديل المظهر الفاتح والداكن' : 'Toggle light and dark theme'}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {isRTL ? 'الإشعارات' : 'Notifications'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'تحكم في طريقة استلام الإشعارات' : 'Control how you receive notifications'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background">
                    <setting.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {isRTL ? setting.titleAr : setting.titleEn}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? setting.descAr : setting.descEn}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings[setting.id as keyof typeof settings] as boolean}
                  onCheckedChange={() => handleToggle(setting.id as keyof typeof settings)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {isRTL ? 'إعدادات الحساب' : 'Account Settings'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'إدارة حسابك وأمانه' : 'Manage your account and security'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {accountSettings.map((setting, index) => (
              <button
                key={setting.href}
                onClick={() => navigate(setting.href)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl",
                  "hover:bg-muted/50 transition-colors text-start"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <setting.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {isRTL ? setting.titleAr : setting.titleEn}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? setting.descAr : setting.descEn}
                    </p>
                  </div>
                </div>
                <ChevronIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {isRTL ? 'الأمان والخصوصية' : 'Security & Privacy'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-background">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {isRTL ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'حماية إضافية لحسابك' : 'Extra protection for your account'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settings.twoFactorAuth ? (
                  <Badge variant="default" className="bg-emerald-500/10 text-emerald-600">
                    {isRTL ? 'مفعل' : 'Enabled'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    {isRTL ? 'معطل' : 'Disabled'}
                  </Badge>
                )}
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={() => handleToggle('twoFactorAuth')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <LogOut className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {isRTL ? 'خروج' : 'Sign Out'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
