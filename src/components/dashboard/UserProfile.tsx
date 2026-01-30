import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Key,
  Bell,
  Globe,
  Palette,
  Camera,
  Save,
  Edit3,
  Lock,
  Smartphone,
  History,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const mockSessions: SecuritySession[] = [
  {
    id: '1',
    device: 'Chrome on Windows',
    location: 'Riyadh, Saudi Arabia',
    lastActive: 'Now',
    current: true,
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    location: 'Jeddah, Saudi Arabia',
    lastActive: '2 hours ago',
    current: false,
  },
  {
    id: '3',
    device: 'Firefox on MacOS',
    location: 'Dubai, UAE',
    lastActive: '1 day ago',
    current: false,
  },
];

export const UserProfile: React.FC = () => {
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const [profile, setProfile] = useState({
    name: language === 'ar' ? 'محمد الشهري' : 'Mohammed Alshehri',
    email: 'mohammed@alshehriholding.com',
    phone: '+966 50 123 4567',
    company: language === 'ar' ? 'شركة علي صالح الشهري القابضة' : 'Ali Saleh Alshehri Holding',
    role: language === 'ar' ? 'المدير التنفيذي' : 'Chief Executive Officer',
    department: language === 'ar' ? 'الإدارة العليا' : 'Executive Management',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('dashboard.profile')}</h2>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'إدارة معلومات حسابك' : 'Manage your account information'}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-[400px] grid-cols-3">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'الملف' : 'Profile'}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            {t('settings.security')}
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Palette className="w-4 h-4 mr-2" />
            {t('settings.preferences')}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                        {profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      {profile.role}
                    </Badge>
                  </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                    </h3>
                    <Button
                      variant={isEditing ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {t('action.save')}
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
                      <div className="relative">
                        <User className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', language === 'ar' ? 'right-3' : 'left-3')} />
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          disabled={!isEditing}
                          className={cn(language === 'ar' ? 'pr-10' : 'pl-10')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                      <div className="relative">
                        <Mail className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', language === 'ar' ? 'right-3' : 'left-3')} />
                        <Input
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className={cn(language === 'ar' ? 'pr-10' : 'pl-10')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
                      <div className="relative">
                        <Phone className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', language === 'ar' ? 'right-3' : 'left-3')} />
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className={cn(language === 'ar' ? 'pr-10' : 'pl-10')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'الشركة' : 'Company'}</Label>
                      <div className="relative">
                        <Building className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', language === 'ar' ? 'right-3' : 'left-3')} />
                        <Input
                          value={profile.company}
                          disabled
                          className={cn(language === 'ar' ? 'pr-10' : 'pl-10')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password & 2FA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {language === 'ar' ? 'الأمان' : 'Security Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{language === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'آخر تغيير منذ 30 يوماً' : 'Last changed 30 days ago'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تغيير' : 'Change'}
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{language === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}</Label>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled 
                        ? (language === 'ar' ? 'مفعّل' : 'Enabled')
                        : (language === 'ar' ? 'معطّل' : 'Disabled')
                      }
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  {language === 'ar' ? 'الجلسات النشطة' : 'Active Sessions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      'flex items-start justify-between p-3 rounded-lg border',
                      session.current && 'bg-success/5 border-success/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{session.device}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {session.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <History className="w-3 h-3" />
                          {session.lastActive}
                        </div>
                      </div>
                    </div>
                    {session.current ? (
                      <Badge variant="outline" className="text-success border-success">
                        {language === 'ar' ? 'الحالي' : 'Current'}
                      </Badge>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-destructive">
                        {language === 'ar' ? 'إنهاء' : 'End'}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {t('settings.notifications')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{language === 'ar' ? 'إشعارات البريد' : 'Email Notifications'}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'تلقي الإشعارات عبر البريد' : 'Receive notifications via email'}
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{language === 'ar' ? 'الإشعارات الفورية' : 'Push Notifications'}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'تلقي الإشعارات الفورية' : 'Receive push notifications'}
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {language === 'ar' ? 'إعدادات العرض' : 'Display Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.language')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'العربية' : 'English'}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {language === 'ar' ? 'عربي' : 'English'}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.theme')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'يتم التحكم به من الشريط العلوي' : 'Controlled from the header'}
                    </p>
                  </div>
                  <Badge variant="outline">
                    <Palette className="w-3 h-3 mr-1" />
                    {language === 'ar' ? 'تلقائي' : 'Auto'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
